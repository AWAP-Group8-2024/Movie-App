import * as testHelpers from "./helpers/test.js";
import { expect } from "chai";
import axios from "axios";

const url = process.env.SERVER_URL;

describe(" Sign up test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  const testEndPoint = `${url}/api/user/register`;

  it("Status code:201, should return a 201 response for successfully registration", async () => {
    const testBody = { email: "testX@movieapp.com", password: "Password123" };
    const response = await axios.post(testEndPoint, testBody);

    expect(response.status).to.equal(201);
    expect(response.data).to.include.keys("id", "email");
    expect(response.data.email).to.equal(testBody.email);
  });

  it("Status code:400, should return a 400 error for invalid email format", async () => {
    const testBody = { email: "invalid-email", password: "Password123" };
    try {
      await axios.post(`${url}/api/user/register`, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal("Invalid email format");
    }
  });

  it("Status code:400, should return a 400 error for invalid password format", async () => {
    const testBody = { email: "test@movieapp.com", password: "password" };
    try {
      await axios.post(`${url}/api/user/register`, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal(
        "Password must contain at least one uppercase letter and one number."
      );
    }
  });

  it("Status code:409, should return a 409 error for already existing email", async () => {
    const testBody = { email: "test1@movieapp.com", password: "P1" };
    try {
      await axios.post(`${url}/api/user/register`, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(409);
      expect(error.response.data.error).to.equal("Email already exists");
    }
  });
});

describe(" Sign in test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  const testEndPoint = `${url}/api/user/login`;

  it("Status code:200, should return a 200 response for successful login", async () => {
    const testBody = { email: "test1@movieapp.com", password: "P1" };
    const response = await axios.post(testEndPoint, testBody);

    expect(response.status).to.equal(200);
    expect(response.data).to.include.keys("id", "email", "token");
    expect(response.data.email).to.equal(testBody.email);
  });

  it("Status code:400, should return a 400 error for email not found", async () => {
    const testBody = {
      email: "nonexistent@movieapp.com",
      password: "Password123",
    };
    try {
      await axios.post(testEndPoint, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal("Email not found");
    }
  });

  it("Status code:401, should return a 401 error for invalid password", async () => {
    const testBody = { email: "test1@movieapp.com", password: "WrongPassword" };
    try {
      await axios.post(testEndPoint, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data.error).to.equal("Invalid password");
    }
  });
});

describe(" Deleting account test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  const testEndPoint = `${url}/api/user/deleteAccount`;

  it("Status code:200, should return a 200 response for successful login", async () => {
    const testBody = { email: "test1@movieapp.com", password: "P1" };
    const response = await axios.post(testEndPoint, testBody);

    expect(response.status).to.equal(200);
    expect(response.data).to.include.keys("id", "email", "token");
    expect(response.data.email).to.equal(testBody.email);
  });

  it("Status code:400, should return a 400 error for email not found", async () => {
    const testBody = {
      email: "nonexistent@movieapp.com",
      password: "Password123",
    };
    try {
      await axios.post(testEndPoint, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal("Email not found");
    }
  });

  it("Status code:401, should return a 401 error for invalid password", async () => {
    const testBody = { email: "test1@movieapp.com", password: "WrongPassword" };
    try {
      await axios.post(testEndPoint, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data.error).to.equal("Invalid password");
    }
  });
});
