const { StoredScooter } = require("./scooter.js");
const Station = require("./station.js");

class StationsBuilder {
    constructor() {
        this.stations = [];
    }

    create_station() {
        return new ScootersBuilder(this);
    }

    add_station(scooters) {
        this.stations.push(new Station(this.stations.length, scooters));
        return this;
    }

    build() {
        return this.stations;
    }
}

class ScootersBuilder {
    static scooter_idx_gen = 0;

    constructor(builder) {
        this.builder = builder;
        this.scooters = [];
    }

    add_scooter(charge, broken) {
        const serial = (++ScootersBuilder.scooter_idx_gen).toString();
        this.scooters.push(new StoredScooter(serial, charge, broken, Date.now()));
        return this;
    }

    build_station() {
        this.builder.add_station(this.scooters);
        return this.builder;
    }
}

const station_builder = new StationsBuilder();
const stations = station_builder
    .create_station()
    .add_scooter(1, false)
    .add_scooter(1, true)
    .build_station()
    .create_station()
    .add_scooter(0.1, false)
    .add_scooter(0.5, true)
    .add_scooter(0.3, false)
    .build_station()
    .build();

module.exports = stations;
