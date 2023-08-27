const express = require('express');
const path = require('path');
let router = express.Router();
const app = express();

app.use(express.json()); 

const fridge = require("./public/js/comm-fridge.js");

router.get("/", function(req, res, next){
	console.log("Inside the GET /index.html request...");
	res.format({
		'text/html' : function(){
			let id = "/index.html";
			let result = path.join(__dirname, '/public'+id);
			if(result !== undefined ){
				res.status(200).sendFile(result);
			}
			else if(result === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500);
			}
		}
	});
});

router.get("/index.html", function(req, res, next){
	console.log("Inside the GET /index.html request...");
	res.format({
		'text/html' : function(){
			let id = "/index.html";
			let result = path.join(__dirname, '/public'+id);
			if(result !== undefined ){
				res.status(200).sendFile(result);
			}
			else if(result === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500);
			}
		}
	});
});

router.get("/fridges", express.json(), function(req, res, next){
	console.log("Inside the GET /fridges request...");
	res.format({
		'text/html' : function(){
			let id = "/view_pickup.html"
			let filepath = path.join(__dirname, '/public'+id);
			if(filepath !== undefined ){
				res.status(200).sendFile(filepath);
			}
			else if(filepath === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500);
			}
		},
		'application/json' : function(){
			let filepath = path.join(__dirname, '/public/js/comm-fridge-data.json');
			if(filepath !== undefined ){
				res.status(200).sendFile(filepath);
			}
			else if(filepath === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500);
			}
		}
	});
});

router.get("/fridges/addFridge", function(req, res, next){
	console.log("Inside the GET /fridges/addFridge request...");
	res.format({
		'text/html' : function(){
			let id = "/addFridges.html";
			let filepath = path.join(__dirname, '/public'+id);
			if(filepath !== undefined){
				res.status(200).sendFile(filepath);
			}
			else if(filepath === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500).send();
			}
		}
	});
});

router.post("/fridges", express.json(), function(req,res,next){
	console.log("Inside the /fridges POST request...");
	res.format({
		'application/json' : function(){
			let name 			= 	req.body.name; 	
			let naccept_items	= 	req.body.num_items_accepted;
			let caccept_items 	= 	req.body.can_accept_items;
			let accept_type		= 	req.body.accepted_types;
			let contactPerson 	= 	req.body.contact_person;
			let contactPhone	=	req.body.contact_phone;
			let address 		= 	req.body.address;
			let street			= 	req.body.address.street;
			let postal_code		=	req.body.address.postal_code;
			let city 			=	req.body.address.city;
			let province		=	req.body.address.province;
			let country			=	req.body.address.country;
			if(name === undefined || naccept_items === undefined || caccept_items === undefined || accept_type === undefined || 
				contactPerson === undefined || contactPhone === undefined || address === undefined || street === undefined || 
				postal_code === undefined || city === undefined || province === undefined || country === undefined){
					res.status(400).send("The category name is poorly formatted.");
			}
			else {
				let result = fridge.createCategory(name, naccept_items, caccept_items, accept_type, contactPerson, contactPhone,  address, street, postal_code, city, province, country);
				if(result === undefined){ 
					res.status(409).send("The fridge name is duplicate");
				}
				else if(result !== undefined){ 
					res.status(200).set("Content-Type", "application/json").json(result);
				}
				else{
					res.status(500).send();
				}
			}
		}
	});
});

router.get("/fridges/:fridgeID", function(req, res, next){
	console.log("Inside the GET /fridges/:fridgeID request...");
	res.format({
		'application/json':function(){
			let id = "/comm-fridge-items.json";
			let items = fridge.findFridge(req.params.fridgeID);
			let filepath = path.join(__dirname, '/public/js'+id);
			console.log(items);
			//console.log(filepath);

			if(filepath !== undefined){
				res.status(200).sendFile(filepath);
				res.send(JSON.stringify(items));
			}
			else if(filepath === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500).send();
			}
		}
	});
});

router.get("/fridges/editFridge", function(req, res, next){
	console.log("Inside the GET /fridges/editFridge request...");
	res.format({
		'text/html' : function(){
			let id = '/editFridge.html';
			let filepath = path.join(__dirname, '/public'+id);
			console.log(filepath);
			if(filepath !== undefined){
				res.status(200).sendFile(filepath);
			}
			else if(filepath === undefined){
				res.status(404).send("404 : file not found!");
			}
			else{
				res.status(500).send();
			}
		}
	});
});

