import apiRouter from './apiRouter.js';
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.static("public"))
app.use('/api', apiRouter)

app.get('/*', (req, res) => {
    res.sendFile(__dirname +'/public/index.html')
})

app.listen(6060)