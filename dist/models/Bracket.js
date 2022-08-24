"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracketModel = void 0;
class BracketModel {
    constructor(bracketDayChoices, bracketTimeSlots, bracketMaxSize) {
        this.bracketDayChoices = bracketDayChoices;
        this.bracketTimeSlots = bracketTimeSlots;
        this.bracketMaxSize = bracketMaxSize;
    }
    getBracketDayChoices() {
        return this.bracketDayChoices;
    }
    setBracketDayChoices(bracketDayChoices) {
        this.bracketDayChoices = bracketDayChoices;
    }
    getBracketTimeSlots() {
        return this.bracketTimeSlots;
    }
    setBracketTimeSlots(bracketTimeSlots) {
        this.bracketTimeSlots = bracketTimeSlots;
    }
    getBracketMaxSize() {
        return this.bracketMaxSize;
    }
    setBracketMaxSize(bracketMaxSize) {
        this.bracketMaxSize = bracketMaxSize;
    }
}
exports.BracketModel = BracketModel;
