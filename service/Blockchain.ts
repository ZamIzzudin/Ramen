import Block from "./Block"
import Transaction from "./Transaction"

export default class Blockchain{
    chain: Block[];
    length: number;
    dificulity: number ;
    pending: Transaction[];
    fee: number;

    constructor(){
        this.chain = [this.generateGenesisBlock()]
        this.length = this.chain.length
        this.dificulity = 2;
        this.pending = []
        this.fee = 100;
    }

    generateGenesisBlock(){
        const genesisTransaction = new Transaction('system','system',{type:'genesis'})
        
        return new Block('01/01/2001',[genesisTransaction])
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    minePendingBlock(miner:string){
        const blockAdded = new Block(Date.now().toString(), this.pending, this.getLatestBlock().hash)
        blockAdded.mineBlock(this.dificulity)

        console.log('Successfully to Added New Block')
        this.chain.push(blockAdded)

        this.pending = [
            new Transaction('system', miner, {type:'reward', value: this.fee})
        ]
    }

    initiateTransaction(payload:Transaction){
        if(!payload.from || !payload.to){
            console.log('Address not Found')
        }else{
            if(!payload.isValid()){
                throw new Error('Failed to Add New Transaction, Signature not Valid')
            }else{
                this.pending.push(payload)
            }
        }
    }

    getWalletBalance(address:string){
        let balance = 0

        this.chain.forEach((block:Block) => {
            block.transaction.forEach((transaction:Transaction) => {
                if(transaction.data.type === 'transfer'){
                    if(transaction.from === address){
                        console.log('TRANSFER IN', transaction.data.value)
                        balance += transaction.data.value
                    }
                    if(transaction.to === address){
                        console.log('TRANSFER OUT', transaction.data.value)
                        balance -= transaction.data.value
                    }
                }
                
                if(transaction.data.type === 'reward'){
                    if(transaction.to === address){
                        console.log('GAIN REWARD', transaction.data.value)
                        balance += transaction.data.value
                    }
                }
            })
        })

        return balance
    }

    validateBlock(){
        for(let i = 1; i <= this.chain.length-1 ; i++){
            const current = this.chain[i]
            const previous = this.chain[i - 1]

            if(!current.validateTransaction()){
                return false
            }

            if(current.hash !== current.generateHash()){
                console.log('Generated Hash not Valid')
                return false
            }

            if (current.previousHash !== previous.hash) {
                console.log('Chained Hash not Valid')
                return false;
            }
        }

        return true
    }
}