const express = require("express");
const seed = require("./seed.js");
const { RentedScooter } = require("./scooter.js");
const { auth_manager, scooter_manager } = (function () {
    const env = process.env.NODE_ENV ?? "dev";
    switch (env) {
        case "test":
        case "dev":
            const { MemoryAuthManager, MemoryScooterManager } = require("./memory");
            return {
                auth_manager: new MemoryAuthManager(),
                scooter_manager: new MemoryScooterManager()
            };
    }
})();

const ERR_MISC = 0;
const ERR_USERNAME_TAKEN = 1;
const ERR_INVALID_CREDS = 2;
const ERR_INVALID_AUTH = 3;
const ERR_NO_AUTH = 4;
const ERR_NO_SCOOTERS = 5;
const ERR_ALREADY_RENTING = 6;
const ERR_NOT_RENTING = 7;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    // Validate the user if an authorisation header is present
    if (typeof req.headers.authorization === "string") {
        const token_str = req.headers.authorization;
        const user = auth_manager.validate(token_str);

        if (user) {
            req.user = user;
        } else {
            res.status(401).send({
                error_code: ERR_INVALID_AUTH,
                error_message: "invalid `authorization` header"
            });
            return;
        }
    }

    next();
});

app.get("/me", (req, res) => {
    if (!req.user) {
        res.status(401).send({
            error_code: ERR_NO_AUTH,
            error_message: "authorization required to perform this action"
        });
    } else {
        res.status(200).send(req.user.objectify());
    }
});

app.post("/rent_scooter", (req, res) => {
    if (!req.user) {
        res.status(401).send({
            error_code: ERR_NO_AUTH,
            error_message: "authorization required to perform this action"
        });
        return;
    }

    const result = scooter_manager.rent_scooter(req.user.username);

    if (result instanceof RentedScooter) {
        res.status(200).send(result.objectify());
    } else {
        switch (result.error_code) {
            case 0:
                res.status(404).send({
                    error_code: ERR_NO_SCOOTERS,
                    error_message: "no scooters are available for rent"
                });
                break;
            case 1:
                res.status(403).send({
                    error_code: ERR_ALREADY_RENTING,
                    error_message: "user is already renting a scooter"
                });
                break;
        }
    }
});

app.post("/return_scooter", (req, res) => {
    if (!req.user) {
        res.status(401).send({
            error_code: ERR_NO_AUTH,
            error_message: "authorization required to perform this action"
        });
        return;
    }

    const result = scooter_manager.return_scooter(req.user.username);

    if (result) {
        res.status(204).send();
    } else {
        res.status(404).send({
            error_code: ERR_NOT_RENTING,
            error_message: "user does not have a scooter to return"
        });
    }   
});

app.post("/login", (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    
    if (!(typeof username === "string" && typeof password === "string")) {
        res.status(400).send({
            error_code: ERR_MISC,
            error_message: "malformed request body"
        });
        return;
    }

    const token = auth_manager.login(username, password);

    if (token) {
        res.status(200).send(token.objectify());
    } else {
        res.status(401).send({
            error_code: ERR_INVALID_CREDS,
            error_message: "invalid username/password"
        });
    }
});

app.post("/register", (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    const age = req.body?.age;
    
    if (!(typeof username === "string" && typeof password === "string" && typeof age === "number")) {
        res.status(400).send({
            error_code: ERR_MISC,
            error_message: "malformed request body"
        });
        return;
    }

    if (!(username.length > 0 && password.length > 0)) {
        res.status(400).send({
            error_code: ERR_MISC,
            error_message: "username/password too short"
        });
        return;
    }

    const result = auth_manager.register(username, password, age);

    if (result) {
        res.status(204).send();
    } else {
        res.status(400).send({
            error_code: ERR_USERNAME_TAKEN,
            error_message: "user already exists with that name"
        });
    }
});

app.listen(4000);
