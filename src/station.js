export class Station {
    static #next_id = 0;
    #id;
    #scooters;

    constructor() {
        this.#id = (++Station.#next_id).toString();
        this.#scooters = [];
    }

    add_scooter(scooter) {
        if (this.#scooters.find(s => s.serial === scooter.serial)) return;
        this.#scooters.push(scooter);
    }

    get id() {
        return this.#id;
    }
    
    get rentable_scooters() {
        return this.#scooters.filter(s => s.is_rentable);
    }
}
