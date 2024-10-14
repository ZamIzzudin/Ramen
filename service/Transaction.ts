/** @format */
import { v4 as uuid } from "uuid";
import { validateSignature } from "../utils/wallet";
import Wallet from "./Wallet";

interface OutputState {
  [key: string]: number;
}

interface inputState {
  timestamp: number;
  amount: number;
  address: string;
  signature: string;
}

export default class Transaction {
  id: string;
  output: OutputState;
  input: inputState;

  constructor(
    from: Wallet,
    to: string,
    amount: number,
    output = null,
    input = null
  ) {
    this.id = uuid();
    this.output = output || this.initOutput(from, to, amount);
    this.input = input || this.initInput(from);
  }

  private initInput(from: Wallet) {
    return {
      timestamp: Date.now(),
      amount: from.balance,
      address: from.publicKey,
      signature: from.sign(this.output),
    };
  }

  private initOutput(from: Wallet, to: string, amount: number) {
    let output: OutputState = {};

    output[to] = amount;
    output[from.publicKey] = from.balance - amount;

    return output;
  }

  updateOutput(from: Wallet, to: string, amount: number) {
    if (amount > this.output[from.publicKey]) {
      throw new Error("Amount exceeds balance");
    }

    if (!this.output[to]) {
      this.output[to] = amount;
    } else {
      this.output[to] += amount;
    }

    this.output[from.publicKey] -= amount;
    this.input = this.initInput(from);
  }
}
