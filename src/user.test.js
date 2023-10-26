import { User } from "./user.js";
import { Scooter } from "./scooter.js";

test("user creation and properties", () => {
    const user = new User("Zachary", "password", 10);

    expect(user.username).toBe("Zachary");
    expect(user.age).toBe(10);
    expect(user.logged_in).toBe(false);
    expect(user.scooter).toBeNull();
});

test("login/logout", () => {
    const user = new User("Zachary", "password", 10);

    expect(user.login("incorrect-password")).toBe(false);
    expect(user.login("password")).toBe(true);
    expect(user.login("password")).toBe(false);
    expect(user.login("incorrect-password")).toBe(false);
    expect(user.logged_in).toBe(true);

    user.logout();
    expect(user.logged_in).toBe(false);
});

test("scooter setter/taker", () => {
    const user = new User("Zachary", "password", 10);
    const scooter = new Scooter();

    user.scooter = scooter;
    expect(user.scooter).toBe(scooter);

    try {
        user.scooter = scooter;
        throw "ABOVE STATEMENT SHOULD FAIL";
    } catch (e) {
        expect(e instanceof Error).toBe(true);
    }

    expect(user.take_scooter()).toBe(scooter);
    expect(user.scooter).toBeNull();
});
