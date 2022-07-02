"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Competition = void 0;
class Competition {
    constructor(competitionType, leagues) {
        this.competitionType = competitionType;
        this.leagues = leagues;
    }
    getCompetitionType() {
        return this.competitionType;
    }
    setCompetitionType(competitionType) {
        this.competitionType = competitionType;
    }
    getLeagues() {
        return this.leagues;
    }
    setLeagues(leagues) {
        this.leagues = leagues;
    }
}
exports.Competition = Competition;
