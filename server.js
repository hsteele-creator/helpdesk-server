const agentRoutes = require("./routes/agentRoutes")
const contactRoutes = require("./routes/contactRoutes")
const ticketRoutes = require("./routes/ticketRoutes")
const todoRoutes = require("./routes/todoRoutes")


const PORT = process.env.PORT || 8000;

const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

app.use(agentRoutes)
app.use(contactRoutes)
app.use(ticketRoutes)
app.use(todoRoutes)

app.listen(PORT)