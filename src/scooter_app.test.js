import { ScooterApp } from "./scooter_app.js";
import { Station } from "./station.js";
import { Scooter } from "./scooter.js";

test("scooter app register()", () => {
    const scooter_app = new ScooterApp([]);

    const user_1 = scooter_app.register("Zachary", "password", 2393);
    const user_2 = scooter_app.register("Zachary", "different", 29);

    expect(user_1.username).toBe("Zachary");
    expect(user_2).toBeNull();
});

test("scooter app login()", () => {
    const scooter_app = new ScooterApp([]);
    const user = scooter_app.register("Zachary", "password", 2393);

    expect(scooter_app.login("James", "password")).toBeNull();
    expect(scooter_app.login("Zachary", "cheese")).toBeNull();
    expect(scooter_app.login("Zachary", "password")).toBe(user);

    // Ensure that a user cannot login twice
    expect(scooter_app.login("Zachary", "password")).toBeNull();
});

test("scooter app rent_scooter()", () => {
    const empty_station = new Station();

    const bad_station = new Station();
    {
        const broken = new Scooter(); broken.break();
        const no_charge = new Scooter(); no_charge.use(0.9);
        bad_station.add_scooter(broken);
        bad_station.add_scooter(no_charge);
    }

    const good_station = new Station();
    const good_scooter = new Scooter();
    good_station.add_scooter(good_scooter);
    
    const scooter_app = new ScooterApp([
        empty_station, bad_station, good_station
    ]);

    scooter_app.register("Zachary", "password", 10);
    const user = scooter_app.login("Zachary", "password");

    const result = scooter_app.rent_scooter(user);
    expect(result).toBe(true);
    expect(user.scooter).toBe(good_scooter);
});

test("scooter app return_scooter()", () => {
    const station = new Station();
    station.add_scooter(new Scooter());

    const app = new ScooterApp([station]);

    app.register("Zachary", "password", 25);
    const user = app.login("Zachary", "password");

    expect(app.rent_scooter(user)).toBe(true);
    expect(app.return_scooter(user)).toBe(true);
    expect(user.scooter).toBeNull();
    expect(station.rentable_scooters.length).toBe(1);
});

test("do not rent scooter if not logged in", () => {
    const station = new Station();
    station.add_scooter(new Scooter());

    const app = new ScooterApp([station]);
    const user = app.register("Zachary", "password", 23);
    
    expect(app.rent_scooter(user)).toBe(false);
    expect(user.scooter).toBe(null);
});
