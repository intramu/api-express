// import express from "express";
// import { auth } from "express-oauth2-jwt-bearer";
// const router = express.Router();

// const checkJwt = auth({
//     audience: "https://server-authorization/",
//     issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
// });

// router.post("/", (req, res) => {
//     let body = req.body;

//     console.log(body);

//     res.status(200).json({ message: "nice!" });
// });

// router.get("/test", (req, res) => {
//     let body = req.body;

//     console.log(body);
//     res.status(200).json({ message: "Admin routes" });
// });

// router.get("/wow", (req, res) => {
//     res.json({ work: "please" });
// });

// export default router;
