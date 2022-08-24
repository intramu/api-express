"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueModel = void 0;
class LeagueModel {
    constructor(leagueName, leagueSport, leagueStartDate, leagueEndDate, leagueDetails, leagueSetsDates, divisions) {
        this.leagueName = leagueName;
        this.leagueSport = leagueSport;
        this.leagueStartDate = leagueStartDate;
        this.leagueEndDate = leagueEndDate;
        this.leagueDetails = leagueDetails;
        this.leagueSetsDates = leagueSetsDates;
        this.divisions = divisions;
    }
    getLeagueName() {
        return this.leagueName;
    }
    setLeagueName(leagueName) {
        this.leagueName = leagueName;
    }
    getLeagueSport() {
        return this.leagueSport;
    }
    setLeagueSport(leagueSport) {
        this.leagueSport = leagueSport;
    }
    getLeagueStartDate() {
        return this.leagueStartDate;
    }
    setLeagueStartDate(leagueStartDate) {
        this.leagueStartDate = leagueStartDate;
    }
    getLeagueEndDate() {
        return this.leagueEndDate;
    }
    setLeagueEndDate(leagueEndDate) {
        this.leagueEndDate = leagueEndDate;
    }
    getLeagueDetails() {
        return this.leagueDetails;
    }
    setLeagueDetails(leagueDetails) {
        this.leagueDetails = leagueDetails;
    }
    getLeagueSetsDates() {
        return this.leagueSetsDates;
    }
    setLeagueSetsDates(leagueSetsDates) {
        this.leagueSetsDates = leagueSetsDates;
    }
    getDivisions() {
        return this.divisions;
    }
    setDivisions(divisions) {
        this.divisions = divisions;
    }
}
exports.LeagueModel = LeagueModel;
