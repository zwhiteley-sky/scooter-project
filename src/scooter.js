class Scooter {
    #serial;
    #charge;
    #broken;

    constructor(serial, charge, broken) {
        this.#serial = serial;
        this.#charge = charge;
        this.#broken = broken;
    }

    get serial() {
        return this.#serial;
    }

    get charge() {
        return this.#charge;
    }

    get broken() {
        return this.#broken;
    }
}

class RentedScooter extends Scooter {
    #rented_on;

    constructor(serial, charge, broken, rented_on) {
        super(serial, charge, broken);
        this.#rented_on = rented_on;
    }

    get rented_on() {
        return new Date(this.#rented_on);
    }
}

class StoredScooter extends Scooter {
    #stored_on;

    constructor(serial, charge, broken, stored_on) {
        super(serial, charge, broken);
        this.#stored_on = stored_on;
    }

    get stored_on() {
        return this.#stored_on !== null ? new Date(this.#stored_on) : undefined;
    }
}

module.exports = { Scooter, RentedScooter, StoredScooter };
