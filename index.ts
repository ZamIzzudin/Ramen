import { Hono } from 'hono'
import routes from './routes'

const app = new Hono()

const PORT = 8000

app.route('/api', routes)

export default {
    port: PORT,
    fetch: app.fetch
}