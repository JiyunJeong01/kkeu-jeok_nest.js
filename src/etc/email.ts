import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: "naver",
    host: "smtp.naver.com",
    port: 465,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMPT_USER as string,
        pass: process.env.SMPT_PASSWORD as string,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export { smtpTransport };
