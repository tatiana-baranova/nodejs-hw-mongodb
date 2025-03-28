import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
    try {
        const password = getEnvVar("MONGODB_PASSWORD");
        const user = getEnvVar("MONGODB_USER");
        const url = getEnvVar("MONGODB_URL");
        const name = getEnvVar("MONGODB_DB");
        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${name}?retryWrites=true&w=majority&appName=Cluster1`);
        console.log("Mongo connection successfully established!");
    } catch (error) {
        console.log(error.message);
        throw error;

    }
};
