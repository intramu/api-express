import express from "express";

import { body, param, ValidationChain, validationResult } from "express-validator";
import { APIResponse } from "../../models/APIResponse";
import { graduationTerms } from "../constantsThatNeedAHome";
import { Sport } from "../enums/commonEnum";
import {
    CompetitionStatus,
    CompetitionVisibility,
    ContestType,
    DivisionLevel,
    DivisionType,
    PlayoffSeedingType,
    TournamentType,
} from "../enums/competitionEnum";
import { Language, PlayerGender, PlayerStatus, PlayerVisibility } from "../enums/userEnum";

// utility methods
export const printEnums = (enumValue: any, enumName: string) => {
    // adds values of enum to list spacing out each value, then converts into string
    const list = Object.values(enumValue)
        .map((value) => ` ${value}`)
        .toString();

    // rips of last comma on list of options
    return `valid ${enumName} options are [${list.substring(0, list.length)} ]`;
};

export const listEnums = (enumValue: any) => Object.values(enumValue).map((value: any) => value);

// NR - this sequentially processes the errors and stops once one has failed, Not sure which one is better
// Eslint sure isn't happy about it, I had to disable a lot of things
/**
 * This is a middleware function that will run on every request wherever its added. It will validate all
 * user input based on the schema provided to it.
 * @param validations
 * @returns
 */
export const validate = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(req.url);

        // eslint-disable-next-line no-restricted-syntax
        for (const validation of validations) {
            // eslint-disable-next-line no-await-in-loop
            const result = await validation.run(req);
            if (result.array().length === 0) {
                break;
            }
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorResponse = errors.array()[0].msg;
        return res.status(400).json(APIResponse.BadRequest(errorResponse));
    };
};

// const test = body("authId").escape().body("test");
// schemas

export const finishProfileSchema = () => {
    return [
        body("firstName")
            .notEmpty()
            .withMessage("value 'firstName' is missing")
            .trim()
            .escape()
            .isLength({ min: 2, max: 20 })
            .withMessage("firstName requires length from 2 to 20"),
        body("lastName")
            .notEmpty()
            .withMessage("value 'lastName' is missing")
            .trim()
            .escape()
            .isLength({ min: 2, max: 20 })
            .withMessage("lastName requires length from 2 to 20"),
        body("emailAddress")
            .notEmpty()
            .withMessage("value 'emailAddress' is missing")
            .trim()
            .escape()
            .isEmail()
            .withMessage("email is not correctly formatted"),
        body("dateOfBirth")
            .notEmpty()
            .withMessage("value 'dateOfBirth' is missing")
            .trim()
            .escape()
            .isDate({ format: "YYYY-MM-DD", strictMode: true })
            .withMessage("dateOfBirth is required in format YYYY-MM-DD"),
        body("organizationId")
            .notEmpty()
            .withMessage("value 'organizationId' is missing")
            .trim()
            .escape()
            .isUUID()
            .withMessage("organizationId is not in UUID format"),
        body("gender")
            .notEmpty()
            .withMessage("value 'gender' is missing")
            .trim()
            .escape()
            .toUpperCase()
            .isIn(listEnums(PlayerGender))
            .withMessage(printEnums(PlayerGender, "gender")),
        body("visibility")
            .notEmpty()
            .withMessage("value 'visibility' is missing")
            .trim()
            .escape()
            .toUpperCase()
            .isIn(listEnums(PlayerVisibility))
            .withMessage(printEnums(PlayerVisibility, "visibility")),
        body("language")
            .notEmpty()
            .withMessage("value 'language is missing")
            .trim()
            .escape()
            .toUpperCase()
            .isIn(listEnums(Language))
            .withMessage(printEnums(Language, "language")),
        body("graduationTerm")
            .notEmpty()
            .withMessage("value 'graduationTerm' is missing")
            .trim()
            .escape()
            .isIn([graduationTerms[0], graduationTerms[1], graduationTerms[2]])
            .withMessage(
                `valid graduation options are ${graduationTerms[0]}, ${graduationTerms[1]}, ${graduationTerms[2]}`
            ),
    ];
};
// export const newContestSchema = () => {};

// Requires auth id param to meet the required length of 30 characters
export const authIdParam = validate([
    param("userId")
        .custom((str: string) => str.substring(0, 6) === "auth0|")
        .withMessage("User auth_id's must be prepended with 'auth0|'")
        .isLength({ min: 30, max: 30 })
        .withMessage("User's auth_id must be 30 characters"),
]);

// Requires organization Id param to be in UUID format
export const organizationIdParam = validate([
    param("orgId").isUUID().withMessage("Organization id must be in UUID format"),
]);

export const teamIdParam = validate([
    param("teamId").isInt({ min: 1 }).withMessage("Team id must be a number greater than 0"),
]);

export const compIdParam = validate([
    param("compId").isInt({ min: 1 }).withMessage("Competition id must be a number greater than 0"),
]);
