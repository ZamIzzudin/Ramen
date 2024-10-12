/** @format */

import Block from "./Block";
import Transaction from "./Transaction";

import { parsedWallet } from "../utils/wallet";
import { hasherHex, hasherBinary } from "../utils/hasher";

export default class Blockchain {
  chain: Block[];
  length: number;
  difficulty: number;
  pending: Transaction[];
  fee: number;
  mineRate: number;
  times: number[];

  constructor() {
    this.difficulty = 2;
    this.pending = [];
    this.fee = 100;
    this.mineRate = 1000; /* as milisecond */
    this.times = [];
    this.chain = [this.generateGenesisBlock()];
    this.length = this.chain.length;
  }

  // CONFIGURATION SETUP SECTION
  private generateGenesisBlock() {
    const genesisTransaction = new Transaction("system", "system", {
      type: "genesis",
    });

    return new Block(
      Date.now().toString(),
      [genesisTransaction],
      "0",
      this.difficulty
    );
  }

  private adjustdifficulty() {
    const now = Date.now();
    const timestampBlock = parseInt(this.getLatestBlock().timestamp);
    if (now - timestampBlock > this.mineRate) {
      this.difficulty--;
    } else {
      this.difficulty++;
    }
  }

  private averageTime(timestamp: number) {
    const prev = parseInt(this.getLatestBlock().timestamp);
    const diff = timestamp - prev;

    this.times.push(diff);

    const averageTime =
      this.times.reduce((total, num) => total + num) / this.times.length;
    console.log(
      `difficulty: ${this.difficulty} | diff: ${diff}ms | average: ${averageTime}ms`
    );
  }

  // TRANSACTION SECTION
  minePendingBlock(miner: string) {
    const blockAdded = new Block(
      Date.now().toString(),
      this.pending,
      this.getLatestBlock().hash,
      this.difficulty
    );
    blockAdded.mineBlock(this.difficulty);

    this.averageTime(parseInt(blockAdded.timestamp));
    this.adjustdifficulty();
    // console.log('Successfully to Added New Block',this.difficulty)
    this.chain.push(blockAdded);

    this.pending = [
      new Transaction("system", miner, { type: "reward", value: this.fee }),
    ];
  }

  initiateTransaction(payload: Transaction) {
    if (!payload.from || !payload.to) {
      console.log("Address not Found");
    } else {
      if (!this.validateTransaction(payload)) {
        throw new Error("Failed to Add New Transaction, Signature not Valid");
      } else {
        this.pending.push(payload);
      }
    }
  }

  // VALIDATION SECTION
  validateTransaction(transaction: Transaction) {
    const { from, to, data, signature } = transaction;
    if (from === "system") return true;

    if (!signature || signature.length === 0) {
      throw new Error("Signature Not Found");
    }

    const publicKey = parsedWallet(from);
    return publicKey.verify(hasherHex(`${from}${to}${data}`), signature);
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

  // UTILITY SECTION
  getWalletBalance(address: string) {
    let balance = 0;

    this.chain.forEach((block: Block) => {
      block.transaction.forEach((transaction: Transaction) => {
        if (transaction.data.type === "transfer") {
          if (transaction.from === address) {
            balance += transaction.data.value;
          }
          if (transaction.to === address) {
            balance -= transaction.data.value;
          }
        }

        if (transaction.data.type === "reward") {
          if (transaction.to === address) {
            balance += transaction.data.value;
          }
        }
      });
    });

    return balance;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}
