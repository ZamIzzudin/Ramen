/** @format */

import Block from "./Block";
import Wallet from "./Wallet";
import Transaction from "./Transaction";

import { calculateBalance, validateSignature } from "../utils/wallet";
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
    this.system = new Wallet();

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

    const signature = system.sign({
      from: system.publicKey,
      to: "0",
      amount: 0,
      type: "genesis",
    });

    const genesisTransaction = new Transaction(
      system.publicKey,
      "0",
      0,
      "genesis",
      signature
    );

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
    const system = this.system;

    const signature = system.sign({
      from: system.publicKey,
      to: miner,
      amount: this.fee,
      type: "reward",
    });

    this.transactionPool.push(
      new Transaction(
        this.system.publicKey,
        miner,
        this.fee,
        "reward",
        signature
      )
    );

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

  initiateTransaction(
    from: string,
    to: string,
    amount: number,
    signature: string
  ) {
    const newTransaction = new Transaction(
      from,
      to,
      amount,
      "transfer",
      signature
    );

    if (!this.validateTransaction(newTransaction)) {
      return {
        status: "failed",
      };
    }

    this.transactionPool.push(newTransaction);

    return {
      status: "success",
      transaction: newTransaction,
    };
  }

  // VALIDATION SECTION
  validateTransaction(transaction: Transaction) {
    const { from, to, amount, type, signature } = transaction;

    if (!validateSignature(from, to, amount, type, signature)) {
      console.error("Invalid signature");
      return false;
    }

    if (type === "transfer") {
      if (calculateBalance(this.chain, from) < amount) {
        console.error("Exceeds Balance");
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

  buyBalance(address: string, amount: number) {
    const system = this.system;

    const signature = system.sign({
      from: system.publicKey,
      to: address,
      amount: amount,
      type: "buy",
    });

    const initiateBalance = new Transaction(
      system.publicKey,
      address,
      amount,
      "buy",
      signature
    );

    this.transactionPool.push(initiateBalance);
    this.mineTransactionPool(this.system.publicKey);
  }
}
