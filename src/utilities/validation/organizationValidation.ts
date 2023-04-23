import { body } from "express-validator";
import { OrganizationStatus } from "../enums/commonEnum";
import { Language } from "../enums/userEnum";
import { authIdBody, listEnums, printEnums, validate } from "./common";

/** Validation schemas for Organization objects */

export const updateOrganizationSchema = validate([
    body("name")
        .notEmpty()
        .withMessage("value 'name' is missing for organization")
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage("name requires length from 2 to 50"),
    body("info")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1, max: 400 })
        .withMessage("info requires length from 1 to 4000"),
    body("mainColor")
        .optional()
        .trim()
        .escape()
        .isHexColor()
        .withMessage("mainColor is not a hex value"),
    body("approvalStatus")
        .optional()
        .trim()
        .escape()
        .isIn(listEnums(OrganizationStatus))
        .withMessage(printEnums(OrganizationStatus, "status")),
]);

export const newOrganizationSchemaWithAuth0 = validate([
    body("admin.firstName")
        .notEmpty()
        .withMessage("value 'firstName' is missing for admin")
        .trim()
        .escape()
        .isLength({ min: 2, max: 20 })
        .withMessage("firstName requires length from 2 to 20"),
    body("admin.lastName")
        .notEmpty()
        .withMessage("value 'lastName' is missing for admin")
        .trim()
        .escape()
        .isLength({ min: 2, max: 30 })
        .withMessage("lastname requires length from 2 to 30"),
    body("admin.language")
        .notEmpty()
        .withMessage("value 'language' is missing for admin")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Language))
        .withMessage(printEnums(Language, "language")),
    body("admin.emailAddress")
        .notEmpty()
        .withMessage("value 'emailAddress' is missing for admin")
        .trim()
        .escape()
        .isEmail()
        .withMessage("emailAddress is not correctly formatted for admin"),
    body("organization.name")
        .notEmpty()
        .withMessage("value 'name' is missing for organization")
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage("name requires length from 2 to 50"),
    body("organization.info")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1, max: 400 })
        .withMessage("info requires length from 1 to 4000"),
    body("organization.mainColor")
        .optional()
        .trim()
        .escape()
        .isHexColor()
        .withMessage("mainColor is not a hex value"),
]);

export const newOrganizationSchema = validate([
    authIdBody.notEmpty().withMessage("value 'authId' is missing"),
    body("admin.firstName")
        .notEmpty()
        .withMessage("value 'firstName' is missing for admin")
        .trim()
        .escape()
        .isLength({ min: 2, max: 20 })
        .withMessage("firstName requires length from 2 to 20"),
    body("admin.lastName")
        .notEmpty()
        .withMessage("value 'lastName' is missing for admin")
        .trim()
        .escape()
        .isLength({ min: 2, max: 30 })
        .withMessage("lastname requires length from 2 to 30"),
    body("admin.language")
        .notEmpty()
        .withMessage("value 'language' is missing for admin")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Language))
        .withMessage(printEnums(Language, "language")),
    body("admin.emailAddress")
        .notEmpty()
        .withMessage("value 'emailAddress' is missing for admin")
        .trim()
        .escape()
        .isEmail()
        .withMessage("emailAddress is not correctly formatted for admin"),
    body("organization.name")
        .notEmpty()
        .withMessage("value 'name' is missing for organization")
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage("name requires length from 2 to 50"),
    body("organization.info")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1, max: 400 })
        .withMessage("info requires length from 1 to 4000"),
    body("organization.mainColor")
        .optional()
        .trim()
        .escape()
        .isHexColor()
        .withMessage("mainColor is not a hex value"),
]);
