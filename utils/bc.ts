/** @format */

import service from "../service";
import Transaction from "../service/Transaction";
import { getWallet } from "./wallet";

const { blockchainHandler } = service;

interface TransactionState {
  from: string;
  to: string;
  data: string;
}

export function initiateBlock(payload: TransactionState, pvt: string) {
  const newTransaction = new Transaction(
    payload.from,
    payload.to,
    payload.data
  );

  const wallet = getWallet(pvt);

  newTransaction.signTransaction(wallet);

  blockchainHandler.initiateTransaction(newTransaction);
}

export function miningBlock(address: string) {
  blockchainHandler.minePendingBlock(address);
}
