import { compute } from './apportionment.js';

export class ApportionmentInstance {

    _seats = 0;
    _parties = [];

    constructor(seats, parties, onUpdate) {
        this._seats = seats;
        this._parties = parties;
        this.onUpdate = onUpdate;
    }

    update = () => {
        this.onUpdate();
    }

    set seats(seats) {
        try {
            seats = parseInt(seats);
            if (seats < 0) throw new Error('Seats must be positive');
            this._seats = seats;
        } catch (e) {
            console.error(e);
            this._seats = 0;
        }
        this.update();
    }
    get seats() {
        return this._seats;
    }

    get votes() {
        return Object.values(this._parties).map(party => party.votes);
    }

    set parties(parties) {
        if (Object.keys(parties).length === 0) {
            return;
        }
        this._parties = parties;
        this.update();
    }
    get parties() {
        return this._parties;
    }

    nextAvailableIndex() {
        // maximum party index plus 1
        return Math.max(...Object.keys(this._parties).map(Number)) + 1;
    }

    compute(method, buildExplanation=false) {
        let answer = compute(method, this._parties, this.seats, buildExplanation=buildExplanation);
        let partyList = [...Object.values(this._parties)];
        for (let i = 0; i < partyList.length; i++) {
            partyList[i].seats[method] = answer.representatives[i];
        }
    }

}