import { Hono } from "hono";
import {default as Chain} from '../service'
import EC from "../utils/key";

const Wallet = new Hono()

Wallet.get('/new',(ctx) => {
    const key = EC.genKeyPair()

    const publicKey = key.getPublic('hex')
    const privateKey = key.getPrivate('hex')

    return ctx.json({
        public_key: publicKey,
        private_key: privateKey
    })
})

Wallet.get('/balance/:address',(ctx) => {
    const { address } = ctx.req.param()

    return ctx.json({
        balance: Chain.getWalletBalance(address)
    })
})

export default Wallet