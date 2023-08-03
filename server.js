const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Router = require("./routers");
const path = require("path");
const app = express();

const dbURI = process.env.DATABASE;
const port = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://expense-tracer-by-bishal.netlify.app');
  next();
});

// Enable CORS for a specific origin
app.use(cors({
  origin: 'https://expense-tracer-by-bishal.netlify.app',
}));


app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);

/*/ Define a route handler for the root path ("/")
app.get("/", (req, res) => {
  res.send("");
});*/

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(port, () => {
      console.log(`Connected to MongoDB and listening at port ${port}`);
    });
  })
  .catch((err) => console.error(err));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
