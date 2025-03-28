import express from 'express';
import cors from "cors";
import pino from "pino-http";
import { getEnvVar } from './utils/getEnvVar.js';
import { ContactCollection } from '../src/db/models/Contact.js';
import { getContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({
        transport: {
            target: 'pino-pretty'
        }
    }));

    app.get("/contacts", async (req, res) => {
        const data = await getContacts();

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
    });

    app.get("/contacts/:contactId", async (req, res) => {
        const { contactId } = req.params;

        const data = await getContactById(contactId);
        res.json({
            status: 200,
            message: "Successfully found contact with id {contactId}!",
            data,
        });
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found',
            });
        }
    });

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
