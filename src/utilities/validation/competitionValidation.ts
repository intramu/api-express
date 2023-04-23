import { body } from "express-validator";
import { Sport } from "../enums/commonEnum";
import {
    CompetitionSeason,
    CompetitionStatus,
    CompetitionVisibility,
    ContestType,
    DivisionLevel,
    DivisionStatus,
    DivisionType,
    PlayoffSeedingType,
    TournamentType,
} from "../enums/competitionEnum";
import { listEnums, printEnums, validate } from "./common";

/** Validation schemas for competition objects */

export const newContestSchema = validate([
    body("name")
        .optional()
        // .withMessage("value 'name' is missing")
        .trim()
        .escape()
        .isLength({ min: 2, max: 40 })
        .withMessage("name requires length from 2 to 40"),
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
    body("season")
        .optional()
        // .withMessage("value 'season' is missing")
        .trim()
        .toUpperCase()
        .isIn(listEnums(CompetitionSeason))
        .withMessage(printEnums(CompetitionSeason, "season")),
    body("year").optional().trim(),
    body("term").optional().isInt({ min: 1 }).withMessage("term must be a number greater than 0"),
]);

export const newLeagueSchema = validate([
    body("leagues")
        .notEmpty()
        .withMessage("value 'leagues' is missing or contains no objects")
        .isArray()
        .withMessage("leagues requires array of objects"),
    body("leagues.*.name")
        .optional({ nullable: true })
        .trim()
        .escape()
        .isLength({ min: 2, max: 30 })
        .withMessage("league name requires length from 2 to 30"),
    body("leagues.*.sport")
        .notEmpty()
        .withMessage("value 'sport' on 'leagues' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(Sport))
        .withMessage(printEnums(Sport, "sport")),
    body("leagues.*.divisions")
        .notEmpty()
        .withMessage("value 'divisions' on 'leagues' is missing or contains no objects")
        .isArray()
        .withMessage("divisions requires array of objects"),
    body("leagues.*.divisions.*.name")
        .optional({ nullable: true })
        .trim()
        .escape()
        .isLength({ min: 2, max: 30 })
        .withMessage("division name requires length from 2 to 30"),
    body("leagues.*.divisions.*.type")
        .notEmpty()
        .withMessage("value 'type' on 'divisions' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(DivisionType))
        .withMessage(printEnums(DivisionType, "DivisionType")),
    body("leagues.*.divisions.*.level")
        .notEmpty()
        .withMessage("value 'level' on 'divisions' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(DivisionLevel))
        .withMessage(printEnums(DivisionLevel, "DivisionLevel")),
    body("leagues.*.divisions.*.status")
        .notEmpty()
        .withMessage("value 'status' on 'divisions' is missing")
        .trim()
        .escape()
        .toUpperCase()
        .isIn(listEnums(DivisionStatus))
        .withMessage(printEnums(DivisionStatus, "DivisionStatus")),
    body("leagues.*.divisions.*.maxTeamSize")
        .notEmpty()
        .withMessage("value 'maxTeamSize' on 'divisions' is missing")
        .trim()
        .isInt({ min: 1, max: 100 })
        .withMessage("maxTeamSize requires length from 1 to 100"),
    body("leagues.*.divisions.*.minWomenCount")
        .notEmpty()
        .withMessage("value 'minWomenCount' on 'divisions' is missing")
        .trim()
        .isInt({ min: 1, max: 100 })
        .withMessage("minWomenCount requires length from 1 to 100"),
    body("leagues.*.divisions.*.minMenCount")
        .notEmpty()
        .withMessage("value 'minMenCount' on 'divisions' is missing")
        .trim()
        .isInt({ min: 1, max: 100 })
        .withMessage("minMenCount requires length from 1 to 100"),
    body("leagues.*.divisions.*.startDate")
        .notEmpty()
        .withMessage("value 'startDate' on 'divisions' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("startDate is required in format YYYY-MM-DD"),
    body("leagues.*.divisions.*.endDate")
        .notEmpty()
        .withMessage("value 'endDate' on 'divisions' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("endDate is required in format YYYY-MM-DD"),
    body("leagues.*.divisions.*.registrationStartDate")
        .notEmpty()
        .withMessage("value 'registrationStartDate' on 'divisions' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("registrationStartDate is required in format YYYY-MM-DD"),
    body("leagues.*.divisions.*.registrationEndDate")
        .notEmpty()
        .withMessage("value 'registrationEndDate' on 'divisions' is missing")
        .trim()
        .escape()
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage("registrationEndDate is required in format YYYY-MM-DD"),
    body("leagues.*.divisions.*.contestType")
        .notEmpty()
        .withMessage("value 'contestType' is required for playoff")
        .trim()
        .toUpperCase()
        .isIn(listEnums(ContestType))
        .withMessage(printEnums(ContestType, "contestType")),
    body("leagues.*.divisions.*.playoff")
        .optional()
        .trim()
        .escape()
        .isBoolean()
        .withMessage("value 'playoff' requires boolean"),
    body("leagues.*.divisions.*.playoffType")
        .if(body("playoff").matches("true"))
        .notEmpty()
        .withMessage("value 'playoffType' is required for playoff")
        .trim()
        .toUpperCase()
        .isIn(listEnums(TournamentType))
        .withMessage(printEnums(TournamentType, "playoffType")),
    body("leagues.*.divisions.*.playoffSeedingType")
        .if(body("playoff").matches("true"))
        .notEmpty()
        .withMessage("value 'playoffSeedingType' is required for playoff")
        .trim()
        .toUpperCase()
        .isIn(listEnums(PlayoffSeedingType))
        .withMessage(printEnums(PlayoffSeedingType, "playoffSeedingType")),
    body("leagues.*.divisions.*.brackets")
        .notEmpty()
        .withMessage("value 'brackets' on 'divisions' is missing or contains no objects")
        .isArray()
        .withMessage("brackets requires array of objects"),
    body("leagues.*.divisions.*.brackets.*.dayChoices")
        .isArray()
        // todo: escape values
        .customSanitizer((array: string[]) => array.map((day) => day.trim().toUpperCase()))
        .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
        .withMessage("valid 'dayChoices' options are days of the week"),
    body("leagues.*.divisions.*.brackets.*.maxTeamAmount")
        .notEmpty()
        .withMessage("value 'maxTeamAmount' on 'bracket' is missing")
        .trim()
        .isInt({ min: 1, max: 100 })
        .withMessage("minMenCount requires length from 1 to 100"),
    body("leagues.*.divisions.*.brackets.*.timeChoices.*.startTime")
        .notEmpty()
        .withMessage("value 'startTime' on 'timeSlots' is missing")
        .matches("^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0][0])$")
        .withMessage("startTime is required in format 00:00:00 (00:00:00 - 23:59:00)"),
    body("leagues.*.divisions.*.brackets.*.timeChoices.*.endTime")
        .notEmpty()
        .withMessage("value 'endTime' on 'timeSlots' is missing")
        .matches("^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0][0])$")
        .withMessage("endTime is required in format 00:00:00 (00:00:00 - 23:59:00)"),
]);
