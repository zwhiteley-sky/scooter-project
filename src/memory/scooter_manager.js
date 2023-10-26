const { global_memory, Memory } = require("./memory.js");

class MemoryScooterManager {
    constructor(memory) {
        this.memory = memory ?? global_memory;
    }

    rent_scooter(username) {
        // Assume username is valid
        const user = this.memory.users[username];

        if (user.scooter_serial) {
            return { error_code: 1, error_message: "user already has a scooter rented" };
        }

        // Iterate through each station until a rentable scooter is found
        for (const station of Object.values(this.memory.stations)) {
            for (const scooter_serial of station.scooter_serials) {
                const scooter = this.memory.scooters[scooter_serial];
                
                // Check if the scooter is rentable
                if (scooter.charge >= 0.2 && !scooter.broken) {
                    const idx = station.scooter_serials.indexOf(scooter_serial);

                    // Remove the scooter from the station's list so it is not
                    // rerented
                    station.scooter_serials.splice(idx, 1);

                    // Mark the scooter as rented
                    this.memory.scooters[scooter_serial] = {
                        serial: scooter_serial,
                        charge: scooter.charge,
                        broken: scooter.broken,
                        status: "rented",
                        rented_on: Date.now()
                    };
                    user.scooter_serial = scooter_serial;

                    return this.memory.get_scooter(scooter_serial);
                }
            }
        }
        
        // If no scooter was found, return error
        return { error_code: 0, error_message: "there are no rentable scooters available" };
    }

    return_scooter(username) {
        // Assume username is valid
        const user = this.memory.users[username];

        // If the user does not have a scooter rented, return false
        if (!user.scooter_serial) {
            return false;
        }

        const scooter = this.memory.scooters[user.scooter_serial];
        user.scooter_serial = null;

        // Update the scooter entry in the scooters table
        this.memory.scooters[scooter.serial] = {
            serial: scooter.serial,
            charge: scooter.charge,
            broken: scooter.broken,
            status: "stored",
            stored_on: Date.now()
        };

        // Find the station with the smallest number of scooters to place this
        // scooter into
        // Assume that at least one station exists (all scooters must start in a
        // station, and stations cannot be removed)
        const stations = Object.values(this.memory.stations);
        let smallest_station = stations[0];
        for (let i = 1; i < stations.length; ++i) {
            if (stations[i].scooter_serials.length < smallest_station.scooter_serials.length) {
                smallest_station = stations[i];
            }
        }

        // Add the scooter to the station
        smallest_station.scooter_serials.push(scooter.serial);

        return true;
    }
}

module.exports = MemoryScooterManager;
