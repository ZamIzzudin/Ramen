import Transaction from "./Transaction";
import { SHA256 } from "crypto-js";

export default class Block{
    timestamp: string;
    transaction: any;
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(timestamp:string, transaction:Transaction[], previousHash='0'){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.nonce = 0
        this.hash = this.generateHash();
    }

    generateHash(){
        const value = `${this.timestamp}${this.transaction}${JSON.stringify(this.previousHash)}${this.nonce}`

        return SHA256(value).toString()
    }

    mineBlock(dificulity:number){
        while(this.hash.substring(0, dificulity) !== Array(dificulity + 1).join("0")){
            this.nonce++
            this.hash = this.generateHash();
        }

        console.log(`Block Is Mined (${this.hash})`)
    }

    validateTransaction(){
        this.transaction.forEach((each:Transaction) => {
            if(!each.isValid()){
                return false
            }
        })

        return true
    }
}