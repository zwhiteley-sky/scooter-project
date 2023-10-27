// NOTE: the seed data will be used
const app = require("./app.js");
const request = require("supertest");

test("registration and authentication", async () => {
    // Registration
    {
        const res = await request(app).post("/register").expect(204).send({
            username: "Zachary",
            password: "password",
            age: 18
        });

        expect(res.body).toEqual({});
    }

    // Login
    {
        const res = await request(app).post("/login").expect(200).send({
            username: "Zachary",
            password: "password"
        });

        expect(res.body.user).toEqual({ username: "Zachary", age: 18 });
        expect(res.body.issued).toBeLessThanOrEqual(Date.now());
        expect(res.body.expires).toBeGreaterThanOrEqual(Date.now());
    }
});

test("renting and returning a scooter", async () => {
    await request(app).post("/register").expect(204).send({
        username: "Simon",
        password: "password",
        age: 25
    });

    const login_res = await request(app).post("/login").expect(200).send({
        username: "Simon",
        password: "password"
    });

    const scooter_res = await request(app).post("/rent_scooter")
        .set("Authorization", login_res.body.token)
        .expect(200)
        .send();

    expect(scooter_res.body.rented_on).toBeLessThanOrEqual(Date.now());
    delete scooter_res.body.rented_on;

    expect(scooter_res.body).toEqual({
        serial: "1",
        charge: 1,
        broken: false,
    });

    await request(app).post("/return_scooter")
        .set("Authorization", login_res.body.token)
        .expect(204)
        .send();
});

test("user can get information about themselves", async () => {
    await request(app).post("/register").expect(204).send({
        username: "Jordan",
        password: "password",
        age: 18
    });

    const login_res = await request(app).post("/login").expect(200).send({
        username: "Jordan",
        password: "password"
    });

    const scooter_res = await request(app).post("/rent_scooter")
        .set("Authorization", login_res.body.token)
        .expect(200)
        .send();
    
    const user_res = await request(app).get("/me")
        .set("Authorization", login_res.body.token)
        .expect(200)
        .send();

    expect(user_res.body).toEqual({
        username: "Jordan",
        age: 18,
        scooter: scooter_res.body
    });

    await request(app).post("/return_scooter")
        .set("Authorization", login_res.body.token)
        .expect(204)
        .send()
});

test("invalid tokens are always rejected", async () => {
    // Endpoint which is valid without a token
    await request(app).post("/register")
        .set("Authorization", "invalid value")
        .expect(401)
        .send({
            username: "Jacob",
            password: "password",
            age: 18
        });
});

test("cannot rent more than one scooter", async () => {
    await request(app).post("/register")
        .expect(204)
        .send({
            username: "Daniel",
            password: "password",
            age: 18
        });

    const login_res = await request(app).post("/login")
        .expect(200)
        .send({
            username: "Daniel",
            password: "password",
            age: 18
        });

    await request(app).post("/rent_scooter")
        .set("Authorization", login_res.body.token)
        .expect(200)
        .send();

    await request(app).post("/rent_scooter")
        .set("Authorization", login_res.body.token)
        .expect(403)
        .send();

    // Return scooter as to not interfere with other tests
    await request(app).post("/return_scooter")
        .set("Authorization", login_res.body.token)
        .expect(204)
        .send();
});

test("cannot return scooter if not rented", async () => {
    await request(app).post("/register")
        .expect(204)
        .send({
            username: "John",
            password: "password",
            age: 18
        });

    const login_res = await request(app).post("/login")
        .expect(200)
        .send({
            username: "John",
            password: "password",
        });

    await request(app).post("/return_scooter")
        .set("Authorization", login_res.body.token)
        .expect(404)
        .send();

});

test("cannot rent or return if not logged in", async () => {
    await request(app).post("/rent_scooter").expect(401).send();
    await request(app).post("/return_scooter").expect(401).send();
});
