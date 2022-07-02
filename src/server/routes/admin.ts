import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

router.post("/competition", checkJwt, (req, res) => {
    let body = req.body;

    console.log(body);

    res.status(200).json({ message: "nice!" });
});

export default router;
