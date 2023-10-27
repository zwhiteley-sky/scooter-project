const { Memory } = require("./memory.js");
const MemoryAuthManager = require("./auth_manager.js");
const MemoryScooterManager = require("./scooter_manager.js");

let create_managers;
if (process.env.NODE_ENV === "test") {
    create_managers = (stations) => {
        if (stations === undefined) stations = [];

        const mem = Memory.seed(stations);

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
