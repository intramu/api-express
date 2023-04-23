import express from "express";
import { body, param, ValidationChain, validationResult } from "express-validator";
import { APIResponse } from "../../models/APIResponse";
import { TeamRole } from "../enums/teamEnum";

/** Validation file with common methods for all other validation files to use */

/**
 * Enumerates through enum and prints out values in a message stating valid options
 * @param enumValue - enum to enumerate through
 * @param enumName - name of enum
 * @returns - message with list of valid options
 */
export const printEnums = (enumValue: any, enumName: string) => {
    // adds values of enum to list spacing out each value, then converts into string
    const list = Object.values(enumValue)
        .map((value) => ` ${value}`)
        .toString();

    // rips of last comma on list of options
    return `valid ${enumName} options are [${list.substring(0, list.length)} ]`;
};

/** Enumerates through enum and creates value list for validation */
export const listEnums = (enumValue: any) => Object.values(enumValue).map((value: any) => value);

/**
 * This is a middleware function that will run on every request wherever its added. It will validate all
 * user input based on the schema provided to it.
 * @param validations
 * @returns
 */
export const validate = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // validation check first runs on all fields and the validation chain
        for (const validation of validations) {
            const result = await validation.run(req);
            if (result.array().length) {
                break;
            }
        }

        const errors = validationResult(req);

        // if error exists return bad request
        if (!errors.isEmpty()) {
            const errorResponse = errors.array()[0].msg;
            return res.status(400).json(APIResponse.BadRequest(errorResponse));
        }

        // TODO: needs to be fixed
        // // checks for extra fields
        // const extraFields = checkIfExtraFields(validations, req);

        // // if extra fields exists return bad request
        // if (extraFields) {
        //     return res.status(400).json(APIResponse.BadRequest("Incorrect fields"));
        // }

        // All good, pass to next middleware
        return next();
    };
};

/**
 * Checks for extra fields in request body and returns true if they exist
 * @param validators - validation chain
 * @param req - express request object
 * @returns - boolean value if other fields were present
 */
const checkIfExtraFields = (validators: any[], req: express.Request) => {
    // loops through validation chain and finds number of allowed fields based on the
    // validation schema
    const allowedFields = validators
        .reduce((fields, rule) => {
            return [...fields, ...rule.builder.fields];
        }, [])
        .sort();

    // finds the actual number of fields present in body
    const requestInput = { ...req.body };
    const requestFields = Object.keys(requestInput).sort();

    // returns false if there are extra values
    if (JSON.stringify(allowedFields) === JSON.stringify(requestFields)) {
        return false;
    }
    // logger.error(`${req.ip} try to make a invalid request`)
    console.log("issue here");

    return true;
};

// Requires auth id param to meet the required format of auth0 id's
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

// Requires organization Id param to be in UUID format
export const organizationIdParamTemp = param("orgId")
    .isUUID()
    .withMessage("Organization id must be in UUID format");

// Requires team id to be greater than 0
export const teamIdParam = validate([
    param("teamId").isInt({ min: 1 }).withMessage("Team id must be a number greater than 0"),
]);

// Requires competition entities to have and id greater than 0
export const compIdParam = validate([
    param("compId").isInt({ min: 1 }).withMessage("Competition id must be a number greater than 0"),
]);

// Requires "authId" body field to meet the required format of auth0 id's
export const authIdBody = body("authId")
    .notEmpty()
    .withMessage("value 'authId' is missing")
    .trim()
    .escape()
    .custom((str: string) => str.substring(0, 6) === "auth0|")
    .withMessage("User auth_id's must be prepended with 'auth0|'")
    .isLength({ min: 30, max: 30 })
    .withMessage("User's auth_id must be 30 characters");

// requires "role" body field to be enum type
export const teamRoleBody = validate([
    body("role")
        .notEmpty()
        .withMessage("value 'role' is required for patching")
        .trim()
        .toUpperCase()
        .isIn([TeamRole.COCAPTAIN, TeamRole.PLAYER])
        .withMessage("valid role options are [ COCAPTAIN, PLAYER ] "),
]);
