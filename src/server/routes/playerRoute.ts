import express from "express";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import { body, checkSchema, param, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import {
    finishProfileSchema,
    newPersonSchema,
    patchPersonSchema,
    validate,
} from "../../utilities/validationSchemas";

const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

const playerService = new PlayerBusinessService();

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
    // todo: add validation schema, there should already be one
    .post(checkJwt, async (req, res) => {
        const { sub } = req.auth!.payload;

        const reqBody = req.body;

        const response = await playerService.completePlayerProfile(
            new Player({
                authId: sub!,
                firstName: reqBody.firstName,
                lastName: reqBody.lastName,
                language: reqBody.language,
                emailAddress: reqBody.emailAddress,
                role: null,
                gender: reqBody.gender,
                dob: reqBody.dateOfBirth,
                visibility: reqBody.visibility,
                graduationTerm: reqBody.graduationTerm,
                image: reqBody.image,
                status: reqBody.status,
                dateCreated: null,
                organizationId: reqBody.organizationId,
            })
        );

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(201).json(req.body);
    })
    .patch(checkJwt, async (req, res) => {
        return res.json(APIResponse[501]());
    });

/** Returns a more limited amount of details on player compared to person profile */
router.get("/:id", checkJwt, async (req, res) => {
    return res.json(APIResponse[501]());
});

// sudo scoped
const sudoScoped = requiredScopes("all:application");
const adminScoped = requiredScopes("all:organization");
router
    .route("/sudo/:id")
    .get(checkJwt, sudoScoped, async (req, res) => {
        const response = await playerService.findPlayerById(req.params.id);

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    })
    .post(checkJwt, sudoScoped, async (req, res) => {
        const {
            authId,
            firstName,
            lastName,
            emailAddress,
            language,
            dateOfBirth,
            gender,
            graduationTerm,
            visibility,
            status,
            image,
            organizationId,
        } = req.body;

        const response = await playerService.createPlayer(
            new Player({
                authId,
                firstName,
                lastName,
                language,
                emailAddress,
                role: null,
                gender,
                dob: dateOfBirth,
                visibility,
                graduationTerm,
                image: "",
                status,
                dateCreated: null,
                organizationId,
            })
        );

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(201).json(response);
    })
    .patch(checkJwt, sudoScoped, async (req, res) => {
        const {
            firstName,
            lastName,
            emailAddress,
            language,
            dateOfBirth,
            gender,
            graduationTerm,
            visibility,
            status,
            image,
            organizationId,
        } = req.body;

        // todo: implement patch for player

        // if (response instanceof APIResponse) {
        //     return res.status(response.statusCode).json(response);
        // }

        // return res.status(200).json(response);
        return res.json(APIResponse[501]());
    });

/** creates new player with auth0 account */
router.post("/sudo/:id/account", checkJwt, sudoScoped, async (req, res) => {
    const {
        authId,
        firstName,
        lastName,
        emailAddress,
        language,
        dateOfBirth,
        gender,
        graduationTerm,
        visibility,
        status,
        image,
        organizationId,
    } = req.body;

    const response = await playerService.createPlayerWithAuth0Account(
        new Player({
            authId,
            firstName,
            lastName,
            language,
            emailAddress,
            role: null,
            gender,
            dob: dateOfBirth,
            visibility,
            graduationTerm,
            image: "",
            status,
            dateCreated: null,
            organizationId,
        })
    );

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(201).json(response);
});

/** Return all players under organization */
router.get("sudo/organization/:id", checkJwt, adminScoped, async (req, res) => {
    return res.json(APIResponse[501]());
});

export default router;
