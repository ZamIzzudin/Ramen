/** @format */

import Transaction from "./Transaction";
import { hasherBinary } from "../utils/hasher";

export default class Block {
  timestamp: string;
  transaction: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  proffOn: number;

  constructor(
    timestamp: string,
    transaction: Transaction[],
    previousHash: string,
    difficulty: number
  ) {
    this.timestamp = timestamp;
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
