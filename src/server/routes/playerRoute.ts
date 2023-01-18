import express from "express";
import { body, checkSchema, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import { graduationTerms } from "../../utilities/constantsThatNeedAHome";
import { Gender, Visibility } from "../../utilities/enums";
import { newPersonSchema, patchPersonSchema } from "../../utilities/validationSchemas";

const router = express.Router();

const playerService = new PlayerBusinessService();

router.get("/:id", async (req, res) => {
    const response = await playerService.findPlayerById(req.params.id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    res.status(200).json(response);
});

const testArray: string[] = ["MALE", "FEMALE"];

router.post(
    "/",
    checkSchema({
        firstName: {
            notEmpty: {
                errorMessage: "value firstName is missing",
            },
            trim: {},
            escape: {},
            isLength: {
                options: { min: 2, max: 20 },
                errorMessage: `firstName requires length from 2 to 20`,
            },
        },
        lastName: {
            notEmpty: {
                errorMessage: "value lastName is missing",
            },
            trim: {},
            escape: {},
            isLength: {
                options: { min: 2, max: 20 },
                errorMessage: `lastName requires length from 2 to 20`,
            },
        },
        emailAddress: {
            notEmpty: {
                errorMessage: "value emailAddress is missing",
            },
            trim: {},
            isEmail: {
                errorMessage: "emailAddress is not correctly formatted",
            },
        },
        dateOfBirth: {
            notEmpty: {
                errorMessage: "value dateOfBirth is missing",
            },
            isDate: {
                options: {
                    format: "YYYY-MM-DD",
                    strictMode: true,
                },
                errorMessage: "dateOfBirth is required in format YYYY-MM-DD",
            },
        },
        organizationId: {
            notEmpty: {
                errorMessage: "value organizationId is missing",
            },
            isUUID: {
                errorMessage: "organizationId is not in UUID format",
            },
        },
    }),
    body("gender")
        .trim()
        .notEmpty()
        .withMessage("value gender is missing")
        .toUpperCase()
        .isIn([Gender.FEMALE, Gender.MALE])
        .withMessage(`valid gender options are [${Gender.MALE}, ${Gender.FEMALE}]`),
    body("language")
        .trim()
        .notEmpty()
        .withMessage("value language is missing")
        .toUpperCase()
        .isIn(["ENGLISH"])
        .withMessage(`valid language options are [ENGLISH]`),
    body("graduationTerm")
        .trim()
        .notEmpty()
        .withMessage("value graduationTerm is missing")
        .toUpperCase()
        .isIn(graduationTerms)
        //todo: this error message returns undefined
        .withMessage(
            "valid graduationTerm options are " +
                graduationTerms.forEach((term) => {
                    console.log(term);

                    return term + ", ";
                })
        ),
    body("visibility")
        .trim()
        .notEmpty()
        .withMessage("value visibility is missing")
        .toUpperCase()
        .isIn([Visibility.CLOSED, Visibility.OPEN, Visibility.PRIVATE])
        .withMessage(
            `valid visibility options are ${Visibility.CLOSED}, ${Visibility.OPEN}, ${Visibility.PRIVATE}`
        ),
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            const errorResponse = errors.array()[0].msg;
            return res.status(400).json(APIResponse[400](errorResponse));
        }

        const auth = req.auth?.payload;
        const authId = auth?.sub;

        const body = req.body;

        const response = await playerService.createPlayer(
            new Player(
                authId!,
                body.firstName,
                body.lastName,
                body.language,
                body.emailAddress,
                null,
                body.gender,
                body.dateOfBirth,
                body.visibility,
                body.graduationTerm,
                null,
                null,
                null,
                body.organizationId
            )
        );
        res.status(200).json("hit the correct endpoint");
    }
);

router.patch("/", patchPersonSchema, async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        const errorResponse = errors.array()[0].msg;
        return res.status(400).json(APIResponse[400](errorResponse));
    }

    // //grab the authId of the user from the authorization token
    // const auth = req.auth?.payload;
    // const authId = auth?.sub;

    // const body = req.body;

    // const response = await playerService.completePlayerProfile(
    //     new Player(
    //         // authId!,
    //         body.id,
    //         body.firstName,
    //         body.lastName,
    //         body.language,
    //         "",
    //         null,
    //         body.gender,
    //         body.dateOfBirth,
    //         body.visibility,
    //         body.graduationTerm,
    //         null,
    //         null,
    //         null,
    //         null
    //     )
    // );

    // if (response instanceof APIResponse) {
    //     return res.status(response.statusCode).json(response);
    // }

    res.status(200).json(req.body);
});

export default router;
