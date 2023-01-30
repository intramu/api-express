import express from "express";

import { body, checkSchema, ValidationChain, validationResult } from "express-validator";
import { APIResponse } from "../models/APIResponse";
import { graduationTerms } from "./constantsThatNeedAHome";
import { Gender, Language, Role, Visibility } from "./enums";

// utility methods
const checkForValidGender = (value: string) =>
    Object.values(Gender).some((gender) => value === gender);

const checkForValidVisibility = (value: string) =>
    Object.values(Visibility).some((visibility) => value === visibility);

const checkForValidLanguage = (value: string) =>
    Object.values(Language).some((language) => value === language);

const checkForValidRole = (value: string) => Object.values(Role).some((role) => value === role);

const printEnums = (values: any, type: string) => {
    // adds values of enum to list spacing out each value, then converts into string
    const list = Object.values(values)
        .map((value) => ` ${value}`)
        .toString();

    // rips of last comma on list of options
    return `valid ${type} options are [${list.substring(0, list.length)} ]`;
};

// schemas
export const newPersonSchema = checkSchema({
    firstName: {
        notEmpty: {
            errorMessage: "value firstName is missing",
        },
        trim: true,
        escape: true,
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
    gender: {
        trim: true,
        notEmpty: {
            errorMessage: "value gender is missing",
        },
        toUpperCase: true,
        custom: {
            options: (value: string) => {
                return checkForValidGender(value);
            },
            errorMessage: printEnums(Gender, "gender"),
        },
    },
    visibility: {
        trim: true,
        notEmpty: {
            errorMessage: "value visibility is missing",
        },
        toUpperCase: true,
        custom: {
            options: (value: string) => {
                return checkForValidVisibility(value);
            },
            errorMessage: printEnums(Visibility, "visibility"),
        },
    },
    language: {
        trim: true,
        notEmpty: {
            errorMessage: "value language is missing",
        },
        toUpperCase: true,
        custom: {
            options: (value: string) => {
                return checkForValidLanguage(value);
            },
            errorMessage: printEnums(Language, "language"),
        },
    },
    graduationTerm: {
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: "value graduationTerm is missing",
        },
        toUpperCase: true,
        // todo: fix
        // custom: {
        //     options: (value: string) => {
        //         return checkForValidGraduationTerm(value);
        //     },
        //     errorMessage: printEnums(graduationTerms, "graduationTerm"),
        // },
    },
});

export const patchPersonSchema = () => {
    return [
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
        body("organizationId").isUUID().withMessage("organizationId is not in UUID format"),
        body("gender")
            .optional()
            .trim()
            .escape()
            .toUpperCase()
            .isIn([Gender.FEMALE, Gender.MALE])
            .withMessage(printEnums(Gender, "gender")),
        body("visibility")
            .optional()
            .trim()
            .escape()
            .toUpperCase()
            .isIn([Visibility.CLOSED, Visibility.OPEN, Visibility.PRIVATE])
            .withMessage(printEnums(Visibility, "visibility")),
        body("language")
            .optional()
            .trim()
            .escape()
            .toUpperCase()
            .isIn([Language.ENGLISH])
            .withMessage(printEnums(Language, "language")),
    ];
};

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
            .isIn([Gender.FEMALE, Gender.MALE])
            .withMessage(printEnums(Gender, "gender")),
        body("visibility")
            .notEmpty()
            .withMessage("value 'visibility' is missing")
            .trim()
            .escape()
            .toUpperCase()
            .isIn([Visibility.CLOSED, Visibility.OPEN, Visibility.PRIVATE])
            .withMessage(printEnums(Visibility, "visibility")),
        body("language")
            .notEmpty()
            .withMessage("value 'language is missing")
            .trim()
            .escape()
            .toUpperCase()
            .isIn([Language.ENGLISH])
            .withMessage(printEnums(Language, "language")),
        body("graduationTerm")
            .notEmpty()
            .withMessage("value 'graduationTerm' is missing")
            .trim()
            .escape()
            .isIn([graduationTerms[0], graduationTerms[1], graduationTerms[2]])
            .withMessage(
                `valid graudation options are ${graduationTerms[0]}, ${graduationTerms[1]}, ${graduationTerms[2]}`
            ),
    ];
};

export const newOrganizationRules = () => {
    return [
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
            .isIn([Language.ENGLISH])
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
    ];
};

// NR - this parallel processes the errors
// export const validate = (validations: ValidationChain[]) => {
//     return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//         await Promise.all(validations.map((validation) => validation.run(req)));

//         const errors = validationResult(req);
//         if (errors.isEmpty()) {
//             return next();
//         }

//         return res.status(400).json({ errors: errors.array() });
//     };
// };

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
        // eslint-disable-next-line no-restricted-syntax
        for (const validation of validations) {
            // eslint-disable-next-line no-await-in-loop
            const result = await validation.run(req);
            if (result.array().length) {
                break;
            }
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorResponse = errors.array()[0].msg;
        return res.status(400).json(APIResponse[400](errorResponse));
    };
};

const checkForValidGraduationTerm = (value: string) => {
    // graduationTerms.forEach((term) => {
    //     console.log(term);
    //     if (value === term) {
    //         console.log(term);
    //         return true;
    //     }
    // });
};
