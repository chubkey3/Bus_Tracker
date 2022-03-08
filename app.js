//const fetch = require('node-fetch');
import fetch from 'node-fetch';
import xml2js from 'xml2js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname})
})

app.listen(3000);