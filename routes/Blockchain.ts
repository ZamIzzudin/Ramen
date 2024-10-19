/** @format */

import { Hono } from "hono";
import service from "../service";
import utilsBC from "../utils/blockchain";
import { generateWallet } from "../utils/wallet";

const Blockchain = new Hono();
// const { blockchainHandler, pubsubHandler } = service;
const { blockchainHandler } = service;

const user = generateWallet();
blockchainHandler.buyBalance(user.publicKey, 5000);

// GET
Blockchain.get("/blocks", async (ctx) => {
  return ctx.json(blockchainHandler.chain);
});

Blockchain.get("/wallet-balance/:address", async (ctx) => {
  const { address } = await ctx.req.param();

  const data = utilsBC.getWalletBalance(address);

  return ctx.json(data);
});

Blockchain.get("/wallet-transaction/:address", async (ctx) => {
  const { address } = await ctx.req.param();

  const data = utilsBC.getWalletTransaction(address);

  return ctx.json(data);
});

Blockchain.get("/mining/:address", async (ctx) => {
  const { address } = await ctx.req.param();

  const response = blockchainHandler.mineTransactionPool(address);
  // pubsubHandler.broadcastChain();

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

// POST
Blockchain.post("/add-transaction", async (ctx) => {
  const body = await ctx.req.json();

  const response = blockchainHandler.initiateTransaction(
    user.publicKey,
    body.to,
    body.amount,
    user.sign({
      from: user.publicKey,
      to: body.to,
      amount: body.amount,
      type: "transfer",
    })
  );
  // pubsubHandler.broadcastTransaction();

  if (response.status === "failed") {
    return ctx.json({
      message: "Failed to Initiate Transaction",
    });
  }

  return ctx.json({
    message: "Transaction Initiated",
  });
});

export default Blockchain;
