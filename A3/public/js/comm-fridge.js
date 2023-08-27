onload = function(){
	let pageId = document.getElementsByTagName("body")[0].id;
	if(pageId != null && pageId == "view_items"){
		displayFridges(pageId);
	}
}
var xhttp;
var file = require("fs");
const filePath = "./comm-fridge-data.json";

function readFridge() {
	let filepath = __dirname + "/comm-fridge-data.json";
	if (file.existsSync(filepath)) {
	  let content = file.readFileSync(filepath);
	  let catalog = JSON.parse(content);
	  return catalog;
	 }
   return undefined;
}

function writeFridge(catalogues) {
	let filepath = __dirname + "/comm-fridge-data.json";
	let result = undefined;
	if(file.existsSync(filepath)) {
	  result = file.writeFileSync(filepath, JSON.stringify(catalogues));
	}
   return result;
}

exports.createCategory = function(Name, naccept_items, caccept_items, accepted_types, contactPerson, contactPhone, address, street, postal_code, city, province, country) {
	console.log("Creating a fridge...");
	let fridgeAll = readFridge();
	// check if the fridge is a duplicate
	let catalog = fridgeAll.find(
	  function findFridge(cat) {
		return cat.name === Name;
	  }
	);
	// if the fridge is duplicate, then return undefined, to indicate a duplication error
	if(catalog !== undefined){
	  console.log("The fridge is a duplicate...");
	  return undefined;
	}
	else{
	  // create a new ID for the fridge
	  let newID = "fg-"+(fridgeAll.length+1).toString();
	  let newItem = {
		"id": newID,
		"name": Name, 
		"num_items_accepted":naccept_items,
		"can_accept_items":caccept_items,
		"accepted_types" : accepted_types,
		"contact_person" : contactPerson,
		"contact_phone" : contactPhone,
		"address" : {
			"street" : street,
			"postal_code" : postal_code,
			"city" : city,
			"province" : province,
			"country" : country
		}
	  };
	  fridgeAll.push(newItem);
	  console.log("New fridge created...");
	  let result =  writeFridge(fridgeAll);
	  return newItem;
	}
}

exports.findFridge = function(fridgeid){
	console.log("Returning all items for studID: " +fridgeid);
    let fridgedata = readFridge();
    if(fridgedata !== undefined){
        let fridgeArr = [];
        for(let c in fridgedata){
            let fridgeObj = {};
            if(fridgedata[c].id === fridgeid){
                console.log(fridgedata[c].id);
                fridgeObj["Name"]               = fridgedata[c].name;
                fridgeObj["num_items_accepted"] = fridgedata[c].num_items_accepted;
                fridgeObj["can_accept_items"]	= fridgedata[c].can_accept_items;
				fridgeObj["accepted_types"]		= fridgedata[c].accepted_types;
				fridgeObj["contact_person"]		= fridgedata[c].contact_person;
				fridgeObj["contact_phone"]		= fridgedata[c].contact_phone;
				fridgeObj["address"]			= fridgedata[c].address;
				fridgeObj["items"]				= fridgedata[c].items;
                fridgeArr.push(fridgeObj);
            }
        }
        return fridgeArr;
    }
    return [];
}

exports.updateFridge = function(id, catData) {
	console.log("Updating a category...");
	let allFridges = readFridge();
  
	let fridges = allFridges.find(
	  function findCatalog(cat) {
		  return cat.id === id;
	  }
	);
	// if the category exists, then we'll update it. Otherwise, will return an error.
	if(fridges !== undefined) {
		fridges.accepted_types[0] = catData.attribute1;
		fridges.accepted_types[1] = catData.attribute1;
  
	  let result = writeFridge(allFridges); // write the updates to a file
	  return fridges; // return the updated information
	}
	return undefined;
}

exports.createItem = function(id, itemId, itemQuantity) {
	console.log("Creating a fridge...");
	let allFridges = readFridge();
	// check if the category is a duplicate
	let fridge = allFridges.find(
	  function findFridge(cat) {
		return cat.id === id;
	  }
	);
	if(fridge !== undefined){
	  console.log("The fridge is a duplicate...");
	  return undefined;
	}
	else{
	  let newItem = {
		"id" : itemId,
		"quantity" : itemQuantity
	  };
	  allFridges.id.items.push(newItem);
	  console.log("New fridge created...");
	  let result =  writeFridge(allFridges.id.items);
	  return newItem;
	}
}

