class User {
    #username;
    #age;
    #scooter;

    constructor(username, age, scooter) {
        this.#username = username;
        this.#age = age;
        this.#scooter = scooter;
    }

    get username() {
        return this.#username;
    }

    get age() {
        return this.#age;
    }

    get scooter() {
        return this.#scooter;
    }
}

module.exports = User;
