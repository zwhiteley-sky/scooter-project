export class Scooter {
    static #next_serial = 0;
    #serial;
    #charge;
    #is_broken;

    constructor() {
        this.#serial = (++Scooter.#next_serial).toString();
        this.#charge = 1;
        this.#is_broken = false;
    }

    get serial() {
        return this.#serial;
    }

    get charge() {
        return this.#charge;
    }

    get is_broken() {
        return this.#is_broken;
    }

    get is_rentable() {
        return this.charge >= 0.2 && !this.is_broken;
    }

    use(charge) {
        if (charge > this.#charge) return false;

        this.#charge -= charge;
        return true;
    }

    break() {
        this.#is_broken = true;
    }
}
