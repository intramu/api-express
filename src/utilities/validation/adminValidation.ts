import { body } from "express-validator";
import { AdminRole, AdminStatus, Language } from "../enums/userEnum";
import { authIdBody, listEnums, validate } from "./common";
import { printEnums } from "./validationSchemas";

export const newAdminSchema = validate([
    // authIdBody.notEmpty().withMessage("value 'authId' is missing"),
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
        .withMessage("emailAddress is not correctly formatted"),
    body("language")
        .notEmpty()
        .withMessage("value language is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Language))
        .withMessage(printEnums(Language, "language")),
    body("role")
        .notEmpty()
        .withMessage("value 'role' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(AdminRole))
        .withMessage(printEnums(AdminRole, "role")),
    body("status")
        .notEmpty()
        .withMessage("value 'status' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(AdminStatus))
        .withMessage(printEnums(AdminStatus, "status")),
]);

export const patchAdminSchema = validate([
    body("firstName")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 2, max: 20 })
        .withMessage("firstName requires length from 2 to 20"),
    body("lastName")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 2, max: 20 })
        .withMessage("lastName requires length from 2 to 20"),
    body("emailAddress")
        .optional()
        .trim()
        .escape()
        .isEmail()
        .withMessage("emailAddress is not correctly formatted"),
    body("language")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Language))
        .withMessage(printEnums(Language, "language")),
    body("role")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(AdminRole))
        .withMessage(printEnums(AdminRole, "role")),
    body("status")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(AdminStatus))
        .withMessage(printEnums(AdminStatus, "status")),
]);
