import {fileURLToPath} from 'url';
import path from 'path';
import express from 'express';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NAME = process.env.NAME;
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";

app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, () => {
    console.log(`Server, is running on http://127.0.0.1:${PORT}`);
})