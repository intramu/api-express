require("dotenv").config();
import express from "express";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import MATokenGenerator from "../utilities/ManagementApiTokenGen";
import axios from "axios";
import expressWinston from "express-winston";
import winston from "winston";
import logger from "../utilities/winstonConfig";

const app = express();

const tokenGenerator = new MATokenGenerator();

app.use(express.json());
app.use(cors());

expressWinston.requestWhitelist.push("ip");
app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
    })
);

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    return res
        .set(err.headers)
        .status(err.status)
        .json({ message: err.message });
});

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

/** ROUTES */
app.get("/public", (req, res) => {
    tokenGenerator.getToken().then((token) => {
        console.log(token);
        axios
            .patch(
                "https://dev-5p-an07k.us.auth0.com/api/v2/users/auth0|62756151cfc4810067c25882",
                { user_metadata: { profile_completion_status: "complete" } },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    });

    res.json({
        message: "Public API. Hello World!",
    });
});

app.get("/private", checkJwt, (req, res) => {
    res.json({
        message: "Private. Must be authenticated to see this",
    });
});

/**
 * Listens for details relating to the final setup of a profile
 * Once the details have successfully been added to the database
 * A call will be made to the Auth0 Management API to set the
 * "profile_status" to finished. The user has completed their profile
 */

app.get("/test", (req, res, next) => {
    console.log(req.ip);
    res.send("huyrray");

    logger.info("test");
});

app.post("/createsecprofile", (req, res) => {
    let details = req.body;

    console.log(details);
    let condition = [
        details.id,
        details.firstName,
        details.lastName,
        details.gender,
        details.language,
        details.graduationTerm,
        details.dateOfBirth,
        details.profileVisibility,
        details.profileCompletionStatus,
    ];

    if (!condition.every((x) => x)) {
        console.log("Body Structure Invalid");
        res.status(400).json({ message: "Body Structure Invalid" });
        return;
    }

    const processRequest = async () => {
        const token = await tokenGenerator.getToken();

        if (token === null) {
            logger.error(
                "Could not retrieve management token for authorization"
            );

            res.status(403).json({
                message: "Action forbidden by server",
                error: "Token error",
            });
            return;
        }

        axios
            .patch(
                `https://dev-5p-an07k.us.auth0.com/api/v2/users/${details.id}`,
                { user_metadata: { profile_completion_status: "complete" } },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                if (response.status != 200) {
                    console.log("bad arequet");
                    res.status(500).json({
                        message: "Bad request to external server",
                    });
                    return;
                }
                res.status(200).json({
                    message: "Secondary user profile successfully updated",
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: "Bad request to external server",
                });
            });
    };

    processRequest();
});

app.get("*", (req, res) => {
    console.log("404 Not Found | Request URL: ", req.url);
    res.status(404).send("404 Not Found");
});
app.listen(process.env.EXPRESSPORT, () => {
    console.log(`App listening on port ${process.env.EXPRESSPORT}`);
});
