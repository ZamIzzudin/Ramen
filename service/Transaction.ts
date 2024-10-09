import { SHA256 } from "crypto-js";
import { ec } from "elliptic";

const EC = new ec('secp256k1');

type Wallet = ec.KeyPair

export default class Transaction{
    from: string;
    to: string;
    data: any;
    signature: string;

    constructor(from:string, to:string, data:any){
        this.from = from
        this.to = to
        this.data = data
        this.signature = ""
    }

    generateHash(){
        return SHA256(`${this.from}${this.to}${this.data}`).toString()
    }

    signTransaction(wallet:Wallet){
        if(wallet.getPublic('hex') !== this.from){
            throw new Error ('Failed to Sign Transaction, Key not Valid')
        }

        const hashed = this.generateHash()
        const sign = wallet.sign(hashed,'base64')
        this.signature = sign.toDER('hex')
    }

    isValid(){
        if(this.from === 'system') return true

        if (!this.signature || this.signature.length === 0) {
            throw new Error('Signature Not Found')
        }

        const publicKey = EC.keyFromPublic(this.from, 'hex');
        return publicKey.verify(this.generateHash(), this.signature);
    }
}