/** @format */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import routes from "./routes";
import { config } from "dotenv";

import syncNode from "./utils/syncnode";

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

export default handle(app);
// export default app;
