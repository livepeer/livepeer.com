import express from "express";
import fetch from "isomorphic-fetch";
import { DB } from "../store/db";
import schema from "../schema/schema.json";
import WebhookCannon from "./cannon";
import makeStore from "../store";
import serverPromise from "../test-server";
import { TestClient, clearDatabase } from "../test-helpers";

const bodyParser = require("body-parser");
jest.setTimeout(15000);

describe("webhook cannon", () => {
  let server;
  let webhookServer;
  let listener;
  let testHost;
  let db;

  let mockAdminUser;
  let mockNonAdminUser;
  let postMockStream;
  let mockWebhook;
  let client,
    adminUser,
    adminToken,
    nonAdminUser,
    nonAdminToken,
    generatedWebhook,
    generatedWebhook2,
    generatedWebhookNonAdmin;

  async function setupUsers(server) {
    const client = new TestClient({
      server,
    });
    // setting up admin user and token
    const userRes = await client.post(`/user/`, { ...mockAdminUser });
    let adminUser = await userRes.json();

    let tokenRes = await client.post(`/user/token`, { ...mockAdminUser });
    const adminToken = await tokenRes.json();
    client.jwtAuth = adminToken["token"];

    const user = await server.store.get(`user/${adminUser.id}`, false);
    adminUser = { ...user, admin: true, emailValid: true };
    await server.store.replace(adminUser);

    const resNonAdmin = await client.post(`/user/`, { ...mockNonAdminUser });
    let nonAdminUser = await resNonAdmin.json();

    tokenRes = await client.post(`/user/token`, { ...mockNonAdminUser });
    const nonAdminToken = await tokenRes.json();

    const nonAdminUserRes = await server.store.get(
      `user/${nonAdminUser.id}`,
      false
    );
    nonAdminUser = { ...nonAdminUserRes, emailValid: true };
    await server.store.replace(nonAdminUser);
    return { client, adminUser, adminToken, nonAdminUser, nonAdminToken };
  }

  beforeAll(async () => {
    // await clearDatabase();

    try {
      server = await serverPromise;
      console.log("postgres NAME", server.postgresUrl);
    } catch (error) {
      console.log("caught server error ", error);
    }
    postMockStream = require("../controllers/wowza-hydrate.test-data.json")
      .stream;
    delete postMockStream.id;
    delete postMockStream.kind;
    postMockStream.presets = ["P360p30fps16x9", "P144p30fps16x9"];
    postMockStream.renditions = {
      bbb_360p:
        "/stream/305b9fa7-c6b3-4690-8b2e-5652a2556524/P360p30fps16x9.m3u8",
      thesource_bbb: "/stream/305b9fa7-c6b3-4690-8b2e-5652a2556524/source.m3u8",
      random_prefix_bbb_160p:
        "/stream/305b9fa7-c6b3-4690-8b2e-5652a2556524/P144p30fps16x9.m3u8",
    };
    postMockStream.wowza.streamNameGroups = [
      {
        name: "bbb_all",
        renditions: ["thesource_bbb", "bbb_360p", "random_prefix_bbb_160p"],
      },
      {
        name: "bbb_mobile",
        renditions: ["random_prefix_bbb_160p"],
      },
    ];

    mockAdminUser = {
      email: "user_admin@gmail.com",
      password: "x".repeat(64),
    };

    mockNonAdminUser = {
      email: "user_non_admin@gmail.com",
      password: "y".repeat(64),
    };

    mockWebhook = {
      id: "mock_webhook",
      name: "test webhook 1",
      kind: "webhook",
      createdAt: Date.now(),
      event: "streamStarted",
      url: "http://localhost:30000/webhook",
      // url: 'https://livepeer.com/'
    };

    ({
      client,
      adminUser,
      adminToken,
      nonAdminUser,
      nonAdminToken,
    } = await setupUsers(server));
    console.log("beforeALL done");
  });

  beforeAll(async () => {
    webhookServer = express();
    return new Promise<void>((resolve, reject) => {
      listener = webhookServer.listen(30000, function (err) {
        if (err) {
          return reject(err);
        }
        const port = listener.address().port;
        testHost = `http://localhost:${port}`;
        console.log("Example app listening at http://%s", testHost);
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      listener.close(() => {
        resolve();
      });
    });
    server.queue.close();
    server.webhook.stop();
    webhookServer.close();
    // await db.close();
  });

  // afterEach(() => {
  //   listener.close();
  // });

  it("should have a test server", async () => {
    // webhookServer.use(bodyParser);
    webhookServer.get("/self-test", (req, res) => {
      res.end("self test was good");
    });
    const res = await fetch(`${testHost}/self-test`);
    const text = await res.text();
    expect(text).toEqual("self test was good");
  });

  it("should be able to receive the webhook event", async () => {
    // create the webhook
    let res = await client.post("/webhook", { ...mockWebhook });
    let resJson = await res.json();
    console.log("webhook body: ", resJson);
    expect(res.status).toBe(201);
    expect(resJson.blocking).toBe(true);
    generatedWebhook = resJson;
    res = await client.post("/webhook", {
      ...mockWebhook,
      name: "test 2",
      blocking: false,
    });
    resJson = await res.json();
    expect(resJson.blocking).toBe(false);
    console.log("webhook body: ", resJson);
    expect(res.status).toBe(201);
    expect(resJson.name).toBe("test 2");
    generatedWebhook2 = resJson;

    client.jwtAuth = nonAdminToken["token"];
    res = await client.post("/webhook", {
      ...mockWebhook,
      name: "test non admin",
    });
    resJson = await res.json();
    console.log("webhook body: ", resJson);
    expect(res.status).toBe(201);
    expect(resJson.name).toBe("test non admin");
    generatedWebhookNonAdmin = resJson;
    client.jwtAuth = adminToken["token"];

    // test endpoint
    let resp;
    webhookServer.use(bodyParser.json());
    webhookServer.post("/webhook", (req, res) => {
      console.log("WEBHOOK WORKS , body", req.body);
      resp = 200;
      res.end();
    });

    await server.queue.emit({
      id: "webhook_test_12",
      time: Date.now(),
      channel: "test.channel",
      event: "streamStarted",
      streamId: resJson.id,
      userId: nonAdminUser.id,
      isConsumed: false,
    });

    await sleep(3000);
    expect(resp).toBe(200);
  });
});

async function sleep(duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
}