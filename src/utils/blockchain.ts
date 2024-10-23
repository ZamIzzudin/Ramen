/** @format */

import { calculateBalance } from "@/utils/wallet.js";
import service from "@/service/index.js";

export default (() => {
  const BC = service.blockchainHandler;
  const chain = BC.chain;

  function getWalletTransaction(address: string) {
    let transactions: any[] = [];

    chain.forEach((block) => {
      block.transaction.forEach((transaction) => {
        const { signature, ...data } = transaction;

        if (transaction.from === address || transaction.to === address) {
          if (transaction.type === "transfer") {
            transactions.push({
              ...data,
              type:
                transaction.type === "transfer" && transaction.from === address
                  ? "send"
                  : "receive",
            });
          } else {
            transactions.push(data);
          }
        }
      });
    });

    return transactions.reverse();
  }

  function getWalletBalance(address: string) {
    return calculateBalance(chain, address);
  }

  function getBlockByID(id: string) {
    return chain.find((block) => block.id === id);
  }

  function getTransactionPool() {
    return BC.transactionPool;
  }

  function getGasFee(amount: number) {
    const gasfee = BC.fee;

    return amount / 1000 + gasfee;
  }

  return {
    getWalletTransaction,
    getWalletBalance,
    getBlockByID,
    getTransactionPool,
    getGasFee,
  };
})();
