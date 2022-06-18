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
        result.sport = sport;
        return result;
    }
    /** Getters and Setters */
    get $id() {
        return this.id;
    }
    set $id(value) {
        this.id = value;
    }
    get $name() {
        return this.name;
    }
    set $name(value) {
        this.name = value;
    }
    get $wins() {
        return this.wins;
    }
    set $wins(value) {
        this.wins = value;
    }
    get $ties() {
        return this.ties;
    }
    set $ties(value) {
        this.ties = value;
    }
    get $losses() {
        return this.losses;
    }
    set $losses(value) {
        this.losses = value;
    }
    get $image() {
        return this.image;
    }
    set $image(value) {
        this.image = value;
    }
    get $visibility() {
        return this.visibility;
    }
    set $visibility(value) {
        this.visibility = value;
    }
    get $sport() {
        return this.sport;
    }
    set $sport(value) {
        this.sport = value;
    }
    get $currentTeamSize() {
        return this.currentTeamSize;
    }
    set $currentTeamSize(value) {
        this.currentTeamSize = value;
    }
    get $maxTeamSize() {
        return this.maxTeamSize;
    }
    set $maxTeamSize(value) {
        this.maxTeamSize = value;
    }
    get $dateCreated() {
        return this.dateCreated;
    }
    set $dateCreated(value) {
        this.dateCreated = value;
    }
    get $dateLastUpdated() {
        return this.dateLastUpdated;
    }
    set $dateLastUpdated(value) {
        this.dateLastUpdated = value;
    }
}
exports.Team = Team;
