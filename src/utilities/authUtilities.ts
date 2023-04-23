import { ManagementClient } from "auth0";
import { auth } from "express-oauth2-jwt-bearer";
import { generate } from "generate-password";

/**
 * Middelware import from auth0 that checks if incoming JWT is valid
 * and user credentials
 */
// TODO: add environment config
export const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

/**
 * Creates client for interacting with Auth0's management API
 * https://auth0.com/docs/api/management/v2
 */
// TODO!: client id and secret need to be in env values. Very insecure!
export const auth0 = new ManagementClient({
    domain: "dev-5p-an07k.us.auth0.com",
    clientId: "kJSlepUUcaMHM5Qi4DOcsOkTToZtOpie",
    clientSecret: "Pgtyf53JVpnnjn_RlpVHDSDgSp4Vqzwqg3J7RQdtnL7l6oNLVUzJPjYDfY2MrakM",
});

export const generateRandomPasword = generate({
    length: 20,
    numbers: true,
    uppercase: true,
    symbols: true,
});
