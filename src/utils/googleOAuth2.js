import { OAuth2Client } from "google-auth-library";
import path from 'node:path';
import { readFile } from 'fs/promises';
import createHttpError from "http-errors";
import { getEnvVar } from './getEnvVar.js';
import dotenv from 'dotenv';
dotenv.config();
// console.log('GOOGLE_AUTH_CLIENT_ID:', process.env.GOOGLE_AUTH_CLIENT_ID);
// console.log('GOOGLE_AUTH_CLIENT_SECRET:', process.env.GOOGLE_AUTH_CLIENT_SECRET);
const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));
// console.log(oauthConfig);
const googleOAuthClient = new OAuth2Client({
    clientId: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
    clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
    redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () => {
    return googleOAuthClient.generateAuthUrl({
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
    });
};
// console.log(generateAuthUrl());
export const validateCode = async (code) => {
    const response = await googleOAuthClient.getToken(code);
    if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: response.tokens.id_token,
    });
    return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
    let fullName = 'Guest';
    if (payload.given_name && payload.family_name) {
        fullName = `${payload.given_name} ${payload.family_name}`;
    } else if (payload.given_name) {
        fullName = payload.given_name;
    }
    return fullName;
};
