/** @format */

import Block from "./Block";
import Wallet from "./Wallet";
import Transaction from "./Transaction";

import { validateSignature } from "../utils/wallet";
import { hasherBinary } from "../utils/hasher";

export default class Blockchain {
  chain: Block[];
  length: number;
  difficulty: number;
  transactionPool: Transaction[];
  fee: number;
  mineRate: number;
  times: number[];
  system: Wallet;

  constructor() {
    this.system = new Wallet(99999999999);

    this.difficulty = 2;
    this.transactionPool = [];
    this.fee = 100;
    this.mineRate = 1000; /* as milisecond */
    this.times = [];
    this.chain = [this.generateGenesisBlock()];
    this.length = this.chain.length;
  }

  // CONFIGURATION SETUP SECTION
  private generateGenesisBlock() {
    const system = this.system;
    const genesisTransaction = new Transaction(system, "0", 0);

    return new Block(
      Date.now().toString(),
      [genesisTransaction],
      "0",
      this.difficulty
    );
  }

  private adjustdifficulty() {
    const now = Date.now();
    const timestampBlock = parseInt(this.chain[this.length - 1].timestamp);
    if (now - timestampBlock > this.mineRate) {
      this.difficulty--;
    } else {
      this.difficulty++;
    }
  }

  private averageTime(timestamp: number) {
    const prev = parseInt(this.chain[this.length - 1].timestamp);
    const diff = timestamp - prev;

    this.times.push(diff);

    const averageTime =
      this.times.reduce((total, num) => total + num) / this.times.length;
    console.log(
      `difficulty: ${this.difficulty} | diff: ${diff}ms | average: ${averageTime}ms`
    );
  }

  // TRANSACTION SECTION
  mineTransactionPool(miner: string) {
    this.transactionPool.push(new Transaction(this.system, miner, this.fee));

    const validTransaction = this.transactionPool.filter((transaction) =>
      this.validateTransaction(transaction)
    );

    const validBlock = new Block(
      Date.now().toString(),
      validTransaction,
      this.chain[this.length - 1].hash,
      this.difficulty
    );

    validBlock.mineBlock(this.difficulty);

    this.averageTime(parseInt(validBlock.timestamp));
    this.adjustdifficulty();
    this.chain.push(validBlock);

    this.transactionPool = [];

    return {
      status: "success",
    };
  }

  initiateTransaction(wallet: Wallet, to: string, amount: number) {
    let transaction = this.transactionPool.find(
      (transaction) => transaction.input.address === wallet.publicKey
    );

    try {
      if (transaction) {
        const indexData = this.transactionPool.indexOf(transaction);
        // Remove Existing Transaction
        this.transactionPool.splice(indexData, 1);

        transaction.updateOutput(wallet, to, amount);
      } else {
        transaction = wallet.initTransaction(to, amount, this.chain);
      }

      // Push Updated Transaction
      this.transactionPool.push(transaction);
      return {
        status: "success",
      };
    } catch (err: any) {
      console.error(err.message);
      return {
        status: "failed",
      };
    }
  }

  // VALIDATION SECTION
  validateTransaction(transaction: Transaction) {
    const {
      input: { amount, address, signature },
      output,
    } = transaction;

    const outputTotal = Object.values(output).reduce(
      (total, amount) => total + amount
    );
    let rewardCount = 0;

    if (transaction.input.address === this.system.publicKey) {
      rewardCount++;

      if (rewardCount > 1) {
        console.error("Reward exceed limit");
        return false;
      }

      if (Object.values(transaction.output)[0] !== this.fee) {
        console.error("Invalid reward amount");
        return false;
      }
    } else {
      if (amount !== outputTotal) {
        console.error("Invalid transaction, amount exceeds balance");
        return false;
      }

      if (!validateSignature(address, output, signature)) {
        console.error("Invalid signature");
        return false;
      }
    }
    return true;
  }

  validateBlock(chains: Block[]) {
    for (let i = 1; i <= chains.length - 1; i++) {
      const current = chains[i];
      const previous = chains[i - 1];
      const { timestamp, transaction, previousHash, nonce } = current;

      if (Math.abs(current.proffOn - previous.proffOn) > 1) return false;

      current.transaction.forEach((transaction: Transaction) => {
        if (this.validateTransaction(transaction)) {
          return false;
        }
      });

      if (
        current.hash !==
        hasherBinary(
          `${timestamp}${previousHash}${JSON.stringify(transaction)}${nonce}`
        )
      ) {
        console.log("Generated Hash not Valid");
        return false;
      }

      if (current.previousHash !== previous.hash) {
        console.log("Chained Hash not Valid");
        return false;
      }
    }

    return true;
  }

  // UTILITY SECTION
  updateChain(submittedChain: Block[]) {
    if (submittedChain.length <= this.chain.length) {
      console.log("Chain is not Longer than Current Chain");
      return;
    }

    if (!this.validateBlock(submittedChain)) {
      console.log("Chain is not Valid");
      return;
    }

    this.chain = submittedChain;
  }

  updatePool(transactions: Transaction[]) {
    this.transactionPool = transactions;
  }
}
