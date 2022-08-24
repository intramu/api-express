require("dotenv").config();
import express from "express";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import MATokenGenerator from "../utilities/ManagementApiTokenGen";
import axios from "axios";
import expressWinston from "express-winston";
import winston from "winston";
import logger from "../utilities/winstonConfig";
import { Player } from "../models/Player";
import { PlayerBusinessService } from "../business/PlayerBusinessService";
import { Team } from "../models/Team";
import PlayerDAO from "../data/playerDAO";
import admin from "./routes/admin";

const app = express();

const tokenGenerator = new MATokenGenerator();

const playerBS = new PlayerBusinessService();

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

app.delete("/test", checkJwt, (req, res, next) => {
    let details = req.body;
    let temp = new PlayerDAO();
    // temp.test(details.playerId, details.teamId, "USER", (result: any) => {
    //     console.log(result);
    // });
});

//
/**
 * Endpoint for a user's secondary profile to be created
 *
 * @param req The request object passed through the request
 * @param res The response object passed through the request
 *
 * NEEDS FIX
 */
app.post("/createsecprofile", (req, res, next) => {
    //grab the body that passed through the request and assign it to a variable details
    let details = req.body;

    console.log(details);

    //creates a list of conditions that will be checked
    let condition = [
        details.id,
        details.firstName,
        details.lastName,
        details.gender,
        details.language,
        details.graduationTerm,
        details.dateOfBirth,
        details.profileVisibility,
    ];

    //every condition in the list is checked to see if it was sent in the request
    if (!condition.every((x) => x)) {
        console.log("Body Structure Invalid");

        //if any condition is missing then the request is rejected and a 400 response is sent
        return res.status(400).json({ message: "Body Structure Invalid" });
    }

    /**
     * This validates that a user has finished their secondary profile setup. A request has to be made to auth0
     * endpoint to patch the users profile. The user profile was already created on setup but their profile is
     * incomplete.
     * 1. This sends a request first to the API endpoint to add the user to the database.
     * 2. Once this completes, the patch request is made to the auth0 endpoint where it marks their profile as
     * complete
     *
     * @returns Will return nothing if request failed at any point
     */
    const processRequest = async () => {
        //to make a request to the auth0 endpoint a token has to be created to access the management api
        //the token generator makes this request
        const token = await tokenGenerator.getToken();

        //some error with the management token generator
        if (token === null) {
            logger.error(
                "Could not retrieve management token for authorization"
            );

            //returns status error
            res.status(403).json({
                message: "Action forbidden by server",
                error: "Token error",
            });
            return;
        }

        let createdPlayer = Player.SecondaryPlayer(
            details.id,
            details.firstName,
            details.lastName,
            details.language,
            "USER",
            details.gender,
            new Date(),
            details.visibility,
            details.graduationTerm,
            "NULL",
            "VALID"
        );
        // playerDao.createSecondaryPlayer(createdPlayer, (callback: any) => {
        //     console.log(callback);
        // });

        //if token was not null, the patch request is made using axios
        axios
            .patch(
                `https://dev-5p-an07k.us.auth0.com/api/v2/users/${details.id}`,

                //the user's metadata is updated with a completion status
                { user_metadata: { profile_completion_status: "complete" } },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            //if auth0 returns a bad request then the user will receive a 500 error
            .then((response) => {
                if (response.status != 200) {
                    console.log("bad request");
                    res.status(500).json({
                        message: "Bad request to external server",
                    });
                    return;
                }

                //otherwise the user receives a success message
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

    //calls the above method to allow for asynchrounous execution
    processRequest();
});

app.post("/team/showAllPlayersTeams", checkJwt, (req, res, next) => {
    let details = req.body;
    if (!details.playerId || typeof details.playerId !== "string") {
        logger.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }

    playerBS.showAllPlayersTeams(details.playerId, (result: any) => {
        if (result.code === -1) {
            logger.error(result.message, {
                class: "index",
            });
            return res.status(500).json(result);
        }

        logger.verbose(result.message, {
            class: "index",
        });
        return res.status(200).json(result);
    });
});

app.post("/team/createTeam", checkJwt, (req, res, next) => {
    let details = req.body;

    let condition = [
        details.name,
        details.image,
        details.visibility,
        details.sport,
        details.playerId,
        typeof details.playerId === "string",
    ];

    //every condition in the list is checked to see if it was sent in the request
    if (!condition.every((x) => x)) {
        logger.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }

    let createdTeam = Team.CreatedTeam(
        details.name,
        details.image,
        details.visibility,
        details.sport
    );
    //
    playerBS.createTeam(createdTeam, details.playerId, (result: any) => {
        if (result.code === -1) {
            logger.error(result.message, {
                class: "index",
            });
            return res.status(500).json(result);
        }

        return res.status(200).json(result);
    });
});

app.get("/team/showAllTeams", async (req, res, next) => {
    let result = await playerBS.showAllTeams();

    setTimeout(() => {
        res.json(result);
    }, 5000);
});

app.get("/showTeam");

app.post("/team/joinOpenTeam", checkJwt, (req, res, next) => {
    let details = req.body;

    if (
        !details.playerId ||
        !details.teamId ||
        typeof details.playerId !== "string" ||
        typeof details.teamId !== "number"
    ) {
        logger.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }

    playerBS.joinOpenTeam(details.playerId, details.teamId, (result: any) => {
        if (result.code === -1) {
            logger.error(result.message, {
                class: "index",
            });
            return res.status(500).json(result);
        }

        logger.info(result.message, {
            class: "index",
        });
        return res.status(200).json(result);
    });
});

app.delete("/team/leaveTeam", checkJwt, async (req, res, next) => {
    let details = req.body;
    console.log(details);

    if (
        !details.playerId ||
        !details.teamId ||
        typeof details.playerId !== "string" ||
        typeof details.teamId !== "number"
    ) {
        logger.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }

    let result = await playerBS.leaveTeam(details.playerId, details.teamId);
    res.status(200).json(result);
});

app.put("/team/updateTeam", checkJwt, (req, res, next) => {
    let details = req.body;

    console.log(details);
});

app.get("/discover/:competitionId", (req, res, next) => {
    console.log(req.params);
    res.json("Nice");
});

app.get("*", (req, res) => {
    console.log("404 Not Found | Request URL: ", req.url);
    res.status(404).send("404 Not Found");
});

app.use("/admin", admin);

app.listen(process.env.EXPRESSPORT, () => {
    console.log(`App listening on port ${process.env.EXPRESSPORT}`);
});

// process.on("SIGTERM", () => {
//     console.log("This shit shutting down");
//     server.close(() => {
//         console.log("Server off");
//     });
// });
//
