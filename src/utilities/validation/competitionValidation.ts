import { body } from "express-validator";
import {
    CompetitionStatus,
    CompetitionVisibility,
    ContestType,
    PlayoffSeedingType,
    TournamentType,
} from "../enums/competitionEnum";
import { listEnums, printEnums, validate } from "./common";

export const newContestSchema = validate([
    body("name")
        .notEmpty()
        .withMessage("value 'name' is missing")
        .trim()
        .escape()
        .isLength({ min: 2, max: 40 }),
    body("visibility")
        .notEmpty()
        .withMessage("value 'visibility' is missing")
        .trim()
        .toUpperCase()
        .isIn(listEnums(CompetitionVisibility))
        .withMessage(printEnums(CompetitionVisibility, "visibility")),
    body("status")
        .notEmpty()
        .withMessage("value 'status' is missing")
        .trim()
        .toUpperCase()
        .isIn(listEnums(CompetitionStatus))
        .withMessage(printEnums(CompetitionStatus, "status")),
    body("startDate")
        .notEmpty()
        .withMessage("value 'startDate' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("startDate is required in format YYYY-MM-DD")
        .isAfter(new Date().toISOString())
        .withMessage("here"),
    body("endDate")
        .notEmpty()
        .withMessage("value 'startDate' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("startDate is required in format YYYY-MM-DD"),
    body("playoff")
        .optional()
        .trim()
        .escape()
        .isBoolean()
        .withMessage("value 'playoff' requires boolean"),
    body("playoffType")
        .if(body("playoff").matches("true"))
        .notEmpty()
        .withMessage("value 'playoffType' is required for playoff")
        .trim()
        .toUpperCase()
        .isIn(listEnums(TournamentType))
        .withMessage(printEnums(TournamentType, "playoffType")),
    body("playoffSeedingType")
        .if(body("playoff").matches("true"))
        .notEmpty()
        .withMessage("value 'playoffSeedingType' is required for playoff")
        .trim()
        .toUpperCase()
        .isIn(listEnums(PlayoffSeedingType))
        .withMessage(printEnums(PlayoffSeedingType, "playoffSeedingType")),
    body("contestType")
        .if(body("playoff").matches("true"))
        .notEmpty()
        .withMessage("value 'contestType' is required for playoff")
        .trim()
        .toUpperCase()
        .isIn(listEnums(ContestType))
        .withMessage(printEnums(ContestType, "contestType")),
]);
