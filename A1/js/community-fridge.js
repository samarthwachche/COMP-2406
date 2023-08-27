let order = {};

function init(){
	document.getElementById("list").innerHTML = genButton();
	//handleButton();
}

function handleButton(event){
	for (let i = 0; i < fridges.length; i++){
		if (event == i){
			console.log(fridges[i].name);
			document.getElementById("list").style.display = "none";
			document.getElementById("h1").style.display = "none";
			//document.getElementById("main").style.display = "block";
			
			document.getElementById("left").innerHTML = getCategoryHTML(event);
			document.getElementById("middle").innerHTML = getMenuHTML(event);
			document.getElementById("right").innerHTML = getCol3HTML(event);
			//document.getElementById("main").style.display = "block";
			//updateOrder();
		}
	}
}

function genButton(){
	let result ="" ;
	Object.keys(fridges).forEach(elem =>{
		result += `<button id="${elem}" onclick="handleButton(${elem})"><img src="../images/fridge.svg" height ="120" width="120"/> <br> ${fridges[elem].name} <br> ${fridges[elem].address.street} <br> ${fridges[elem].contact_phone}</button>`
		console.log(elem);
	});
	result += "";
	return result;
}

function getCategoryHTML(rest){
	let menu = fridges[rest];
	let result = "<b><b><br>";

	result += `<h3>${menu.name}</h3>`;
	result += `<p>${menu.address.street} <br> ${menu.contact_phone}</p>`;
	result += `<a href="#">produce(6)</a> <br><br> <a href="#">Dairy(3)</a> <br><br> <a href="#">bakery(0)</a> <br><br> <a href="#">Frozen(0)</a> <br><br> <a href="#">pantry(2)</a>`;
	return result;
}

function getMenuHTML(rest){
	let menu = fridges[rest].items;
	let result = "";

	Object.values(menu).forEach(key =>{
		result += `<p><img id ="item" src="../${key.img}" height ="80" width="80" style="float:left"/></p>`;
		result += `<p>&nbsp&nbsp&nbsp${key.name} <br> &nbsp&nbsp Quantity:${key.quantity} <br> &nbsp&nbsp Pickup item: &nbsp&nbsp 
					<img src="../images/add.png" style='height:20px;vertical-align:bottom;' onclick='addItem(${key})'/>  
					<img src="../images/remove.png" style='height:20px;vertical-align:bottom;' onclick='removeItem(${key})'/><br><br><hr></p>`;
		//console.log(menu[key]);
		//console.log(key.name);
	});
	return result;
	
}

function getCol3HTML(rest){
	let result = "";
	result += `<p>You have picked the following items</p>`;
	return result;
}

function addItem(id){
	if(order.hasOwnProperty(id)){
		order[id] += 1;
	}else{
		order[id] = 1;
	}
	updateOrder();
}

function removeItem(id){
	if(order.hasOwnProperty(id)){
		order[id] -= 1;
		if(order[id] <= 0){
			delete order[id];
		}
		updateOrder();
	}
}

function updateOrder(){
	let result = "";

	Object.keys(order).forEach(id=>{
		let item = getItembyId(id);
		result += `<p>${item.name} x ${order[id]}</p>`;
	})
	document.getElementById("right").innerHTML = result;

}

function getItembyId(id){
	let categories = Object.keys(fridges[id].items);
	for(let i = 0; i < categories.length; i++){
		if(fridges[id].items[categories[i]].hasOwnProperty(id)){
			return fridges[id].items[categories[i]][id];
		}	
	}
	return null;
}