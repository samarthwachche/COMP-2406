const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Fridge
let Fridges = Schema({
    id: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 6 
    },
    name: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 20
    },
    numItemsAccepted: {
        type: Number,
        default: 0
    },
    canAcceptItems: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    contactInfo: {
        type:{
            contactPerson:{
                type: String,
                required : true
            },
            contactPhone: {
                type: String,
                required: true,
            }
        }
    },
    address: {
        type: {
            street:     {type: String, required: true},
            postalCode: {type: String, required: true},
            city:       {type: String, required: true},
            province:   {type: String, required: true},
            country:    {type: String, required: true}
        }
    },
    acceptedTypes: [{
        type: String, 
        require: true 
    }],
    items: [{
        type: {
            id:         {type: String},
            quantity:   {type: Number}
        }
    }]
});

Fridges.statics.findById = function(fridgeid, callback){
    this.find({id: fridgeid}, callback);
}

module.exports = mongoose.model("Fridges", Fridges);
