import express from 'express';
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
dotenv.config();

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({
        transport: {
            target: 'pino-pretty'
        }
    }));

    app.get("/", (req, res) => {
        req.json({
            message: "Server start successfully"
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found'
        });
    });

    app.use((error, req, res, next) => {
        res.status(500).json({
            message: error.message,
        });
    });

    const port = Number(process.env.PORT);
    console.log(process.env.PORT);

    app.listen(port, () => console.log(`Server running on ${port} port`));

};
