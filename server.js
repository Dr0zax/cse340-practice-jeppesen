import express from 'express';

const app = express();

const name = process.env.NAME;

app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`);
})

app.get("/new-route", (req, res) => {
    res.send("This is a different route.");
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server, is running on http://127.0.0.1:${port}`);
})