"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const router = express_1.default.Router();
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});
router.post("/competition", checkJwt, (req, res) => {
    let body = req.body;
    console.log(body);
    res.status(200).json({ message: "nice!" });
});
exports.default = router;
