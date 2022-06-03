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
const app = (0, express_1.default)();
const tokenGenerator = new ManagementApiTokenGen_1.default();
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
app.get("/test", (req, res, next) => {
    console.log(req.ip);
    res.send("huyrray");
    winstonConfig_1.default.info("test");
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
    const processRequest = () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield tokenGenerator.getToken();
        if (token === null) {
            winstonConfig_1.default.error("Could not retrieve management token for authorization");
            res.status(403).json({
                message: "Action forbidden by server",
                error: "Token error",
            });
            return;
        }
        axios_1.default
            .patch(`https://dev-5p-an07k.us.auth0.com/api/v2/users/${details.id}`, { user_metadata: { profile_completion_status: "complete" } }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
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
    });
    processRequest();
});
app.get("*", (req, res) => {
    console.log("404 Not Found | Request URL: ", req.url);
    res.status(404).send("404 Not Found");
});
app.listen(process.env.EXPRESSPORT, () => {
    console.log(`App listening on port ${process.env.EXPRESSPORT}`);
});
