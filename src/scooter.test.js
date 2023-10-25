import { Scooter } from "./scooter.js";

test("scooter serial is generated properly", () => {
    let scooter_1 = new Scooter();
    let scooter_2 = new Scooter();
    let scooter_3 = new Scooter();

    expect(scooter_1.serial).toBe("1");
    expect(scooter_2.serial).toBe("2");
    expect(scooter_3.serial).toBe("3");
});

test("scooter rentability calculated correctly", () => {
    let rentable = [];
    let unrentable = [];

    rentable.push(new Scooter());
    rentable.push(new Scooter());
    rentable[1].use(0.79);

    unrentable.push(new Scooter());
    unrentable.push(new Scooter());
    unrentable.push(new Scooter());
    unrentable[0].use(0.81);
    unrentable[1].break();
    unrentable[2].use(1);
    unrentable[2].break();

    for (let scooter of rentable) {
        expect(scooter.is_rentable).toBe(true);
    }
    
    for (let scooter of unrentable) {
        expect(scooter.is_rentable).toBe(false);
    }
});

test("use() method works correctly", () => {
    let scooter_1 = new Scooter();

    expect(scooter_1.use(0.3)).toBe(true);
    expect(scooter_1.charge).toBeCloseTo(0.7);
    
    expect(scooter_1.use(0.7)).toBe(true);
    expect(scooter_1.charge).toBeCloseTo(0);

    expect(scooter_1.use(0.4)).toBe(false);
});

test("break() method works correctly", () => {
    let scooter = new Scooter();

    expect(scooter.is_broken).toBe(false);
    scooter.break();
    expect(scooter.is_broken).toBe(true);
});
