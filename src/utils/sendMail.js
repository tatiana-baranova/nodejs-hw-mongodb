import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

// console.log({
//     host: getEnvVar(SMTP.SMTP_HOST),
//     port: Number(getEnvVar(SMTP.SMTP_PORT)),
//     user: getEnvVar(SMTP.SMTP_USER),
//     pass: getEnvVar(SMTP.SMTP_PASSWORD),
// });

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: Number(getEnvVar(SMTP.SMTP_PORT)),
    secure: false,
    auth: {
        user: getEnvVar(SMTP.SMTP_USER),
        pass: getEnvVar(SMTP.SMTP_PASSWORD),
    },
});
export const sendEmail = async (options) => {
    try {
        const result = await transporter.sendMail(options);
        return result;
    } catch (error) {
        console.error('SEND EMAIL ERROR:', error);
        throw error;
    }
};
