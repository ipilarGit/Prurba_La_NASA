const generarCorreo = (nombre, email, auth) => {
    let contenido = ";"
    let asunto = "";
    if (auth == true) {
        asunto = "Autorización - Credenciales NASA";
        let contenidoAutorizado = `
        <h1>Estimado(a) ${nombre}:</h1>
        <br>
        <p>Hemos recibido su interés de colaborar con la NASA, por lo que le informamos que sus credenciales han sido</p>
        <p>autorizadas y usted ya cuenta con el permiso para subir imágenes desde nuestra plataforma.</p>
        <br>
        <p>Que tengas un excelente día.</p> 
        <p>Atte. NASA 👽</p>`;
        contenido = contenidoAutorizado;
    } else {
        asunto = "Notificación - Credenciales NASA";
        let contenidoRegistrado = `
        <h1>Estimado(a) ${nombre}:</h1>
        <br>
        <p>Hemos recibido su interés de colaborar con la NASA, por lo que estamos a la espera de verificación de sus</p>
        <p>credenciales y le informaremos de la autorización para subir imágenes a través de nuestra plataforma.</p>
        <br>
        <p>Que tengas un excelente día.</p> 
        <p>Atte. NASA 👽</p>`;
        contenido = contenidoRegistrado;
    };

    let para = [email, "nodemailerADL@gmail.com"];

    return { para, asunto, contenido };
};

module.exports = { generarCorreo };