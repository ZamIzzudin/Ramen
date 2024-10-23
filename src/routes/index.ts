/** @format */

import { Hono } from "hono";
import Blockchain from "@/routes/Blockchain.js";

const routes = new Hono();

routes.get("/", (ctx) => {
  return ctx.json({
    message: "Welcome to Ra-Man",
    author: "Yamiyudin",
  });
});

routes.route("/bc", Blockchain);

export default routes;