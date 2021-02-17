const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "nasa",
    port: 5432,
});

const getUsuarios = async() => {
    try {
        const result = await pool.query("SELECT * FROM usuarios ORDER BY nombre");
        return result.rows;
    } catch (e) {
        console.log("Clase de Error:", e.code);
        return e;
    }
};

const nuevoUsuario = async(email, nombre, password, auth) => {
    const sqlInsertUser = {
        text: `INSERT INTO usuarios(email, nombre, password, auth) VALUES('${email}', '${nombre}', '${password}', '${auth}') RETURNING *;`,
    };

    const sqlSelectUser = {
        text: `SELECT * FROM usuarios WHERE email = '${email}'`,
    };

    let validaUsuario = false;
    try {
        const resultado = await pool.query(sqlSelectUser);
        //resultado.rowCount == 0 ? console.log('No Existe') : console.log('Existe');
        resultado.rowCount == 0 ? (validaUsuario = true) : (validaUsuario = false);
    } catch (e) {
        console.log("Clase de Error:", e.code);
        return e;
    }

    try {
        if (validaUsuario) {
            const resUsuario = await pool.query(sqlInsertUser);
            return resUsuario.rows;
        } else {
            return false;
        }
    } catch (e) {
        console.log("Duplicado");
        console.log("Clase de Error:", e.code);
        return e;
    }
};

const getUsuario = async(email, password) => {
    const sqlUserAutorizado = {
        text: `SELECT * FROM usuarios WHERE email = '${email}'
                    AND password = '${password}'
                    AND auth = true `,
    };

    const sqlUserExiste = {
        text: `SELECT nombre FROM usuarios WHERE email = '${email}'`,
    };

    let existeUsuario = false;
    try {
        const resultado = await pool.query(sqlUserExiste);
        resultado.rowCount == 0 ? (existeUsuario = true) : (existeUsuario = false);
        console.log('existeUsuario ', existeUsuario)
    } catch (e) {
        console.log("Clase de Error:", e.code);
        return e;
    }
    let usuario;
    let usuarioAutorizado = false;
    try {
        const resAuth = await pool.query(sqlUserAutorizado);
        //   console.log('resAuth: ', resAuth)
        resAuth.rowCount == 0 ?
            (usuarioAutorizado = false) :
            (usuarioAutorizado = true);
        console.log(resAuth.rows[0])
        usuario = resAuth.rows[0];
        console.log('usuario autorizado: ', usuario);
    } catch (e) {
        console.log("Clase de Error:", e.code);
        return e;
    }

    if (existeUsuario == true) {
        console.log('USUARIO NO EXISTE: TRUE');
        //usuario no existe
        return false;
    } else if (usuarioAutorizado == true) {
        //usuario existe y autorizado
        console.log('USUARIO EXISTE Y ESTA AUTORIZADO')
        return usuario;
    } else {
        console.log('USUARIO NO EXISTE Y NO AUTORIZADO')
            //usuario no existe, no autorizado
        return false;
    }
};

const changeAuth = async(auth, id) => {
    try {
        const result = await pool.query(
            "UPDATE usuarios SET auth=$1 where id = $2 RETURNING *;", [auth, id]
        );
        return result.rowCount;
    } catch (e) {
        console.log(e.code);
        return e;
    }
};

const getNombre = async(id) => {
    const sqlUserNombre = {
        text: `SELECT * FROM usuarios WHERE id = '${id}'`,
    };

    try {
        const resultado = await pool.query(sqlUserNombre);
        return resultado.rows[0];
    } catch (e) {
        console.log("Clase de Error:", e.code);
        return e;
    }
};

module.exports = {
    getUsuarios,
    nuevoUsuario,
    getUsuario,
    changeAuth,
    getNombre
};