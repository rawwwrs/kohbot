import mongoose from "mongoose";

const connect = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/kohbot", {
    user: "kohbot",
    pass: "supersecretpassword",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", function () {
    console.log("Database connected");
  });
};

export default { connect };
