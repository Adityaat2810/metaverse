const axios = require('axios');

function sum(a, b) {
    return a + b
}

const BACKEND_URL = "http://localhost:3000"

describe("Authentication", () => {
    // thats how test are written in js 
    test('add 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);


    })


    test('User is able to signup only once', async () => {
        const username = "aditya" + Math.random();
        const password = "123456";

        const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(response.statusCode).toBe(200)

        const updatedResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        // as two user shold not have same username
        expect(updatedResponse.statusCode).toBe(400)
    })

    test('Signup request fails if the username is empty', async () => {
        const username = `aditya-${Math.random()}` // kirat-0.12312313
        const password = "123456"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password
        })

        expect(response.status).toBe(400)
    })

    test('Signin succeeds if the username and password are correct', async () => {
        const username = `aditya-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200)
        expect(response.data.token).toBeDefined()

    })

    test('Signin fails if the username and password are incorrect', async () => {
        const username = `kirat-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername",
            password
        })

        expect(response.status).toBe(403)
    })


})

describe("User Information Endpoints", () => {
    let token ;
    let avatarId;
    beforeAll(async () => {
        /**
         * any code written here run before all  the
         * tests run   not before  every test run  { beforeEach
         *  run before every test run}
         * 
         */
        const username = `aditya-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        token = response.data.token 

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        avatarId=avatarResponse.data.avatarId

    })

    
    test("User cant update their metadata with a wrong avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            // random avatar id that does not exist
            avatarId: "123123123"
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(responsse.status).toBe(400)
    })

    test("User can update their metadata with the right avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
    })

    test("User is not able to update their metadata if the auth header is not present", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })

        // 403 status code for unauthorized 

        expect(response.status).toBe(403)
    })



})