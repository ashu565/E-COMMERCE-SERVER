const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({
  path: "./config.env",
});

const app = require("./app");

const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then((conection) => {
    console.log("Database Connected Successfully");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`application running on port ${port}`);
});
