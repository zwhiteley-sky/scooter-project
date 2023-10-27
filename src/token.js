class Token {
    #user;
    #token;
    #issued;
    #expires;

    constructor(user, token, issued, expires) {
        this.#user = user;
        this.#token = token;
        this.#issued = issued;
        this.#expires = expires;
    }

    get user() {
        return this.#user;
    }
    
    get token() {
        return this.#token;
    }

    get issued() {
        return new Date(this.#issued);
    }

    get expires() {
        return new Date(this.#expires);
    }

    objectify() {
        return {
            user: this.#user.objectify(),
            token: this.#token,
            issued: this.#issued,
            expires: this.#expires
        };
    }
}

module.exports = Token;
