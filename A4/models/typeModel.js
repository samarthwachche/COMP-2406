const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Type
let Types = Schema({
    id: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 4 
    },
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
});

module.exports = mongoose.model("Types", Types);
