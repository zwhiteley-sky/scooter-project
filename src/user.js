export class User {
    #username;
    #password;
    #age;
    #logged_in;
    #scooter;

    constructor(username, password, age) {
        this.#username = username;
        this.#password = password;
        this.#age = age;
        this.#logged_in = false;
        this.#scooter = null;
    }

    get username() {
        return this.#username;
    }

    get age() {
        return this.#age;
    }

    get logged_in() {
        return this.#logged_in;
    }

    get scooter() {
        return this.#scooter;
    }

    set scooter(scooter) {
        if (this.#scooter) throw new Error("User already has a scooter");
        this.#scooter = scooter;
    }

    login(password) {
        if (this.logged_in) return false;
        if (password !== this.#password) return false;

        this.#logged_in = true;
        return true;
    }

    logout() {
        this.#logged_in = false;
    }

    take_scooter() {
        const scooter = this.#scooter;
        this.#scooter = null;
        return scooter;
    }
}
