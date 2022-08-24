"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentCompetitionModel = void 0;
class TournamentCompetitionModel {
    constructor(name, visibility, status, sport, type, dateCreated, divisions) {
        this.name = name;
        this.visibility = visibility;
        this.status = status;
        this.sport = sport;
        this.type = type;
        this.dateCreated = dateCreated;
        this.divisions = divisions;
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
    getSport() {
        return this.sport;
    }
    setSport(sport) {
        this.sport = sport;
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
    getDivisions() {
        return this.divisions;
    }
    setDivisions(divisions) {
        this.divisions = divisions;
    }
}
exports.TournamentCompetitionModel = TournamentCompetitionModel;
