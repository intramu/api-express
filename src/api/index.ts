import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";

import serviceIndex from "./routes/service/serviceIndex";
import userIndex from "./routes/user/userIndex";
import { APIResponse } from "../models/APIResponse";

const app = express();

// needed to read json input
app.use(express.json());

// needed to make cross origin requests to this server
app.use(cors());

// import for service api
app.use("/api/sudo/v1", serviceIndex);
app.use("/api/user/v1", userIndex);

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

    return res.status(500).json(APIResponse.InternalError("Not sure what happened. We're on it!"));
    // return res.status(500).json(APIResponse.InternalError(`error: ${err.stack ?? err.name}`));
});

app.listen(8080, () => {
    console.log(`App listening on port 8080`);
});
