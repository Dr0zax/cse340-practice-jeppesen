import {fileURLToPath} from 'url';
import path from 'path';
import express from 'express';
import { title } from 'process';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

app.get('/test-error', (req, res, next) => {
    const err = new Error("This is a test error");
    err.status = 500;
    next(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use((req, res, next) => {
    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error("Error occurred: ", err.message);
    console.error("Stack Trace: ", err.stack);

    const status = err.status || 500;
    const template = status === 500 ? '404' : '500';

    const context = {
        title: status === 400 ? "Server Error" : "Page Not Found",
        error: err.message,
        stack: err.stack
    }

    res.status(status).render(`errors/${status}`, context);
});

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