import { Hono } from "hono"
import Blockchain from "./Blockchain"
import Wallet from "./Wallet"

const routes = new Hono()

routes.route('/bc', Blockchain)
routes.route('/wl', Wallet)

export default routes