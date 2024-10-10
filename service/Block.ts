import Transaction from "./Transaction";
import { SHA256 } from "crypto-js";
import hexToBin from "hex-to-bin";

export default class Block{
    timestamp: string;
    transaction: any;
    previousHash: string;
    hash: string;
    nonce: number;
    proffOn: number;

    constructor(timestamp:string, transaction:Transaction[], previousHash='0',difficulty:number){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.nonce = 0
        this.hash = this.generateHash();
        this.proffOn = difficulty
    }

    generateHash(){
        const value = `${this.timestamp}${this.transaction}${JSON.stringify(this.previousHash)}${this.nonce}`

        return hexToBin(SHA256(value).toString())
    }

    mineBlock(difficulty:number){
        while(this.hash.substring(0, difficulty) !== "0".repeat(difficulty)){
            this.nonce++
            this.hash = this.generateHash();
        }

        // console.log(`Block Is Mined (${this.hash})`)
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