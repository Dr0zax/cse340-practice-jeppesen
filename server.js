import {fileURLToPath} from 'url';
import path from 'path';
import express from 'express';

import { setupDatabase, testConnection } from './src/models/setup.js';
import routes from './src/controllers/routes.js';
import { addImportantLocalVariables, addAdditionalVariables } from './src/middleware/global.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(addImportantLocalVariables);
app.use(addAdditionalVariables);

app.use('/', routes);

app.use((req, res, next) => {
    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const template = status === 500 ? '500' : '404';

    if (status !== 400) {
        console.error("Error: ", err.message);
        console.error("Status: ", err.stack);
    }

    const context = {
        title: status === 500 ? "Server Error" : "Page Not Found",
        error: err.message,
        stack: NODE_ENV.includes('dev') ? err.stack : undefined
    };

    res.status(status).render(`errors/${template}`, context);
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

app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
        console.log(`Server, is running on http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
})