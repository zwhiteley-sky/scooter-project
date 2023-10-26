import { Scooter } from "./scooter.js";
import { Station } from "./station.js";

test("ensure station IDs are generated correctly", () => {
    const station_1 = new Station();
    const station_2 = new Station();
    const station_3 = new Station();

    expect(station_1.id).toBe("1");
    expect(station_2.id).toBe("2");
    expect(station_3.id).toBe("3");
});

test("ensure scooters can be added", () => {
    const station = new Station();

    station.add_scooter(new Scooter());
    station.add_scooter(new Scooter());
    station.add_scooter(new Scooter());

    expect(station.rentable_scooters.length).toBe(3);
});

test("ensure rentable_scooters property only returns rentable scooters", () => {
    const station = new Station();
    const good_scooter_1 = new Scooter();
    const good_scooter_2 = new Scooter();
    station.add_scooter(good_scooter_1);
    station.add_scooter(good_scooter_2);
    
    {
        const broken_scooter = new Scooter();
        broken_scooter.break();
        station.add_scooter(broken_scooter);
    }   

    expect(station.rentable_scooters.map(s => s.serial)).toEqual([good_scooter_1.serial, good_scooter_2.serial]);
});

test("rent_scooter() returns correct scooter", () => {
    const station = new Station();
    const good_scooter_1 = new Scooter();
    const good_scooter_2 = new Scooter();
    station.add_scooter(good_scooter_1);
    station.add_scooter(good_scooter_2);
    
    {
        const broken_scooter = new Scooter();
        broken_scooter.break();
        station.add_scooter(broken_scooter);
    }   

    expect(station.rent_scooter()).toBe(good_scooter_1);
    expect(station.rentable_scooters.length).toBe(1);
    expect(station.rent_scooter()).toBe(good_scooter_2);
    expect(station.rentable_scooters.length).toBe(0);
    expect(station.rent_scooter()).toBeNull();
});
