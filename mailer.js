const nodemailer = require("nodemailer");

const enviar = async(to, subject, html) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "nodemaileradl@gmail.com",
            pass: "desafiolatam",
        },
    });

    let mailOption = {
        from: '"👽" <nodemailerADL@gmail.com>',
        to,
        subject,
        html,
    };

    const enviarMensaje = await transporter.sendMail(mailOption);
    return enviarMensaje;
};

module.exports = { enviar };