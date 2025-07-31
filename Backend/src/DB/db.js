const mongoose = require("mongoose");

function connectToDB() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log(err));
}

module.exports = connectToDB;