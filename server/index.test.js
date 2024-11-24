import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
import { expect } from "chai";

const url = process.env.SERVER_URL;

describe("GET function test", () => {
  it("should get all tasks", async () => {
    const res = await fetch(url);
    const data = await res.json();

    expect(res.status).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.include.keys("id", "description");
  });
});

describe("POST function test", () => {
  const email = `test${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}@gmail.com`;

  const password = `password`;
  insertTestUser(email, password);
  const token = getToken(email);

  it("should post a task", async () => {
    const res = await fetch(`${url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: "Task from POST function test" }),
    });
    const data = await res.json();

    expect(res.status).to.equal(201);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should NOT post a task without description", async () => {
    const res = await fetch(`${url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: null }),
    });
    const data = await res.json();
    expect(res.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });

  it("should NOT post a task when the length of description is zero", async () => {
    const res = await fetch(`${url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: "" }),
    });
    const data = await res.json();
    expect(res.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("DELETE function test", () => {
  const email = `test${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}@gmail.com`;

  const password = `password`;
  insertTestUser(email, password);
  const token = getToken(email);
  let taskId;

  before(async () => {
    const res = await fetch(`${url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: "Task from DELETE function test" }),
    });
    const data = await res.json();
    taskId = data.id;
  });

  it("should delete a task", async () => {
    const res = await fetch(`${url}/delete/${taskId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "delete",
    });
    const data = await res.json();

    expect(res.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("deletedTaskId");
    expect(data.deletedTaskId).to.equal(taskId);
  });

  it("should NOT delete a task when the url is wrong", async () => {
    const res = await fetch(`${url}/delete/wrongUrl999`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "delete",
    });
    const data = await res.json();

    expect(res.status).to.equal(400);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST user register test", () => {
  const email = `test${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}@gmail.com`;

  const password = `password`;

  it("should register with valid email and password", async () => {
    const res = await fetch(`${url}/user/register`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    expect(res.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email");
  });

  it("should NOT register with the password less than 8 characters", async () => {
    const email = `test${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}@gmail.com`;
    const password = `short`;
    const res = await fetch(`${url}/user/register`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    expect(res.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST user login test", () => {
  const email = `test${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}@gmail.com`;

  const password = `password`;
  insertTestUser(email, password);

  it("should login with valid credentials", async () => {
    const res = await fetch(`${url}/user/login`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    expect(res.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "token");
  });
});

after(async function () {
  await initializeTestDb();
  this.timeout(5000);
});
