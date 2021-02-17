// La NASA
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const { enviar } = require("./mailer");
const { generarCorreo } = require("./correo");
const expressFileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");

const {
    getUsuarios,
    nuevoUsuario,
    getUsuario,
    changeAuth,
    getNombre,
} = require("./consultas");

//Configuracion
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    expressFileUpload({
        limits: { fileSize: 5000000 },
        abortOnLimit: true,
        responseOnLimit: " El peso del archivo que intentas subir supera el limite permitido",
    })
);

app.engine(
    "hbs",
    exphbs({
        layoutsDir: path.join(__dirname, "./views/"),
        partialsDir: path.join(__dirname, "./views/components"),
        defaultLayout: "main",
        extname: "hbs",
    }));
app.set("view engine", "hbs");

// Server
app.listen(3000, () => {
    console.log("Server ON");
});

// Middlewars
app.use(
    "/bootstrap",
    express.static(__dirname + "/node_modules/bootstrap/dist/css")
);

app.use(
    "/bootstrapJs",
    express.static(__dirname + "/node_modules/bootstrap/dist/js")
);

app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

app.use("/assets", express.static(__dirname + "/assets"));

//Rutas
app.get("/", async function(req, res) {
    res.render("Home", {
        layout: "Home",
    });
});

app.post("/usuario", async(req, res) => {
    const { email, nombre, password, auth } = req.body;
    const respuesta = await nuevoUsuario(email, nombre, password, auth);
    if (respuesta) {
        const correo = generarCorreo(nombre, email, auth);
        const para = correo.para.join(",");
        const asunto = correo.asunto;
        const contenido = correo.contenido;
        await enviar(para, asunto, contenido);
    }
    respuesta == false ?
        res.status(500).send({
            error: "500 Duplicado",
            message: "Usuario ya existe en la Base de Datos",
        }) :
        res.send(respuesta);
});

app.get("/admin", async(req, res) => {
    const usuariosData = await getUsuarios();
    res.render("Admin", {
        layout: "Admin",
        usuarios: usuariosData,
    });
});

app.get("/usuarios", async(req, res) => {
    const respuesta = await getUsuarios();
    res.send(respuesta);
});

app.get("/login", async(req, res) => {
    res.render("Login", {
        layout: "Login",
    });
});



app.post("/api/login", async(req, res) => {
    const { email, password } = req.body;
    const user = await getUsuario(email, password);
    if (user == false) {
        res.status(404).send({
            error: "404 Not Found",
            message: "No existe el recurso solicitado",
        });
    } else {
        res.send(user);
    }
});

app.post("/auth", async(req, res) => {
    const { id, auth } = req.body;
    const user = await getNombre(id);
    nombreUsuario = user.nombre;
    emailUsuario = user.email;
    try {
        const respuesta = await changeAuth(id, auth);
        if (respuesta == 1) {
            correo = generarCorreo(nombreUsuario, emailUsuario, auth);
            para = correo.para.join(",");
            asunto = correo.asunto;
            contenido = correo.contenido;
            await enviar(para, asunto, contenido);
        }
        res.send(respuesta);
    } catch (e) {
        res.status(500).send(e);
    }
});

let nombreUsuario = "";
let emailUsuario = "";
let passwordUsuario = "";
const secretKey = "Clave Secreta";
app.post("/token", async(req, res) => {

    const { email, password } = req.body;
    console.log(email, " ", password);
    const user = await getUsuario(email, password);
    emailUsuario = email;
    passwordUsuario = password;
    console.log("user: ", user);
    if (user) {
        if (user.auth) {
            const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 120,
                    data: { email, password },
                },
                secretKey
            );
            console.log(token);
            res.send({
                token
            });
        } else {
            res.status(401).send({
                error: "401 Unauthorized",
                message: "Usuario aun no validado para subir imágenes",
            });
        }
    } else {
        res.status(404).send({
            error: "404 Not Found ",
            message: "Usuario no registrado en la base de datos",
        });
    }
});

/* 
app.get("/Dashboard", (req, res) => {
    res.render("Evidencias", {
        layout: "Evidencias",
        nombre: nombreUsuario,
    });
}); */

app.get("/Evidencias", async(req, res) => {


    console.log("/Evidencias ", emailUsuario, " ", passwordUsuario);
    const {
        token
    } = req.query;
    const user = await getUsuario(emailUsuario, passwordUsuario);
    console.log("verify user", user);
    jwt.verify(token, secretKey, (err, decoded) => {
        err
            ?
            res.status(401).send({
                error: "401 Unauthorized",
                message: "Usuario no autorizado",
            }) :
            res.render("Evidencias", { nombre: decoded.data.nombre });
    });
});

app.post("/upload", (req, res) => {
    const { foto } = req.files;
    const { name } = foto;
    const ruta = `${__dirname}/assets/imgs/${name}`;
    const mensaje = "Agradecemos su interes de colaborar con la NASA.";
    foto.mv(path.join(__dirname, "/assets/imgs/", name), (err) => {
        if (err) throw err;
        res.send(mensaje);
    });
});

app.get("*", (req, res) => {
    res.send("Esta página no existe!!!");
});