/** @format */

import { Hono } from "hono";
import service from "../service";

const PubSub = new Hono();
const { pubsubHandler } = service;

PubSub.post("/publish/:channel", async (ctx) => {
  const { channel } = ctx.req.param();
  const body = await ctx.req.json();

  await pubsubHandler.publishMessage(channel, body.message);

  return ctx.json({
    status: "Success Publish Message",
  });
});

export default PubSub;
