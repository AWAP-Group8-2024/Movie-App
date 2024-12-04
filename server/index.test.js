import * as testHelpers from "./helpers/test.js";
import { auth } from "./helpers/auth.js";
import { ApiError } from "./helpers/apiError.js";
import { expect } from "chai";
import axios from "axios";
import sinon from "sinon";
import jwt from "jsonwebtoken";

const { verify } = jwt;
const url = process.env.SERVER_URL;

describe(" Sign up test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  const testEndPoint = `${url}/api/user/register`;

  it("should return a 201 response for successfully registration", async () => {
    const testBody = { email: "testX@movieapp.com", password: "Password123" };
    const response = await axios.post(testEndPoint, testBody);

    expect(response.status).to.equal(201);
    expect(response.data).to.include.keys("id", "email");
    expect(response.data.email).to.equal(testBody.email);
  });

  it("should return a 400 error for invalid email format", async () => {
    const testBody = { email: "invalid-email", password: "Password123" };
    try {
      await axios.post(`${url}/api/user/register`, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal("Invalid email format");
    }
  });

  it("should return a 400 error for invalid password format", async () => {
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

  it("should return a 409 error for already existing email", async () => {
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

  it("should return a 200 response for successful login", async () => {
    const testBody = { email: "test1@movieapp.com", password: "P1" };
    const response = await axios.post(testEndPoint, testBody);

    expect(response.status).to.equal(200);
    expect(response.data).to.include.keys("id", "email", "token");
    expect(response.data.email).to.equal(testBody.email);
  });

  it("should return a 400 error for email not found", async () => {
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

  it("should return a 401 error for invalid password", async () => {
    const testBody = { email: "test1@movieapp.com", password: "WrongPassword" };
    try {
      await axios.post(testEndPoint, testBody);
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data.error).to.equal("Invalid password");
    }
  });
});

describe(" Authorization test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  let req, res, next;
  const nextSpy = sinon.spy();

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = nextSpy;
    nextSpy.resetHistory();
  });

  it("should call next() with no error when the token is valid", async () => {
    const user = { id: 1, email: "test1@movieapp.com" };
    const token = await testHelpers.getToken(user);
    req.headers.authorization = `Bearer ${token}`;

    auth(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(req.user).to.deep.equal({ id: 1, email: "test1@movieapp.com" });
  });

  it("should call next() with a 401 error when authorization header is missing", () => {
    auth(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.instanceOf(ApiError);
    expect(next.firstCall.args[0].message).to.equal("Authorization required");
    expect(next.firstCall.args[0].statusCode).to.equal(401);
  });

  it("should call next() with a 403 error when token is invalid", () => {
    req.headers.authorization = "Bearer invalidtoken";

    auth(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.instanceOf(ApiError);
    expect(next.firstCall.args[0].message).to.equal(
      "Forbidden - Invalid credentials provided."
    );
    expect(next.firstCall.args[0].statusCode).to.equal(403);
  });
});

describe(" Deleting account test", () => {
  before(async () => {
    console.log("   Initializing database...");
    await testHelpers.initializeDB();
  });

  const testEndPoint = `${url}/api/user/deleteAccount`;
  const loginEndPoint = `${url}/api/user/login`;

  it("should return a 200 response for successful account deletion", async () => {
    const testUser = { email: "testX@movieapp.com", password: "Password123" };
    await testHelpers.insertTestUser(testUser);
    const loginRes = await axios.post(loginEndPoint, testUser);
    const user = loginRes.data;
    const token = user.token;

    const response = await axios.delete(testEndPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.include.keys("user", "message");
    expect(response.data.message).to.equal(
      `User ID ${user.id} deleted successfully.`
    );
  });
});
