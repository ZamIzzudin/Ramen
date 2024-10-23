/** @format */

import { Hono } from "hono";
import { cors } from "hono/cors";

import routes from "@/routes/index.js";
import { config } from "dotenv";

import syncNode from "@/utils/syncnode.js";

config();

const app = new Hono();

const DEFAULT_NODE = process.env.DEFAULT_NODE || "";

if (DEFAULT_NODE !== "") {
  syncNode(DEFAULT_NODE);
}

const corsConfig = {
  origin: ["http://localhost:3000"],
};

app.get("/", (ctx) => ctx.redirect("/api"));

app.use("/api/*", cors(corsConfig));

app.route("/api", routes);

export default app;
