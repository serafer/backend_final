import { createTransport } from "nodemailer";
import config from "../utils/config.js";
import { templateHtml } from "./template.js";
import { logger } from "../utils/logger.js";

export const transporterEthereal = createTransport({
  host: config.HOST,
  port: config.PORT_ETHEREAL,
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});

export const mailOptionsEthereal = {
  from: config.EMAIL,
  to: config.EMAIL,
  subject: "Bienvenido/a",
  //text: 'Este es el texto del email',
  // html: `<h1>Bienvenido a Coderhouse</h1>`,
  html: templateHtml,
  // attachments: [
  //     {
  //         //path: process.cwd() + '/src/services/adjunto.txt',
  //         //filename: `resumen-de-cuenta-${process.env.EMAIL_ETHEREAL}`
  //     }
  // ]
};

export const transporterGmail = createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL_GMAIL,
    pass: config.PASSWORD_GMAIL,
  },
});

export const sendGmail = async (user, service, token = null) => {
  try {
    const { first_name, email } = user;
    let subject = "";
    let message = "";

    if (service === "login") {
      subject = "Inicio de sesión exitoso";
      message = `<h1>Hola ${first_name}, Tu inicio de sesión fue exitoso</h1>`;
    } else if (service === "register") {
      subject = "Bienvenido/a";
      message = `<h1>Hola ${first_name}, ¡Te damos la bienvenida!</h1>`;
    } else if (service === "deleteOldUser") {
      subject = "Su usuario ha sido eliminado";
      message = `<h1>Hola ${first_name}, Lamentamos informate que debido a la inactividad en la cuenta, tu usuario ha sido eliminado. Esperamos volver a verte muy pronto. Saludos</h1>`;
    } else if (service === "userDeleted") {
      subject = "Su usuario ha sido eliminado";
      message = `<h1>Hola ${first_name}, Lamentamos informate que tu usuario ha sido eliminado. Ante cualquier consulta, contactate con el centro de atención. Saludos</h1>`;
    } else if (service === "productDeleted") {
      subject = "Su producto ha sido eliminado";
      message = `<h1>Hola ${first_name}, Le informamos que su producto ha sido eliminado. Ante cualquier consulta, contactate con el centro de atención. Saludos</h1>`;
    } else if (service === "resertPass") {
      subject = "Restablecimiento de contraseña";
      message = `<h1>Hola ${first_name}, ingresa al 
            <a href='http://localhost:${config.PORT}/api/new-pass'>AQUI</a>
            para actualizar tu contraseña.</h1>`;
    } else {
      throw new Error("Servicio no válido");
    }

    const mailOptions = {
      from: config.EMAIL_GMAIL,
      to: email,
      subject: subject,
      html: message,
    };

    const response = await transporterGmail.sendMail(mailOptions);
    if (token !== null) return token;
    logger.debug("Sent mail");
  } catch (err) {
    throw new Error(err.message);
  }
};
