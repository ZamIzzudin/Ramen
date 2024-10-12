/** @format */

import { Hono } from "hono";

import service from "../service";
import EC from "../utils/key";

const Wallet = new Hono();
const { blockchainHandler } = service;

Wallet.get("/new", (ctx) => {
  const key = EC.genKeyPair();

  const publicKey = key.getPublic("hex");
  const privateKey = key.getPrivate("hex");

  return ctx.json({
    public_key: publicKey,
    private_key: privateKey,
  });
});

Wallet.get("/balance/:address", (ctx) => {
  const { address } = ctx.req.param();

  return ctx.json({
    balance: blockchainHandler.getWalletBalance(address),
  });
});

export default Wallet;
