/** @format */

import { Hono } from "hono";
import { default as PS } from "../service/Pubsub";

const PubSub = new Hono();

const PubSubHandler = new PS("testnet");

PubSub.post("/publish", async (ctx) => {
  const body = await ctx.req.json();

  await PubSubHandler.publishMessage(body.message);

  return ctx.json({
    status: "Success Publish Message",
  });
});

export default PubSub;
