/** @format */

import { Hono } from "hono";
import service from "../service";
import utilsBC from "../utils/blockchain";
import { generateWallet } from "../utils/wallet";

const Blockchain = new Hono();
// const { blockchainHandler, pubsubHandler } = service;
const { blockchainHandler } = service;

const user = generateWallet();
blockchainHandler.buyBalance(
  "04c350144d235b8f3cfd3d22759b8290b65774051aae27368e0b334135ea4b23a9ffc1bf9fa29501b83cf18bd492909de2306be34989fec91804989d253a6abd99",
  5000
);

// GET
Blockchain.get("/blocks", async (ctx) => {
  return ctx.json(blockchainHandler.chain);
});

Blockchain.get("/block/:id", async (ctx) => {
  const { id } = await ctx.req.param();

  return ctx.json(utilsBC.getBlockByID(id));
});

Blockchain.get("/transaction-pool", async (ctx) => {
  return ctx.json(utilsBC.getTransactionPool());
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

Blockchain.post("/gas-fee", async (ctx) => {
  const { amount } = await ctx.req.json();

  return ctx.json(utilsBC.getGasFee(amount));
});

export default Blockchain;
