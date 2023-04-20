import { body } from "express-validator";
import { graduationTerms } from "../constantsThatNeedAHome";
import { Language, PlayerGender, PlayerStatus, PlayerVisibility } from "../enums/userEnum";
import { authIdBody, listEnums, printEnums, validate } from "./common";

export const newPlayerSchemaUser = validate([
    authIdBody,
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
    body("language")
        .notEmpty()
        .withMessage("value language is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Language))
        .withMessage(printEnums(Language, "language")),
    body("emailAddress")
        .notEmpty()
        .withMessage("value 'emailAddress' is missing")
        .trim()
        .escape()
        .isEmail()
        .withMessage("emailAddress is not correctly formatted"),
    body("gender")
        .notEmpty()
        .withMessage("value gender is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(PlayerGender))
        .withMessage(printEnums(PlayerGender, "gender")),
    body("dob")
        .notEmpty()
        .withMessage("value 'dob(Date of Birth)' is missing")
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("dob (Date of Birth) is required in format YYYY-MM-DD"),
    body("visibility")
        .notEmpty()
        .withMessage("value 'visibility' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(PlayerVisibility))
        .withMessage(printEnums(PlayerVisibility, "visibility")),
    body("graduationTerm")
        .notEmpty()
        .withMessage("value 'graduationTerm' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn([graduationTerms[0], graduationTerms[1], graduationTerms[2]])
        .withMessage(
            `valid graudation options are ${graduationTerms[0]}, ${graduationTerms[1]}, ${graduationTerms[2]}`
        ),
]);

export const newPersonSchema = validate([
    body("authId").optional().trim().escape(),
    body("status")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(PlayerStatus))
        .withMessage(printEnums(PlayerStatus, "status")),
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
    body("dateOfBirth")
        .notEmpty()
        .withMessage("value 'dateOfBirth' is missing")
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("dateOfBirth is required in format YYYY-MM-DD"),
    // body("organizationId")
    //     .notEmpty()
    //     .withMessage("value 'organizationId' is missing")
    //     .isUUID()
    //     .withMessage("organizationId is not in UUID format"),
    body("gender")
        .notEmpty()
        .withMessage("value gender is missing")
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
        .withMessage("value language is missing")
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
        .toUpperCase()
        .isIn([graduationTerms[0], graduationTerms[1], graduationTerms[2]])
        .withMessage(
            `valid graudation options are ${graduationTerms[0]}, ${graduationTerms[1]}, ${graduationTerms[2]}`
        ),
]);

export const patchPersonSchema = validate([
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
    body("dateOfBirth")
        .optional()
        .isDate({ format: "YYY-MM-DD", strictMode: true })
        .withMessage("dateOfBirth is required in format YYYY-MM-DD"),
    // body("organizationId").isUUID().withMessage("organizationId is not in UUID format"),
    body("gender")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(PlayerGender))
        .withMessage(printEnums(PlayerGender, "gender")),
    body("visibility")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(PlayerVisibility))
        .withMessage(printEnums(PlayerVisibility, "visibility")),
    body("language")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Language))
        .withMessage(printEnums(Language, "language")),
    body("status")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(PlayerStatus))
        .withMessage(printEnums(PlayerStatus, "status")),
    // body("image").optional().trim().escape(),
    body("graduationTerm")
        .optional()
        .trim()
        .escape()
        .toUpperCase()
        .isIn([graduationTerms[0], graduationTerms[1], graduationTerms[2]])
        .withMessage(
            `valid graudation options are ${graduationTerms[0]}, ${graduationTerms[1]}, ${graduationTerms[2]}`
        ),
]);
