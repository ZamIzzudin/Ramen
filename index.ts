import { config } from "dotenv";
import Blockchain from "./service/Blockchain";
import Transaction from "./service/Transaction";
import EC from "./service/KeyGenerator";

const local = process.env.NODE_ENV || 'local';
config({ path: `.env.${local}` });

const Chain = new Blockchain()
const privateKeyA = process.env.PRIVATE_KEY_A || ''
const privateKeyB = process.env.PRIVATE_KEY_B || ''

const walletA = EC.keyFromPrivate(privateKeyA)
const walletB = EC.keyFromPrivate(privateKeyB)

const publicKeyA = walletA.getPublic('hex')
const publicKeyB = walletB.getPublic('hex')

const transaction_1 = new Transaction(publicKeyA,publicKeyB,{type:'transfer', value:100})
const transaction_2 = new Transaction(publicKeyA,publicKeyB,{type:'transfer', value:100})
const transaction_3 = new Transaction(publicKeyB,publicKeyA,{type:'transfer', value:100})

transaction_1.signTransaction(walletA)
transaction_2.signTransaction(walletA)
transaction_3.signTransaction(walletB)

Chain.initiateTransaction(transaction_1)
Chain.initiateTransaction(transaction_2)
Chain.initiateTransaction(transaction_3)

// for(let i = 1; i < 100; i++){
//     console.log(i)
//     Chain.minePendingBlock(publicKeyB)
// }
// console.log('DONE')