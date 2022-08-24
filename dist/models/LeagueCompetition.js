"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueCompetitionModel = void 0;
class LeagueCompetitionModel {
    constructor(name, visibility, status, type, dateCreated, leagues) {
        this.name = name;
        this.visibility = visibility;
        this.status = status;
        this.type = type;
        this.dateCreated = dateCreated;
        this.leagues = leagues;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getVisibility() {
        return this.visibility;
    }
    setVisibility(visibility) {
        this.visibility = visibility;
    }
    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
    }
    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
    getDateCreated() {
        return this.dateCreated;
    }
    setDateCreated(dateCreated) {
        this.dateCreated = dateCreated;
    }
    getLeagues() {
        return this.leagues;
    }
    setLeagues(leagues) {
        this.leagues = leagues;
    }
}
exports.LeagueCompetitionModel = LeagueCompetitionModel;
