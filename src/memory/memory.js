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

    static seed(stations) {
        const mem = new Memory();

        // Set up stations (as stations cannot be created by users,
        // the database will have to be seeded before it can be used
        // -- as this is for testing, we need to provide a way for
        // tests to seed the database).
        for (const station of stations) {
            const raw_station = mem.stations[station.id] = {
                id: station.id,
                scooter_serials: []
            };

            for (const scooter of station.scooters) {
                raw_station.scooter_serials.push(scooter.serial);
                mem.scooters[scooter.serial] = {
                    serial: scooter.serial,
                    charge: scooter.charge,
                    broken: scooter.broken,
                    status: "stored",
                    stored_on: scooter.stored_on.getTime()
                };
            }
        }

        return mem;
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

const global_memory = Memory.seed(require("../seed.js"));

module.exports = { global_memory, Memory };
