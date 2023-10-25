import { User } from "./user.js"

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
