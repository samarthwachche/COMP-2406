// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();

let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");


app.use(express.json()); // body-parser middleware


// Get /fridges and return the all of the fridges based on requested format
router.get('/', (req,res)=> {

	res.format({
		'text/html': ()=> {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname,'public','view_pickup.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
		'application/json': ()=> {
			res.set('Content-Type', 'application/json');
			Fridge.find({}, function(err, result){
				if(err) throw err;
				res.send(result);
			});
        },
        'default' : ()=> {
            res.status(406).send('Not acceptable');
        }
    })
});
// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page
router.get("/types", function(req, res, next){
	let types = [];
  Object.entries(req.app.locals.items).forEach(([key, value]) => {
    if(!types.includes(value["type"])){
      types.push(value["type"]);
    }
  });
	res.status(200).set("Content-Type", "application/json").json(types);
});

// Middleware function: this function validates the contents of the request body associated with adding a new fridge into the application. At the minimimum, it currently validates that all the required fields for a new fridge are provided.
function validateFridgeBody(req,res,next){
    let properties = ['name','can_accept_items','accepted_types','contact_person','contact_phone','address'];

    for(property of properties){
      // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
        if (!req.body.hasOwnProperty(property)){
            return res.status(400).send("Bad request");
        }
    }
    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}

function validateOtherItemBody(req, res, next){
	let properties = ['name', 'type', 'img'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}
// Middleware function: this validates the contents of request body, verifies item data
function validateItemBody(req,res,next){
    let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}
// Adds a new fridge, returns newly created fridge
router.post('/', validateFridgeBody, (req,res)=> {
	
	Fridge.find(function(err, result){
		let newFridge = new Fridge({
			id: "fg-"+(result.length+1).toString(),
			name: req.body.name,
			canAcceptItems: req.body.can_accept_items,
			contactInfo:{
				contactPerson: req.body.contact_person,
				contactPhone: req.body.contact_phone,
			},
			address: req.body.address,
			acceptedTypes: req.body.accepted_types
		});

		newFridge.save(function(err, result){
			if(err){
				console.log("Error saving fridge:");
				console.log(err.message);
				return;
			}
	  
			console.log("Saved new Fridge:");
			console.log(result);
			res.send(result);
		});	
	})
});

// Get /fridges/{fridgeID}. Returns the data associated with the requested fridge.
router.get("/:fridgeId", function(req, res, next){
	
	Fridge.findById(req.params.fridgeId, function(err, result){
		console.log(result);
		if(result !== undefined){
			res.send(result);
		}
		else if(result[0] === undefined){
			res.status(404).send('Fridge does not exsist');
		}
	});
	
});

// Updates a fridge and returns the data associated.
// Should probably also validate the item data if any is sent, oh well :)
router.put("/:fridgeId", (req, res) =>{
	
	Fridge.findOneAndUpdate({id : {"$eq" : req.params.fridgeId}} ,req.body, {new:true},function (err, result) {
		if(result === undefined){
			res.status(400).send("Bad format");
		}
        else{
			//if(result.modifiedCount > 0){
			res.status(200).json(result);
			//}
			// else{
			// 	res.status(400).send("Bad format");
			// }   
        }
    });
});

// Adds an item to specified fridge
router.post("/:fridgeId/items", validateItemBody, (req,res)=>{

    Fridge.find({ $and : [  {id : req.params.fridgeId},  {items : {$elemMatch : {id:req.body.id}}} ]  }, function (err, result){
        if(result.length === 0 || result === null){
        	console.log("The item is not found!");

        	Fridge.findOneAndUpdate({id : req.params.fridgeId},  { $push: { items: req.body  } }, {new:true}, function (err, result){
            	if (err){
					console.log(err);
				}
            	else {
					res.status(200).send(result);
				}
        	});
        }
        else {
        	res.status(409).send("The item exists!"); 
        }
    });
});

// Deletes an item from specified fridge
router.delete("/:fridgeId/items/:itemId", (req,res)=>{

	Fridge.find({ $and : [  {id : {"$eq" : req.params.fridgeId}},  {items : {$elemMatch : {id : req.params.itemId}}} ]  }, function (err, result){
		if(result !== undefined){
			Fridge.findOneAndUpdate({id : {"$eq" : req.params.fridgeId}}, { $pull: { items: {id:req.params.itemId}  } }, {new:true}, function(err, result){
				if(err) throw err;
				res.status(200).send(result);
			});	
		}
		else{
			res.status(404).send("Item not found");
		}
	});
});

router.delete("/:fridgeId/items", (req,res)=>{

	let query = req.query;
	let fridgeid = req.params.fridgeId;

	if(Object.keys(query).length == 0){
		Fridge.findOneAndUpdate({id : {"$eq" : fridgeid}}, {"items" : []}, function(err, result){
			if(result === undefined){
				res.status(204);
				res.send("item id does not exists");
			}
			else{
				res.status(200);
				res.send("item deleted");
			}
		});
	}
	else{
		let itemIds = Object.values(query);
		for (let itemid of itemIds){
			Fridge.findOneAndUpdate({id : {"$eq" : fridgeid}}, { $pull: { items: {id:itemid}}}, {new:true}, function(err, result){
				//if(err) throw err;
				if(result === undefined){
					res.status(204).send("item does not exists")
				}
				else{
					res.status(200).send(result);
				}
				
			});	
		}	
	}
});

router.put("/:fridgeId/items/:itemId", (req, res) =>{
	Fridge.find({ $and : [  {id : {"$eq" : req.params.fridgeId}},  {items : {$elemMatch : {id : req.params.itemId}}} ]  }, function (err, result){
		if(result !== undefined){
			Fridge.findOneAndUpdate({id : {"$eq" : req.params.fridgeId}}, { $set: { items: {quantity : req.body.quantity}  } }, {new:true}, function(err, result){
				if(err) throw err;
				res.status(200).send(result);
			});	
		}
		else{
			res.status(404).send("Item not found");
		}
	});
});

router.post("/items", validateOtherItemBody, (req, res) =>{

    Item.find(function(err, result){
		Item.find({name : req.body.name}, function(err, result){
			if(result[0] !== undefined){
				res.status(409).send("Item already exists");
			}
			else{
				let newItem = new Item({
					id : result.length + 1,
					name: req.body.name,
					type : req.body.type,
					img: req.body.img
				});

				newItem.save(function (err, result){
					if(err){
						console.log(err.message);
						console.log("Err adding");
						res.status(500);
					}
					else{
						console.log("New item added");
						console.log(result);
						res.status(200).send(result);
					}
				})
			}
		})
	})
	
});

router.get("/search/items", function(req, res){
	let query = req.query;
	Type.find({name : {"$eq" : Object.values(query)[0]}}, function (err, result){ 
	  	if (err) { 
			console.log(err); 
	  	} 
	  	else { 
			Item.find({$and : [ {type : {"$eq" : result[0].id}},{ "name": { "$regex": Object.values(query)[1]} }]}, function (err, result){
				if (err){ console.log(err);
					res.status(404).send("Error");
				} 
				else { 
					console.log(result);
					res.status(200).send(result);
				}
			});
	  	}
	});
});

module.exports = router;