exports.deleteItem = function(fridgeid, itemid) {
	console.log("Deleting item with id: " + itemid);
	let catalogues = readFridge();
  
	let category = catalogues.find(
	  function findCategory(cat) {
		  return cat.id === fridgeid;
	  }
	);
  
	let item = category.items.find(
	  function findItem(anItem) {
		  return anItem.id === itemid;
	  }
	);
	if(category !== undefined && item !== undefined){
	  // remove the item
	  let items = category.items;
		  let itemIndex = items.indexOf(item);
  
	  if (itemIndex !== -1) {
			  items.splice(itemIndex, 1);
		  }
		  console.log(items);
	  category.items = items;
  
	  let result = writeFridge(catalogues);
	  return category;
	}
	return undefined;
}


exports.deleteAllItem = function(fridgeid) {
	console.log("Deleting category with id: " + categoryId);
	let catalogues = readFridge();
	let category = catalogues.find(
		function findCategory(cat) {
			return cat.id === fridgeid;
		}
	);
  
	if(category !== undefined){
	  let categories = catalogues;
  
		  let catIndex = categories.indexOf(category);
  
	  if (catIndex !== -1) {
			  categories.splice(catIndex, 1);
		  }
		  console.log(categories);
	  catalogues = categories;
  
	  let result = writeFridge(catalogues);
	  return catalogues;
	}
	return undefined;
}

// function processSelection(event){
// 	let productID = document.getElementById("grocery_items").value;
// 	let URL = "https://world.openfoodfacts.org/api/v0/product/" + productID + ".json";
// 	requestData(URL); // retrieve the JSON data from the URL
// }

// function requestData(URL){
// 	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
// 	xhttp.onreadystatechange = displayFridges; // specify what should happen when the server sends a response
//   xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
//   xhttp.send(); // send the request to the server
// }


function displayFridges(pageId){
	let fridgesSection = document.getElementById("fridges");
	let header = document.createElement("h1");
	header.textContent = "Available fridges";
	fridgesSection.appendChild(header);

	for(let i = 0; i < fridges.length; i++){
		let fridgeData = document.createElement("div");
		fridgeData.id = "fridge_" + i;

		let fridgeContent = "<img src='images/fridge.svg'></span>";
		fridgeContent += "<span><strong>" + fridges[i].name + "</strong></span>";
		fridgeContent	+= "<span>" + fridges[i].address.street + "</span>";
		fridgeContent += "<span>" + fridges[i].contact_phone + "</span>"

		fridgeData.innerHTML = fridgeContent;
		fridgeData.addEventListener("click", function(event){
			let fridgeID = event.currentTarget.id.split("_")[1];
			displayFridgeContents(parseInt(fridgeID));
		});

		fridgesSection.appendChild(fridgeData);
	}
}

function displayFridgeContents(fridgeID){
	document.getElementById("frigeHeading").innerHTML = "Items in the " + fridges[fridgeID].name;
	let bioInformation = "<span id='fridge_name'>" + fridges[fridgeID].name + "</span><br />" + fridges[fridgeID].address.street + "<br />" + fridges[fridgeID].contact_phone;

	document.getElementById("left-column").firstElementChild.innerHTML = bioInformation;
	let capacity = ((fridges[fridgeID].items.length) / (parseInt(fridges[fridgeID].can_accept_items)));
	capacity = Math.round(capacity * 100);

	document.getElementById("meter").innerHTML = "<span style='width: " + (capacity + 14.2)  + "%'>" + capacity + "%</span>";

	populateLeftMenu(fridgeID);

  let middleColumn = document.getElementById("middle-column");
	console.log(fridgeID);

	for(let element of fridges[fridgeID].items){
		let itemID = parseInt(element.id);
		let item = items[itemID];

		let mdItem = document.createElement("div");
		mdItem.className = "item " + item.type;
		mdItem.id = "item-" + itemID;
		mdItem.innerHTML = "<img src='" + item.img + "' width='100px' height='100px'; />";

		let itemDetails = document.createElement("div");
		itemDetails.id = "item_details";
		itemDetails.innerHTML = "<p id='nm-" + itemID + "'>" + item.name + "</p><p>Quantity: <span id='qt-" + itemID + "'>" + element.quantity + "</span></p><p>Pickup item:</p>";

		let buttonsArea = document.createElement("div");
		buttonsArea.className = "pick_button";
		buttonsArea.id = "pickbtn-" + itemID;

		let increaseButton = document.createElement("button");
		increaseButton.className = "button-plus";
		increaseButton.innerHTML = "<i class='fas fa-plus'></i>";
		increaseButton.addEventListener("click", processIncrease);

		let decreaseButton = document.createElement("button");
		decreaseButton.className = "button-minus";
		decreaseButton.innerHTML = "<i class='fas fa-minus'></i>";
		decreaseButton.addEventListener("click", processDecrease);

		let amount = document.createElement("span");
		amount.className = "amount";
		amount.id = "amount-" + itemID;
		amount.textContent = "0";

		buttonsArea.appendChild(increaseButton);
		buttonsArea.appendChild(amount);
		buttonsArea.appendChild(decreaseButton);

		itemDetails.appendChild(buttonsArea);
		mdItem.appendChild(itemDetails);
		middleColumn.appendChild(mdItem);
	}
	document.getElementById("fridges").classList.add("hidden");
	document.getElementById("fridge_details").classList.remove("hidden");
}

function processIncrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];
	let amount = parseInt(document.getElementById("amount-"+numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let name = document.getElementById("nm-" + numID).textContent;

	let elementExists = document.getElementById("pk-item-" + numID);

	if(amount < quantity){
		document.getElementById("amount-"+numID).innerHTML = amount + 1;

		if(elementExists == null){
			let li = document.createElement("li");
			li.setAttribute("id", "pk-item-" + numID);
			li.innerHTML = "<span>" + (amount+1) + "</span> x " + name;
			document.getElementById("items_picked").appendChild(li);
		}
		else {
			document.getElementById("pk-item-"+numID).innerHTML = "<span>" + (amount+ 1) + "</span> x " + name;
		}
	}
}
function processDecrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];

	let amount = parseInt(document.getElementById("amount-"+numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let elementExists = document.getElementById("pk-item-" + numID);
	let name = document.getElementById("nm-" + numID).textContent;

	if(amount > 0){
		document.getElementById("amount-" + numID).innerHTML = parseInt(amount) - 1;
		if(elementExists == null){
				let li = document.createElement("li");
				li.setAttribute("id", "pk-item-" + numID);
				li.innerHTML = "<span>" + parseInt(amount) - 1 + "</span> x " + name;
				document.getElementById("items_picked").appendChild(li);
		}
		else{
			if(amount == 1){
				let item = document.getElementById("pk-item-"+numID);
				console.log("item-"+numID)
				item.remove();
			}
			else{
					document.getElementById("pk-item-"+numID).innerHTML = "<span>" + (amount- 1) + "</span> x " + name;
			}
		}
	}
}

function populateLeftMenu(fridgeID){
	let categories = {};

	for(let element of fridges[fridgeID].items){
		//console.log(element);
		let itemID = parseInt(element.id);
		let item = items[itemID];

		let type = item.type;
		if(type in categories == false){
			categories[type] = 1;
		}
		else {
			categories[type]++;
		}
	}

	let leftMenu = document.getElementById("categories");
	for(const[key, value] of Object.entries(categories)){
		let label = key.charAt(0).toUpperCase() + key.slice(1);
		let listItem = document.createElement("li");
		listItem.id = key;
		listItem.className = "category";
		listItem.textContent = label + " (" + value  + ")";

		listItem.addEventListener("click", filterMiddleView);
		leftMenu.appendChild(listItem);
	}
}

function filterMiddleView(event){
	let elements = document.getElementById("middle-column").children;
	let category = event.target.id;

	for(let i = 0; i < elements.length; i++){
		let item = elements[i];
		if(!item.classList.contains(category)){
			item.classList.add("hidden");
		}
		else{
			item.classList.remove("hidden");
		}
	}
}


//module.exports = displayFridges;


// {
// 	//initialize,
// 	displayFridges,
// 	displayFridgeContents,
// 	processIncrease,
// 	processDecrease,
// 	populateLeftMenu,
// 	filterMiddleView,
// }