import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

router.post("/organization", (req, res) => {
    let body = req.body;

    // const condition = [{
    //     id,
    //     name,
    //     image,
    // }]

    res.status(200).json({ message: "nice!" });
});

router.get("/test", (req, res) => {
    let body = req.body;

    console.log(body);
    res.status(200).json({ message: "Admin routes" });
});

router.get("/wow", (req, res) => {
    res.json({ work: "please" });
});

export default router;
