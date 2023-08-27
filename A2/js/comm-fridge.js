var fridgeItem;

window.onload = function(){
	retrieveFridgeData();
	
	
	let findButton = document.querySelector("#submit_btn");
	
	
	findButton.addEventListener("click", processform);


	let pageId = document.getElementsByTagName("body")[0].id;
	if(pageId != null && pageId == "view_items"){
		displayFridges(pageId);
	}
}

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
	document.getElementById("meter").innerHTML = "<span style='width: " + (fridges[fridgeID].capacity + 14.2)  + "%'>" + fridges[fridgeID].capacity + "%</span>";

	populateLeftMenu(fridgeID);

  let mdElements = "";
	for(const[key, value] of Object.entries(fridges[fridgeID].items)){
		mdElements += "<div id='item-" + key + "' class='item " + value.type + "'>";
		mdElements += "<img src='" + value.img + "' width='100px' height='100px'; />";
		mdElements += "<div id='item_details'>";
		mdElements += "<p>" + value.name + "</p>";
		mdElements += "<p>Quantity: <span id='qt-" + key + "'>" + value.quantity + "</span></p>";
		mdElements += "<p>Pickup item:</p>";
		mdElements += "</div></div>";
	}
	document.getElementById("middle-column").innerHTML = mdElements;
	document.getElementById("fridges").classList.add("hidden");
	document.getElementById("fridge_details").classList.remove("hidden");
}

function populateLeftMenu(fridgeID){
	let categories = {};

	for(const[key, value] of Object.entries(fridges[fridgeID].items)){
		let type = value.type;
		if(type in categories == false){
			categories[type] = 1;
		}
		else {
			categories[type]++;
		}
	}

	let leftMenu = document.getElementById("categories");
	for (const[key, value] of Object.entries(categories)){
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

function retrieveFridgeData(){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = processFridgeData;
	xhttp.open("GET", 'http://localhost:8000/js/comm-fridge-items.json', true);
	xhttp.send();
}

function processFridgeData(){
	if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200){
	  let data = xhttp.responseText;
	  console.log(data);
  
	  fridgeItem = JSON.parse(data);
	  console.log(Object.keys(fridgeItem));
	  populateItems();
	}
	else{
	  console.log("There was a problem with the request.");
	}
}

function populateItems(){
	let table = document.getElementById("grocery_items");


	for (let item of fridgeItem){
		let fridge_item = item.name;
		let row = document.createElement("option");

		let idCell = document.createElement("input");
		idCell.textContent = fridge_item;
		row.appendChild(idCell);
		console.log(idCell);
		table.appendChild(row);
		
	}
	console.log(table);
}

function enableFind(){
	let input = document.getElementsByTagName("input");

}

function processform(event){
	event.preventDefault();
}
