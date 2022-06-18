"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const ManagementApiTokenGen_1 = __importDefault(require("../utilities/ManagementApiTokenGen"));
const axios_1 = __importDefault(require("axios"));
const express_winston_1 = __importDefault(require("express-winston"));
const winston_1 = __importDefault(require("winston"));
const winstonConfig_1 = __importDefault(require("../utilities/winstonConfig"));
const Player_1 = require("../models/Player");
const PlayerBusinessService_1 = require("../business/PlayerBusinessService");
const Team_1 = require("../models/Team");
const playerDAO_1 = __importDefault(require("../data/playerDAO"));
const app = (0, express_1.default)();
const tokenGenerator = new ManagementApiTokenGen_1.default();
const playerBS = new PlayerBusinessService_1.PlayerBusinessService();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
express_winston_1.default.requestWhitelist.push("ip");
app.use(express_winston_1.default.logger({
    transports: [new winston_1.default.transports.Console()],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
}));
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res
        .set(err.headers)
        .status(err.status)
        .json({ message: err.message });
});
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});
/** ROUTES */
app.get("/public", (req, res) => {
    tokenGenerator.getToken().then((token) => {
        console.log(token);
        axios_1.default
            .patch("https://dev-5p-an07k.us.auth0.com/api/v2/users/auth0|62756151cfc4810067c25882", { user_metadata: { profile_completion_status: "complete" } }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
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
    let temp = new playerDAO_1.default();
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
    const processRequest = () => __awaiter(void 0, void 0, void 0, function* () {
        //to make a request to the auth0 endpoint a token has to be created to access the management api
        //the token generator makes this request
        const token = yield tokenGenerator.getToken();
        //some error with the management token generator
        if (token === null) {
            winstonConfig_1.default.error("Could not retrieve management token for authorization");
            //returns status error
            res.status(403).json({
                message: "Action forbidden by server",
                error: "Token error",
            });
            return;
        }
        let createdPlayer = Player_1.Player.SecondaryPlayer(details.id, details.firstName, details.lastName, details.language, "USER", details.gender, new Date(), details.visibility, details.graduationTerm, "NULL", "VALID");
        // playerDao.createSecondaryPlayer(createdPlayer, (callback: any) => {
        //     console.log(callback);
        // });
        //if token was not null, the patch request is made using axios
        axios_1.default
            .patch(`https://dev-5p-an07k.us.auth0.com/api/v2/users/${details.id}`, 
        //the user's metadata is updated with a completion status
        { user_metadata: { profile_completion_status: "complete" } }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
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
    });
    //calls the above method to allow for asynchrounous execution
    processRequest();
});
app.post("/team/showAllPlayersTeams", checkJwt, (req, res, next) => {
    let details = req.body;
    if (!details.playerId || typeof details.playerId !== "string") {
        winstonConfig_1.default.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }
    playerBS.showAllPlayersTeams(details.playerId, (result) => {
        if (result.code === -1) {
            winstonConfig_1.default.error(result.message, {
                class: "index",
            });
            return res.status(500).json(result);
        }
        winstonConfig_1.default.verbose(result.message, {
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
        winstonConfig_1.default.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }
    let createdTeam = Team_1.Team.CreatedTeam(details.name, details.image, details.visibility, details.sport);
    //
    playerBS.createTeam(createdTeam, details.playerId, (result) => {
        if (result.code === -1) {
            winstonConfig_1.default.error(result.message, {
                class: "index",
            });
            return res.status(500).json(result);
        }
        return res.status(200).json(result);
    });
});
app.get("/team/showAllTeams", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield playerBS.showAllTeams();
    setTimeout(() => {
        res.json(result);
    }, 5000);
}));
app.get("/showTeam");
app.post("/team/joinOpenTeam", checkJwt, (req, res, next) => {
    let details = req.body;
    if (!details.playerId ||
        !details.teamId ||
        typeof details.playerId !== "string" ||
        typeof details.teamId !== "number") {
        winstonConfig_1.default.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }
    playerBS.joinOpenTeam(details.playerId, details.teamId, (result) => {
        if (result.code === -1) {
            winstonConfig_1.default.error(result.message, {
                class: "index",
            });
            return res.status(500).json(result);
        }
        winstonConfig_1.default.info(result.message, {
            class: "index",
        });
        return res.status(200).json(result);
    });
});
app.delete("/team/leaveTeam", checkJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let details = req.body;
    console.log(details);
    if (!details.playerId ||
        !details.teamId ||
        typeof details.playerId !== "string" ||
        typeof details.teamId !== "number") {
        winstonConfig_1.default.error("Body structure invalid", {
            class: "index",
        });
        return res
            .status(400)
            .json({ message: "Body Structure Invalid", code: 0 });
    }
    let result = yield playerBS.leaveTeam(details.playerId, details.teamId);
    res.status(200).json(result);
}));
app.put("/team/updateTeam", checkJwt, (req, res, next) => {
    let details = req.body;
    console.log(details);
});
app.get("*", (req, res) => {
    console.log("404 Not Found | Request URL: ", req.url);
    res.status(404).send("404 Not Found");
});
app.listen(process.env.EXPRESSPORT, () => {
    console.log(`App listening on port ${process.env.EXPRESSPORT}`);
});
