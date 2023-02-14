import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Player } from "../../../models/Player";
import {
    finishProfileSchema,
    newPersonSchema,
    patchPersonSchema,
    validate,
} from "../../../utilities/validationSchemas";

const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

const playerService = new PlayerBusinessService();

// todo: add validation schema, there should already be one
// todo: add param for organization
router.post("/organization/:id", checkJwt, async (req, res) => {
    const { sub } = req.auth!.payload;
    const { id } = req.params;

    const reqBody = req.body;

    const response = await playerService.completePlayerProfile(
        new Player({
            authId: sub!,
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            language: reqBody.language,
            emailAddress: reqBody.emailAddress,
            gender: reqBody.gender,
            dob: reqBody.dateOfBirth,
            visibility: reqBody.visibility,
            graduationTerm: reqBody.graduationTerm,
            image: reqBody.image,
            status: reqBody.status,
            dateCreated: null,
        }),
        id
    );

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(201).json(req.body);
});

router
    .route("/")
    .get(checkJwt, async (req, res) => {
        const { sub } = req.auth!.payload;
        const response = await playerService.findPlayerById(sub!);

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    })
    .patch(checkJwt, async (req, res) => {
        return res.json(APIResponse[501]());
    });

/** Returns a more limited amount of details on player compared to person profile */
router.get("/:id", checkJwt, async (req, res) => {
    return res.json(APIResponse[501]());
});

export default router;
