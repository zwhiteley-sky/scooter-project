import { User } from "./user.js";

export class ScooterApp {
    #users;
    #stations;

    constructor(stations) {
        this.#users = {};
        this.#stations = stations;
    }

    login(username, password) {
        const user = this.#users[username];

        if (!user) return null;
        if (!user.login(password)) return null;

        return user;
    }

    register(username, password, age) {
        if (this.#users[username]) return null;

        this.#users[username] = new User(username, password, age);
        return this.#users[username];
    }

    #get_rentable_scooter() {
        for (let station of this.#stations) {
            const scooter = station.rent_scooter();
            
            if (!scooter) continue;

            return scooter;
        }

        return null;
    }

    rent_scooter(user) {
        // If the user was not registered with the application
        if (this.#users[user.username] !== user) return false;

        // If the user is no logged in, they cannot rent a scooter
        if (!user.logged_in) return false;

        // If the user has already rented a scooter
        if (user.scooter) return false;
    
        const scooter = this.#get_rentable_scooter();
        if (!scooter) return false;

        user.scooter = scooter;
        return true;
    }

    return_scooter(user) {
        if (this.#users[user.username] !== user) return false;
        if (!user.logged_in) return false;
        if (!user.scooter) return false;
        if (!this.#stations.length) return false;

        const scooter = user.take_scooter();

        // The station with the fewest rentable scooters will be chosen for return
        let min_station = this.#stations[0];

        for (let i = 1; i < this.#stations.length; ++i) {
            if (this.#stations[i].rentable_scooters.length < min_station.rentable_scooters.length) {
                min_station = this.#stations[i];
            }
        }

        min_station.add_scooter(scooter);
        return true;
    }
}
