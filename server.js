const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const app = require("./app");

// database connections

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`application running on port ${port}`);
});
