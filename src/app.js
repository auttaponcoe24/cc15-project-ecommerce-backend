require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5555;
app.listen(port, () => console.log(`server running on port ${port}`));
