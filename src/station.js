class Station {
    #id;
    #scooters;

    constructor(id, scooters) {
        this.#id = id;
        this.#scooters = scooters;
    }

    get id() {
        return this.#id;
    }

    get scooters() {
        return this.#scooters;
    }
}

module.exports = Station;
