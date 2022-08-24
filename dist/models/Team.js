"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
class Team {
    /** Constructor */
    static CreatedTeam(name, image, visibility, sport) {
        var result = new Team();
        result.name = name;
        result.image = image;
        result.visibility = visibility;
        // result.sport = sport;
        return result;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getWins() {
        return this.wins;
    }
    setWins(wins) {
        this.wins = wins;
    }
    getTies() {
        return this.ties;
    }
    setTies(ties) {
        this.ties = ties;
    }
    getLosses() {
        return this.losses;
    }
    setLosses(losses) {
        this.losses = losses;
    }
    getImage() {
        return this.image;
    }
    setImage(image) {
        this.image = image;
    }
    getVisibility() {
        return this.visibility;
    }
    setVisibility(visibility) {
        this.visibility = visibility;
    }
    // public getSport(): string {
    //     return this.sport;
    // }
    // public setSport(sport: string): void {
    //     this.sport = sport;
    // }
    getDateCreated() {
        return this.dateCreated;
    }
    setDateCreated(dateCreated) {
        this.dateCreated = dateCreated;
    }
    getDateLastUpdated() {
        return this.dateLastUpdated;
    }
    setDateLastUpdated(dateLastUpdated) {
        this.dateLastUpdated = dateLastUpdated;
    }
    getWCount() {
        return this.wCount;
    }
    setWCount(wCount) {
        this.wCount = wCount;
    }
    getMCount() {
        return this.mCount;
    }
    setMCount(mCount) {
        this.mCount = mCount;
    }
}
exports.Team = Team;
