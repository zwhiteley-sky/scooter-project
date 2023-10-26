const User = require("../user.js");
const { StoredScooter, RentedScooter } = require("../scooter.js");
const Token = require("../token.js");

class Memory {
    constructor() {
        this.tokens = {};
        this.users = {};
        this.stations = {};
        this.scooters = {};
    }

    get_token(token_str) {
        const token = this.tokens[token_str];
        const user = this.get_user(token.username);

        return new Token(user, token_str, token.issued, token.expires);
    }

    get_user(username) {
        const user = this.users[username];
        const scooter = user.scooter_serial ? this.get_scooter(user.scooter_serial) : null;

        return new User(username, user.age, scooter);
    }

    get_scooter(serial) {
        const scooter = this.scooters[serial.toString()];

        if (scooter.status === "stored") {
            return new StoredScooter(scooter.serial, scooter.charge, scooter.broken, scooter.stored_on);
        } else {
            return new RentedScooter(scooter.serial, scooter.charge, scooter.broken, scooter.rented_on);
        }
    
    }
}

const global_memory = new Memory();

module.exports = { global_memory, Memory };
