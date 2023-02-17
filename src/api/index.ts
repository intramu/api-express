import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";

import serviceIndex from "./routes/service/serviceIndex";
import { APIResponse } from "../models/APIResponse";

const app = express();

// auth0 library checks token against my server
const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

// needed to read json input
app.use(express.json());

// needed to make cross origin requests to this server
app.use(cors());

// import for service api
app.use("/api/v1", serviceIndex);

// 404 handler when no endpoint is found
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res, next) => {
    console.log("404 Not Found | Request URL: ", req.url);
    res.status(404).send("404 Not Found. Sorry not sure what you were looking for");
});

// General error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).json(APIResponse[500]("Not sure what happened. We're on it!"));
});

app.listen(8080, () => {
    console.log(`App listening on port 8080`);
});
