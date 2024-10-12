/** @format */

import { Hono } from "hono";
import service from "../service";

import { initiateBlock, miningBlock } from "../utils/bc";

const Blockchain = new Hono();
const { blockchainHandler, pubsubHandler } = service;

// GET
Blockchain.get("/blocks", async (ctx) => {
  return ctx.json(blockchainHandler.chain);
});

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
  pubsubHandler.broadcastChain();

  return ctx.json({
    message: "Succesfully Mined Block",
  });
});

export default Blockchain;
