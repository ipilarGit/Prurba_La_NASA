/* let tbody = document.getElementById("cuerpo");
let email = document.getElementById("email");
let nombre = document.getElementById("nombre");
let pasword = document.getElementById("password");

let users = [];

const getData = async() => {
    await axios.get("http://localhost:3000/usuarios").then((data) => {
        users = data.data;
        console.log(users);
    });
};
getData();

const newUsuario = async() => {
    let dato = {
        email: email.value,
        nombre: nombre.value,
        password: password.value,
        auth: false,
    };
    await axios.post("http://localhost:3000/usuario", dato).then((data) => {

        console.log("usuario registrado:", data.data);
        alert("Usuario registrado con éxito");
        getData();
    }).catch((e) => {
        console.log(e);
        alert("Usuario ya existe en la Base de Datos!!")
    })

    email.value = "";
    nombre.value = "";
    password.value = "";
}; */
let email = document.getElementById("email");
let pasword = document.getElementById("password");

const verificacion = async() => {

    console.log('pase por aqui');

    let datos = {
        email: email.value,
        password: password.value
    };

    await axios.post("http://localhost:3000/token", datos).then((resultado) => {

        console.log('resultado', resultado);
        const { data } = resultado;
        const { token } = data;
        localStorage.setItem("token", token);
        console.log("data ", data);

        alert("Usuario registrado para ver imagenes");

    }).catch((e) => {
        console.log(e);
        alert("Usuario no puede ver imagenes o usuario no existe")
    })

    ////////////////////////////

    let tbody = document.getElementById("cuerpo");
    let users = [];
    const getData = async() => {
        await axios.get("http://localhost:3000/usuarios").then((data) => {
            users = data.data;
            console.log(users);

            tbody.innerHTML = "";
            users.forEach((u, i) => {
                console.log(u.auth);
                tbody.innerHTML += `
                  <tr>
                      <td>${i + 1}</td>
                      <td>${u.nombre}</td>
                      <td>${u.email}</td>
                      <input type="checkbox" id="myCheck" checked onclick="if(this.checked){ autorizar(${i},'${u.id}')} else {verificar(${i},'${u.id}')
         }">
                  </tr>
                  `;
            });
        });
    }
    getData();

    const autorizar = (i, id) => {
        console.log(i, ' ', id);

        const check = document.getElementById("myCheck").checked;
        if (check) {
            console.log('cambiar a true en tabla')
        }
    };

    const verificar = (i, id) => {
        console.log(i, ' ', id);
        const check = document.getElementById("myCheck").checked;
        if (!check) {
            console.log('debe estar sin autorizacion')
        }
    }


}

/////////////////////////////////////


let email = document.getElementById("email");
let password = document.getElementById("password");
let datos = {
    email: email.value,
    password: password.value,
};
const verificacion = async() => {

    await axios.post("http://localhost:3000/api/login", datos).then((data) => {
        console.log('usuario registrado y autorizado', data.data);

        getToken();
    }).catch((e) => {
        const mensaje = "Estimado Usuario, usted aun no se encuentra autorizado para subir imagenes o no existe información suya en nuestros registros";
        console.log(e);
        alert(mensaje)
    })
};

{
    {
        !--
        const getAutenticacion = async(datos) => {

            await axios.post("http://localhost:3000/loggin", datos).then((data) => {
                console.log('', data.data);
            }).catch((e) => {
                alert('contraseña incorrecta')
                console.log(e);
            })
        };
        --
    }
}

const getToken = async() => {

    await axios.post("http://localhost:3000/token", datos).then((resultado) => {

        console.log('resultado', resultado);
        const { data } = resultado;
        const { token } = data;
        localStorage.setItem("token", token);
        console.log("data ", data);
        window.location = "http://localhost:3000/Dashboard";
    }).catch((e) => {
        console.log(e);
    })
};
email.value = "";
password.value = "";

////////////////////7

// Evidencias

const token = localStorage.getItem("token")
axios.post("/verify", {}, {
    headers: {
        token
    }
}).then(data => {
    console.log(data.data)
}).catch(e => console.log(e))




/////////////


const datos = {
    email: email.value,
    password: password.value,
};
const token = localStorage.getItem("token")
axios.post("/verify", { datos }, {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}).then(data => {
    console.log(data.data)
}).catch(e => console.log(e))