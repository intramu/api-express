import { checkSchema, ParamSchema } from "express-validator";
import { graduationTerms } from "./constantsThatNeedAHome";
import { Gender, Language, Visibility } from "./enums";

export const newPersonSchema = () =>
    checkSchema({
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
            //todo: fix
            // custom: {
            //     options: (value: string) => {
            //         return checkForValidGraduationTerm(value);
            //     },
            //     errorMessage: printEnums(graduationTerms, "graduationTerm"),
            // },
        },
    });

const printEnums = (values: any, type: string) => {
    let returnString = `valid ${type} options are [`;

    for (const value in values) {
        returnString += `${value}, `;
    }
    returnString = returnString.substring(0, returnString.length - 2);
    returnString += "]";

    return returnString;
};

export const patchPersonSchema = checkSchema({
    firstName: {
        exists: {},
        // isEmpty: {
        //     ,
        // },
        trim: true,
        escape: true,
        isLength: {
            options: { min: 2, max: 20 },
            errorMessage: `firstName requires length from 2 to 20`,
        },
    },
    lastName: {
        isEmpty: {
            bail: true,
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
        //todo: fix
        // custom: {
        //     options: (value: string) => {
        //         return checkForValidGraduationTerm(value);
        //     },
        //     errorMessage: printEnums(graduationTerms, "graduationTerm"),
        // },
    },
});
const checkForValidGender = (value: string) => {
    for (const gender in Gender) {
        if (value === gender) {
            return true;
        }
    }
};

const checkForValidVisibility = (value: string) => {
    for (const visibility in Visibility) {
        if (value === visibility) {
            return true;
        }
    }
};

const checkForValidLanguage = (value: string) => {
    for (const language in Language) {
        if (value === language) {
            return true;
        }
    }
};

const checkForValidGraduationTerm = (value: string) => {
    graduationTerms.forEach((term) => {
        console.log(term);

        if (value === term) {
            console.log(term);

            return true;
        }
    });
};

// body("graduationTerm")
//     .trim()
//     .notEmpty()
//     .withMessage("value graduationTerm is missing")
//     .toUpperCase()
//     .isIn(graduationTerms)
//     //todo: this error message returns undefined
//     .withMessage(
//         "valid graduationTerm options are " +
//             graduationTerms.forEach((term) => {
//                 console.log(term);

//                 return term + ", ";
//             })
//     ),
// body("visibility")
//     .trim()
//     .notEmpty()
//     .withMessage("value visibility is missing")
//     .toUpperCase()
//     .isIn([Visibility.CLOSED, Visibility.OPEN, Visibility.PRIVATE])
//     .withMessage(
//         `valid visibility options are ${Visibility.CLOSED}, ${Visibility.OPEN}, ${Visibility.PRIVATE}`
//     ),
