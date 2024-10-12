/** @format */

import { Hono } from "hono";
import routes from "./routes";
import { config } from "dotenv";

import syncNode from "./utils/syncnode";

const local = process.env.NODE_ENV || "local";
config({ path: `.env.${local}` });

const app = new Hono();

const DEFAULT_PORT = process.env.DEFAULT_PORT || "8000";
const DEFAULT_NODE_URL = `http://localhost:${DEFAULT_PORT}`;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = parseInt(DEFAULT_PORT) + Math.ceil(Math.random() * 1000);
  syncNode(DEFAULT_NODE_URL);
}

app.route("/api", routes);

export default {
  port: PEER_PORT || DEFAULT_PORT,
  fetch: app.fetch,
};
