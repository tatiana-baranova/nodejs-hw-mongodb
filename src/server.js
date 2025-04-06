import express from 'express';
import cors from "cors";
import pino from "pino-http";
import { getEnvVar } from './utils/getEnvVar.js';
// import { getContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({
        transport: {
            target: 'pino-pretty'
        }
    }));

    app.use((req, res) => {
        res.status(404).json({
            message: 'Contact not found',
        });
    });

    app.use((error, req, res, next) => {
        res.status(500).json({
            message: error.message,
        });
    });

    const port = Number(getEnvVar("PORT", 3000));

    app.listen(port, () => console.log(`Server running on ${port} port`));

};
