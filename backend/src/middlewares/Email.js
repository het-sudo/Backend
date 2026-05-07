import { transporter } from "./Email.config.js";

import {
  RESET_PASSWORD_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./Emailtemplate.js";

export const sendResetLink = async (email, resetLink) => {
  try {
    const htmlTemplate = RESET_PASSWORD_TEMPLATE.replace(
      /{resetLink}/g,
      resetLink,
    );

    const response = await transporter.sendMail({
      from: '"Cloudmate Technologies LLP" <het@voicenova.ai>',

      to: email,

      subject: "Reset Your Password",

      text: `Reset your password using this link: ${resetLink}`,

      html: htmlTemplate,
    });

    console.log("Reset email sent successfully", response.messageId);
  } catch (error) {
    console.log("Reset email error", error.message);

    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{name}", name).replace(
      "{websiteLink}",
      "http://localhost:8080",
    );

    const response = await transporter.sendMail({
      from: '"Cloudmate Technologies LLP" <het@voicenova.ai>',

      to: email,

      subject: "Welcome to Cloudmate",

      text: `Welcome ${name} to Cloudmate Technologies LLP`,

      html: htmlTemplate,
    });

    console.log("Welcome email sent successfully", response.messageId);
  } catch (error) {
    console.log("Welcome email error", error.message);

    throw error;
  }
};
