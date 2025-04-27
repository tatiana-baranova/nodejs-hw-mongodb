import express from 'express';
import cors from "cors";
import { logger } from "./middlewares/logger.js";
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(logger);
    app.use(cookieParser());

    app.use(router);
    app.use(notFoundHandler);
    app.use(errorHandler);

    app.use('/uploads', express.static(UPLOAD_DIR));

    app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
    const port = Number(getEnvVar("PORT", 3000));

    app.listen(port, () => console.log(`Server running on ${port} port`));

};
