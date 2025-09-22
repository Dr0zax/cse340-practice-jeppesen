import {fileURLToPath} from 'url';
import path from 'path';
import express from 'express';
import { error } from 'console';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NAME = process.env.NAME;
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    next();
})

app.get('/', (req, res) => {
    const title = "Welcome!";
    res.render('home', { title });
})
app.get('/about', (req, res) => {
    const title = "About Me";
    res.render('about', { title });
})
app.get('/products', (req, res) => {
    const title = "Products";
    res.render('products', { title })
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
        wsServer.on('listening', () => {
            console.log(`Websocket running on port ${wsPort}`);
        })

        wsServer.on('error', (error) => {
            console.error('Websocket server error:', error);
        })
    } catch (error) {
        console.error("Failed to start WebSocket server", error);
    }
}

app.listen(PORT, () => {
    console.log(`Server, is running on http://127.0.0.1:${PORT}`);
})