router.put("/fridges/:fridgeID", express.json(), function(req, res, next){
	console.log("Inside the /fridges/:fridgeID PUT request...");
	let attribute1 = req.body.attribute1; 	
	let attribute2 = req.body.attribute2;

	console.log(req.body);
	console.log(attribute1);
	console.log(attribute2);

	if(attribute1 === undefined || attribute2 === undefined){
		res.status(400).send("The fridge attribute1 or attribute2 is poorly formatted.");
	}
	else if(attribute1 !== undefined && attribute2 !== undefined) {
		let id = req.params.fridgeID; 
		let result = fridge.updateFridge(id, req.body);

		if(result === undefined){ 
			res.status(404).send("The fridge id does not exist");
		}
		else{ 
			res.status(200).set("Content-Type", "application/json").json(result);
		}
	}
	else{
		res.status(500).send();
	}
});

router.post("/fridges/:fridgeID/items", express.json(), function(req,res,next){
	console.log("Inside the /fridges/:fridgeID/items POST request...");
	let item_id 			= 	req.body.id; 	
	let item_quantity	= 	req.body.quantity;
	
	if(item_id === undefined || item_quantity === undefined){
		console.log("Item ID: "+item_id);
		console.log("Item quantity:"+item_quantity);
		
		res.status(400).send("The fridge item data is poorly formatted.");
	}
	else if(item_id !== undefined && item_quantity !== undefined){
		let result = fridge.createItem(req.params.fridgeID, item_id, item_quantity)
		if(result === undefined){ 
			res.status(409).send("The fridge name is duplicate");
		}
		else{ 
			res.status(200).set("Content-Type", "application/json").json(result);
		}
	}
	else{
		res.status(500).send();
	}
});

router.delete("/fridges/:fridgeID/items/", express.json(), function(req, res, next){
	console.log("Inside the /fridges/:fridgeID/items/ DELETE request...");

	// retrieve query string values
	let query = req.query; // will give us {id1: , id2: id3,....}
	let fridgeid = req.params.fridgeID
	//let itemid = req.params.itemId; // access the category id from the parameterized URL

	console.log("The query string is: " + query);

	// if no query string was provided, then we will delete the entire category
	if(Object.keys(query).length === 0){
		let result = fridge.deleteAllItem(fridgeid);
		console.log(result);

		if(result === undefined){ // category does not exist
			res.status(204).send("The fridge id does not exist.");
		}
		else{ // category successfully deleted
			res.status(200).send("The fridge items was successfully deleted.");
		}
	}
	else{
		let itemIds = Object.keys(query);
		let result = "";

		// iterate over all of the query string elements (i.e., item ids)
		for(let itemId of itemIds){
			result = fridge.deleteItem(fridgeid, itemId); // call the deleteItem function, which returns a an undefined or the category from which the item was deleted

			console.log("fridge Id: " + fridgeid); // debugging statements...
			console.log("item Id: " + itemId); // debugging statements...
			console.log(result); // debugging statements...

			// if the item couldn't be deleted, then break
			if(result === undefined){break;}
		}
		// if any of the items specified in the query string do not exist, then return a 404 error
		if(result === undefined){ // item does not exist
			res.status(204).send("The item id does not exist");
		}
		else{ // items successfully deleted
			// if all of the items specified in the query string were deleted, then return a 200 code
			res.status(200).send("The items were successfully deleted.");
		}
	}
});

router.delete("/fridges/:fridgeID/:itemId", express.json(), function(req, res, next){
	console.log("Inside the /fridges/:fridgeID/:itemId DELETE request...");
	let catId = req.params.fridgeID; // access the category id from the parameterized URL
	let itemId = req.params.itemId;
	let result = fridge.deleteItem(catId, itemId);

	if(result === undefined){ // category or item does not exist
		res.status(204).send("The fridge id or item id does not exist");
	}
	else if(result !== undefined){ // category is successfully deleted
		res.status(200).send("The item was successfully deleted.");
	}
	else{
		res.status(500).send();
	}
});

module.exports = router;
