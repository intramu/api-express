import express from "express";
import { auth } from "express-oauth2-jwt-bearer";

import admin from "./routes/adminRoute";
import player from "./routes/playerRoute";
import team from "./routes/teamRoute";
import organization from "./routes/organizationRoute";

const app = express();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

app.use(express.json());

// app.use('/api/admin', admin)
app.use("/api/player", player);
app.use("/api/team", team);
app.use("/api/organization", organization);

// app.get("/private", checkJwt, (req, res) => {
//     const auth = req.auth;

//     console.log("auth", auth);

//     console.log(req.params);
//     console.log(req.query);
//     console.log(req.headers);

//     res.status(200).json("wow");
// });

app.listen(8080, () => {
    console.log(`App listening on port 8080`);
});
