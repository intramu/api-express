import { body } from "express-validator";
import { TeamVisibility } from "../enums/teamEnum";
import { authIdBody, listEnums, printEnums, validate } from "./common";

/** Validation schemas for team objects */

export const newTeamSchema = validate([
    body("name")
        .notEmpty()
        .withMessage("value 'name' is missing")
        .trim()
        .escape()
        .isLength({ min: 2, max: 30 })
        .withMessage("name requires length from 2 to 30"),
    // body("image").notEmpty().withMessage("images not currently supported, leave blank value"),
    body("visibility")
        .notEmpty()
        .withMessage("value 'visibility' is missing")
        .isIn(listEnums(TeamVisibility))
        .withMessage(printEnums(TeamVisibility, "visibility")),
    body("divisionId")
        .notEmpty()
        .withMessage("value 'divisionId' is missing")
        .isInt({ min: 0 })
        .withMessage("divisionId must be positive"),
]);

export const newJoinRequestSchema = validate([
    body("expirationDate")
        .notEmpty()
        .withMessage("value 'expirationDate' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("expirationDate is required in format YYYY-MM-DD")
        .isAfter()
        .withMessage("expirationDate must be a future date"),
    authIdBody,
]);
