/** @format */

import { default as Chain } from "../service";
import { Hono } from "hono";

import { initiateBlock, miningBlock } from "../utils/bc";

const Blockchain = new Hono();

// GET
Blockchain.get("/blocks", async (ctx) => ctx.json(Chain.chain));

// POST
Blockchain.post("/add-transaction", async (ctx) => {
  const body = await ctx.req.json();
  const key = (await ctx.req.header("pvt_key")) || "";

  initiateBlock(body, key);

  return ctx.json({
    message: "Transaction Initiated",
  });
});

Blockchain.get("/mining/:address", async (ctx) => {
  const { address } = await ctx.req.param();
  miningBlock(address);

  return ctx.json({
    message: "Succesfully Mined Block",
  });
});

export default Blockchain;
