/** @format */

import { Hono } from "hono";
import service from "../service";
import { generateWallet } from "../utils/wallet";

const Blockchain = new Hono();
const { blockchainHandler, pubsubHandler } = service;

const user = generateWallet();

// GET
Blockchain.get("/blocks", async (ctx) => {
  return ctx.json(blockchainHandler.chain);
});

// POST
Blockchain.post("/add-transaction", async (ctx) => {
  const body = await ctx.req.json();

  const response = blockchainHandler.initiateTransaction(
    user,
    body.to,
    body.amount
  );
  pubsubHandler.broadcastTransaction();

  if (response.status === "failed") {
    return ctx.json({
      message: "Failed to Initiate Transaction",
    });
  } else {
    return ctx.json({
      message: "Transaction Initiated",
    });
  }
});

Blockchain.get("/mining/:address", async (ctx) => {
  const { address } = await ctx.req.param();

  const response = blockchainHandler.mineTransactionPool(address);
  pubsubHandler.broadcastChain();

  if (response.status === "failed") {
    return ctx.json({
      message: "Failed to Mine Block",
    });
  } else {
    return ctx.json({
      message: "Succesfully Mined Block",
    });
  }
});

export default Blockchain;
