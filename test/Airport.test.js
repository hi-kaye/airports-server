const app = require("../server")
const request = require("supertest")

describe("Test airport server", () => {
    test("Can get all airports", (done) => {
        request(app)
            .get("/airports")
            .expect(200)
            .expect(response => {
                expect(response.body.length).toBeGreaterThan(28000)
            })
            .end(done)
    })

    test("Can delete airport", (done) => {
        request(app)
            .delete("/airports/00AK/delete")
            .expect(202)
            .end(done)
    })

    test("Can add new airport", (done) => {
        let new_airport = {
            "icao" : "KHWA",
            "iata" : "hello",
            "name" : "Kaye",
            "city" : "London",
        }
        request(app)
            .post("/airports")
            .send(new_airport)
            .set("Accept", "application/json")
            .expect(201)
            .expect(response => {
                expect(response.body.name).toBe("Kaye")
            })
            .end(done)
    })
    
    test("Can update airport", (done) => {
        let update = {
            icao : "00AK",
            name : "Kaye"
        }
        request(app)
            .put("/airports/00AK")
            .send(update)
            .expect(202)
            .expect(response => {
                expect(response.body.name).toBe("Kaye")
            })
            .end(done)
    }) 

    test("Can access individual airports", (done) => {
        request(app)
            .get("/airports/00PS")
            .expect(200)
            .expect(response => {
                expect(response.body.name).toBe("Thomas Field")
            })
            .end(done)
    })
})