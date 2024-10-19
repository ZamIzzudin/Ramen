/** @format */

import { calculateBalance } from "./wallet";
import Transaction from "../service/Transaction";
import service from "../service";

export default (() => {
  const BC = service.blockchainHandler;
  const chain = BC.chain;

  function getWalletTransaction(address: string) {
    let transactions: Transaction[] = [];

    chain.forEach((block) => {
      block.transaction.forEach((transaction) => {
        if (transaction.from === address || transaction.to === address) {
          transactions.push(transaction);
        }
      });
    });

    return transactions;
  }

  function getWalletBalance(address: string) {
    return calculateBalance(chain, address);
  }

  return {
    getWalletTransaction,
    getWalletBalance,
  };
})();
