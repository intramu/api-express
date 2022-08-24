"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionModel = void 0;
class DivisionModel {
    constructor(divisionName, divisionType, divisionLevel, divisionStartDate, divisionEndDate, maxTeamSize, minWCount, minMCount, brackets) {
        this.divisionName = divisionName;
        this.divisionType = divisionType;
        this.divisionLevel = divisionLevel;
        this.divisionStartDate = divisionStartDate;
        this.divisionEndDate = divisionEndDate;
        this.maxTeamSize = maxTeamSize;
        this.minWCount = minWCount;
        this.minMCount = minMCount;
        this.brackets = brackets;
    }
    getDivisionName() {
        return this.divisionName;
    }
    setDivisionName(divisionName) {
        this.divisionName = divisionName;
    }
    getDivisionType() {
        return this.divisionType;
    }
    setDivisionType(divisionType) {
        this.divisionType = divisionType;
    }
    getDivisionLevel() {
        return this.divisionLevel;
    }
    setDivisionLevel(divisionLevel) {
        this.divisionLevel = divisionLevel;
    }
    getDivisionStartDate() {
        return this.divisionStartDate;
    }
    setDivisionStartDate(divisionStartDate) {
        this.divisionStartDate = divisionStartDate;
    }
    getDivisionEndDate() {
        return this.divisionEndDate;
    }
    setDivisionEndDate(divisionEndDate) {
        this.divisionEndDate = divisionEndDate;
    }
    getMaxTeamSize() {
        return this.maxTeamSize;
    }
    setMaxTeamSize(maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
    }
    getMinWCount() {
        return this.minWCount;
    }
    setMinWCount(minWCount) {
        this.minWCount = minWCount;
    }
    getMinMCount() {
        return this.minMCount;
    }
    setMinMCount(minMCount) {
        this.minMCount = minMCount;
    }
    getBrackets() {
        return this.brackets;
    }
    setBrackets(brackets) {
        this.brackets = brackets;
    }
}
exports.DivisionModel = DivisionModel;
