import Block from "./Block"
import Transaction from "./Transaction"

export default class Blockchain{
    chain: Block[];
    length: number;
    dificulity: number ;
    pending: Transaction[];
    fee: number;
    mineRate: number;
    times: number[];

    constructor(){
        this.chain = [this.generateGenesisBlock()]
        this.length = this.chain.length
        this.dificulity = 2;
        this.pending = []
        this.fee = 100;
        this.mineRate = 1000 /* as milisecond */
        this.times = []
    }

    generateGenesisBlock(){
        const genesisTransaction = new Transaction('system','system',{type:'genesis'})
        
        return new Block(Date.now().toString(),[genesisTransaction],'0',this.dificulity)
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    minePendingBlock(miner:string){
        const blockAdded = new Block(Date.now().toString(), this.pending, this.getLatestBlock().hash, this.dificulity)
        blockAdded.mineBlock(this.dificulity)

        this.averageTime(parseInt(blockAdded.timestamp))
        this.adjustDificulity()
        // console.log('Successfully to Added New Block',this.dificulity)
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
                        balance += transaction.data.value
                    }
                    if(transaction.to === address){
                        balance -= transaction.data.value
                    }
                }
                
                if(transaction.data.type === 'reward'){
                    if(transaction.to === address){
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

            if(Math.abs(current.proffOn - previous.proffOn) > 1) return false

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

    private adjustDificulity(){
        const now = Date.now()
        const timestampBlock = parseInt(this.getLatestBlock().timestamp)
        if(now - timestampBlock > this.mineRate){
            this.dificulity--
        }else{
            this.dificulity++
        }
    }

    private averageTime(timestamp:number){
        const prev = parseInt(this.getLatestBlock().timestamp)
        const diff = timestamp - prev

        this.times.push(diff)

        const averageTime = this.times.reduce((total,num) => (total+num))/this.times.length
        console.log(`dificulity: ${this.dificulity} | diff: ${diff}ms | average: ${averageTime}ms`)
    }
}