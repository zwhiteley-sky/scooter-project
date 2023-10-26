const { create_managers: create_memory_managers } = require("./memory");
const { StoredScooter, RentedScooter } = require("./scooter.js");
const Station = require("./station.js");

describe.each([
    [create_memory_managers]
])("auth manager tests", (create_managers) => {
    test("able to register, login, and validate successfully", () => {
        const { auth_manager } = create_managers();

        expect(auth_manager.register("Zachary", "password", 18)).toBe(true);
        
        const token = auth_manager.login("Zachary", "password");
        
        expect(token.user.username).toBe("Zachary");
        expect(token.user.age).toBe(18);

        const user = auth_manager.validate(token.token);

        expect(user.username).toBe("Zachary");
        expect(user.age).toBe(18);
    });

    test("username must be unique", () => {
        const { auth_manager } = create_managers();

        expect(auth_manager.register("Zachary", "password", 18)).toBe(true);
        expect(auth_manager.register("Zachary", "diff_pass", 12)).toBe(false);
    });

    test("login details must be correct", () => {
        const { auth_manager } = create_managers();
        
        expect(auth_manager.register("Zachary", "password", 18)).toBe(true);
        expect(auth_manager.login("Simon", "password")).toBeFalsy();
        expect(auth_manager.login("Zachary", "cheese cake supremacy")).toBeFalsy();
        expect(auth_manager.login("Zachary", "password")).toBeTruthy();
    });

    test("validation token must be correct", () => {
        const { auth_manager } = create_managers();

        expect(auth_manager.register("Zachary", "password", 18)).toBe(true);
        
        const token = auth_manager.login("Zachary", "password");
        
        expect(token.user.username).toBe("Zachary");
        expect(token.user.age).toBe(18);

        expect(auth_manager.validate("not a valid token")).toBeFalsy();
    });

    test("ability for a user to rent a scooter", () => {
        const { auth_manager, scooter_manager } = create_managers([
            new Station(1, [ new StoredScooter(0, 0.1, false, Date.now()) ]),
            new Station(2, [ new StoredScooter(1, 1, false, Date.now()) ])
        ]);

        expect(auth_manager.register("Zachary", "password", 21));

        const token = auth_manager.login("Zachary", "password");
        const user = token.user;
        const scooter = scooter_manager.rent_scooter(user.username);

        expect(scooter.serial).toBe(1);
        expect(scooter.charge).toBe(1);
        expect(scooter.broken).toBe(false);
        expect(scooter.rented_on).toBeTruthy();
        
        const user_revalidated = auth_manager.validate(token.token);
        
        expect(user_revalidated.scooter.serial).toBe(1);
    });

    test("no scooter returned, or user modified, if no rentable scooters available", () => {
        const { auth_manager, scooter_manager } = create_managers([
            new Station(1, [ new StoredScooter(0, 1, false, Date.now()) ]),
            new Station(2, [ new StoredScooter(1, 0.6, true, Date.now()) ])
        ]);

        {
            auth_manager.register("Zachary", "password", 18);
            const token = auth_manager.login("Zachary", "password");
            expect(scooter_manager.rent_scooter(token.user.username)).toBeTruthy();
        }   
        
        {
            auth_manager.register("Simon", "password", 27);
            const token = auth_manager.login("Simon", "password");
            expect(scooter_manager.rent_scooter(token.user.username).error_code).toBe(0);
        }
    });

    test("if a user has a scooter rented, they should not be able to rent another", () => {
        const { auth_manager, scooter_manager } = create_managers([
            new Station(1, [
                new StoredScooter(1, 1, false, Date.now()),
                new StoredScooter(2, 1, false, Date.now())
            ])
        ]);

        auth_manager.register("Zachary", "password", 18);
        const token = auth_manager.login("Zachary", "password");

        expect(scooter_manager.rent_scooter(token.user.username) instanceof RentedScooter).toBe(true);
        expect(scooter_manager.rent_scooter(token.user.username) instanceof RentedScooter).toBe(false);
    });

    test("if a user returns a scooter, it must be rentable again", () => {
        const { auth_manager, scooter_manager } = create_managers([
            new Station(1, [ 
                new StoredScooter(1, 1, false, Date.now()),
                new StoredScooter(2, 1, false, Date.now()) 
            ]),
            new Station(2, [ ])
        ]);

        auth_manager.register("Zachary", "password", 18);
        const token = auth_manager.login("Zachary", "password");

        expect(scooter_manager.rent_scooter(token.user.username).serial).toBe(1);
        expect(scooter_manager.return_scooter(token.user.username)).toBe(true);

        // Check that scooters are allocated to the station with the fewest scooters
        expect(scooter_manager.rent_scooter(token.user.username).serial).toBe(2);
    });
});
