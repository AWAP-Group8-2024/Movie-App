import * as testHelpers from "./helpers/test.js";
import { expect } from "chai";
import axios from "axios";
import sinon from "sinon";
import proxyquire from "proxyquire";
import { pool } from "./helpers/db.js";
import * as UserModel from "./models/User.js";
import * as UserController from "./controllers/userController.js";

const url = process.env.SERVER_URL;

describe(" Sign up test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  const registerEndPoint = `${url}/api/user/register`;

  it("Status code:201, should return a 201 response for successfully registration", async () => {
    const testBody = { email: "testX@movie.com", password: "Password123" };
    const response = await axios.post(registerEndPoint, testBody);

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
    const testBody = { email: "test@example.com", password: "password" };
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
    const testBody = { email: "test1@123.com", password: "P1" };
    try {
      await axios.post(`${url}/api/user/register`, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(409);
      expect(error.response.data.error).to.equal("Email already exists");
    }
  });

  it("Status code:500, should return a 500 error for server issues", async () => {
    const testBody = { email: "test500@movie.com", password: "Password123" };

    const UserController = proxyquire("./controllers/userController.js", {
      "./models/User.js": {
        insertUser: () => {
          throw new Error("Simulated database error");
        },
      },
    });

    try {
      await axios.post(registerEndPoint, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(500);
      expect(error.response.data.error).to.equal(
        "Server error while registration"
      );
    } finally {
      // Restore the original implementation
      insertUserStub.restore();
    }
  });
});
