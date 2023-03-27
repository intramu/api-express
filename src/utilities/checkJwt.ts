import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});
