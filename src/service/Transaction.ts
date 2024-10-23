/** @format */
import { v4 as uuid } from "uuid";

export default class Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: string;
  signature: string;
  timestamp: string;

  constructor(
    from: string,
    to: string,
    amount: number,
    type: string,
    signature: string
  ) {
    this.id = uuid();
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.type = type;
    this.signature = signature;
    this.timestamp = new Date().toISOString();
  }
}
