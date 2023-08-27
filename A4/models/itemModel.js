const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for an Item
let Items = Schema({
    id: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 4 
    },
    name: {
        type: String,
        minLength: 2,
        maxLength: 20
    },
    type: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true,
        minLength: 5,
        maxLenght: 25
    }
});

module.exports = mongoose.model("Items", Items);
