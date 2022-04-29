const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect("mongodb://localhost:27017/anonymous-chat", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Error:"));
    db.once("open", () => console.log("MongoDB: Connected!"));
};
