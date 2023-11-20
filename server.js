const PORT = process.env.PORT || 8000;

const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json('hello')
})

app.listen(PORT)