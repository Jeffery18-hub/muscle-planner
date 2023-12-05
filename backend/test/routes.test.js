import request from "supertest";
import app from "../app.js";


describe("POST /auth", () => {
    test("responds with fail sign up", async () => {
        const response = await request(app).post("/auth").send({
            email: "mike@gmail.com", 
            password: "user1234",
            name: "user1234",
            authMode: "signup",
        })
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, message: "User already exists" })
    })

    test("responds with sucess login", async () => {
        const response = await request(app).post("/auth").send({
            email: "mike@gmail.com",
            password: "321",
            name: "mike",
            authMode: "signin"
        })
        expect(response.status).toBe(201);
    })

    test("responds with wrong password", async () => {
        const response = await request(app).post("/auth").send({
            email: "mike@gmail.com",
            password: "221",
            name: "mike",
            authMode: "signin"
        })
        expect(response.status).toBe(401);
    })

});

describe("GET /youtube", () => {
    test("get youtube id", async () => {
        const response = await request(app).get("/youtube").query(
            { search_query: "chest" }
        )
        expect(response.status).toBe(200);
        console.log(response.body)
    })

})

// describe("GET /gpt", () => {
//     test("get chatgpt 3.5 response1", async () => {
//         const response = await request(app).get("/gpt").query(
//             { prompt: "hello" }
//         )
//         expect(response.status).toBe(200);
//     }, 10000) // 10 seconds for gpt, because the get feed back is slow

//     test("get chatgpt 3.5 response2", async ()=>{
//         const response = await request(app).get("/gpt").query(
//             { prompt: "i love you" }
//         )
//         expect(response.status).toBe(200)
//     }, 10000)
// })

