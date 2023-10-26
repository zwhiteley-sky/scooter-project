const crypto = require("crypto");
const { global_memory, Memory } = require("./memory.js");
const Token = require("../token.js");

// The lifetime of a generated token, in milliseconds
const TOKEN_LIFE = 15 * 60 * 1000;

class MemoryAuthManager {
    constructor(memory) {
        this.memory = memory ?? global_memory;
    }

    login(username, password) {
        const user = this.memory.users[username];
        
        // NOTE: unlike other methods, we don't give any
        // error message information here for security
        // purposes
        if (!user) return undefined;

        // NOTE: the memory set of managers are purely for
        // testing purposes and, as a result, there is no
        // need to perform any fancy hashing
        if (user.password !== password) return undefined;

        // Securely generate a 64-byte token string
        const token_str = crypto.randomBytes(64).toString("base64");

        this.memory.tokens[token_str] = {
            username: user.username,
            token: token_str,
            issued: Date.now(),
            expires: Date.now() + TOKEN_LIFE
        };

        return this.memory.get_token(token_str);
    }

    register(username, password, age) {
        // Check if the user already exists
        const user = this.memory.users[username];

        if (user) return false;

        this.memory.users[username] = {
            username,
            password,
            age,
            scooter_serial: null
        };

        return true;
    }

    validate(token_str) {
        const token = this.memory.tokens[token_str];

        // If the token_str is invalid, or the token has expired, return undefined
        if (!token) return undefined;
        if (Date.now() >= token.expires) {
            delete this.memory.tokens[token_str];
            return undefined;
        }

        // Otherwise return the user
        return this.memory.get_user(token.username);
    }
}

module.exports = MemoryAuthManager;
