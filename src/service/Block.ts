/** @format */

import Transaction from "@/service/Transaction.js";
import { v4 as uuid } from "uuid";
import { hasherBinary } from "@/utils/hasher.js";

export default class Block {
  id: string;
  timestamp: string;
  transaction: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  proffOn: number;

  constructor(
    transaction: Transaction[],
    previousHash: string,
    difficulty: number
  ) {
    this.id = uuid();
    this.timestamp = new Date().toISOString();
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.generateHash();
    this.proffOn = difficulty;
  }

  generateHash() {
    const value = `${this.timestamp}${this.previousHash}${JSON.stringify(
      this.transaction
    )}${this.nonce}`;

    return hasherBinary(value);
  }

  mineBlock(difficulty: number) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.nonce++;
      this.hash = this.generateHash();
    }
  }
}
