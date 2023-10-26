const { Memory } = require("./memory.js");
const MemoryAuthManager = require("./auth_manager.js");
const MemoryScooterManager = require("./scooter_manager.js");

let create_managers;
if (process.env.NODE_ENV === "test") {
    create_managers = (stations) => {
        if (stations === undefined) stations = [];

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

        const auth_manager = new MemoryAuthManager(mem);
        const scooter_manager = new MemoryScooterManager(mem);

        return { auth_manager, scooter_manager };
    };
}

module.exports = {
    MemoryAuthManager,
    MemoryScooterManager,
    create_managers
};
