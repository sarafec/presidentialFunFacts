//create global value for all data -- is there a better way?
//currently used as a reference for search functionality
let allPresData;

//load data
function getData(){
	$.getJSON('presidents.json', function(data) {
		allPresData = data;
		createPresIcon(data);
	});
}

//loops through data send to createPresElem function
function createPresIcon(data){
	for(let i = 0; i < data.length; i++){
		createPresIconElem(data, i);
	}
}

//creates president icons
function createPresIconElem(data, i){
	let containerElement = document.querySelector(".row");
	let presidentCard = document.createElement("div");
	presidentCard.classList.add("card");
	presidentCard.setAttribute("tabindex", "1");
	presidentCard.style.width = "15rem";
	containerElement.appendChild(presidentCard);

	//append president's image to card div
	let presidentImage = document.createElement("img");
	presidentImage.classList.add("card-img-top");
	presidentImage.setAttribute("src", data[i].image);
	presidentImage.setAttribute("alt", "image of a president");
	presidentCard.appendChild(presidentImage);

	//append president's description div to card div
	let presidentDescription = document.createElement("div");
	presidentDescription.classList.add("card-block");
	presidentCard.appendChild(presidentDescription);

	//append president's name to the president description area div
	let presidentName = document.createElement("h4");
	presidentName.classList.add("card-title");
	presidentName.textContent = data[i].name;
	presidentDescription.appendChild(presidentName);

	//append president's title to the president description area div
	let presidentTitle = document.createElement("p");
	presidentTitle.classList.add("card-text");
	presidentTitle.textContent = data[i].title;
	presidentDescription.appendChild(presidentTitle);

	//append fun fact area div to the president description area div
	let funFactArea = document.createElement("div");
	funFactArea.classList.add("fun-fact");
	presidentDescription.appendChild(funFactArea);

	//append fun fact text to the fun fact area
	let funFactText = document.createElement("p");
	funFactText.textContent = data[i].fact;
	funFactArea.appendChild(funFactText);

	//append break element in the fun fact area
	let funFactTextBreak = document.createElement("br");
	funFactArea.appendChild(funFactTextBreak);

	//append source information in the funfact area
	let funFactSource = document.createElement("a");
	funFactSource.classList.add("card-link");
	funFactSource.setAttribute("target", "_blank");
	funFactSource.setAttribute("href", data[i].factSourceURL);
	funFactSource.textContent = "Source: " + data[i].factSourceName;
	funFactArea.appendChild(funFactSource);

	//append unordered list area to presidential card div
	yearsInOfficeArea = document.createElement("ul");
	yearsInOfficeArea.classList.add("list-group");
	presidentCard.appendChild(yearsInOfficeArea);

	//append list item to the unordered list area
	yearsInOfficeText = document.createElement("li");
	yearsInOfficeText.classList.add("list-group-item");
	yearsInOfficeText.textContent = "In office: " + data[i].yearsServed;
	yearsInOfficeArea.appendChild(yearsInOfficeText);
}


window.setTimeout(function(){
	let inputField = document.getElementById("search");

	//return fuzzy search function on enter
	inputField.addEventListener("keyup", function(e) {
		if (e.which === 13) {
			return checkSearch(e.target);
		}
	});

}, 500);

function checkSearch(evt){
	if (evt.value === "") {
		return loadAllIcons();
	} else {
		return searchIcons(evt.value);
	}
}

//if empty search, load all icons
function loadAllIcons(){
	let containerElem = document.querySelector(".row");

	while(containerElem.hasChildNodes()){
		containerElem.removeChild(containerElem.lastChild);
	}

	createPresIcon(allPresData);
}

//compare most unique name given, based on user input 
function searchIcons(value){
	let valueArr = value.split(" ");

	if(valueArr.length === 1){
		compareNames(valueArr[0], 0);
	} else if(valueArr.length === 2){
		compareNames(valueArr[1], 1);
	} else if(valueArr.length === 3){
		compareNames(valueArr[2], 2);
	} else if(valueArr.length === 4){
		compareNames(valueArr[3], 3)
	}
}

function compareNames(name, index){
	let nameArr = [];
	let filteredPresArr = filterPresData(index);

	for(let i = 0; i < filteredPresArr.length; i++){
		let entryArr = [];
		if(filteredPresArr[i] === undefined){
			entryArr.push("");
			entryArr.push(0);
			entryArr.push(i);
		} else {
			entryArr.push(filteredPresArr[i]);
			entryArr.push(findNameIntersection(name,  filteredPresArr[i]));
			entryArr.push(i);
		}
		nameArr.push(entryArr);
	}

	evaluateSearch(nameArr);
}

function findNameIntersection(name, nameFromArray){
	//set all letters to lower case
	let lowName = name.toLowerCase();
	let lowNameFromArray = nameFromArray.toLowerCase();

	//create sets
	let nameSet = new Set(lowName);
	let nameFromArraySet = new Set(lowNameFromArray);

	//find union
	let union = new Set([...nameSet, ...nameFromArraySet]);
	let unionArr = Array.from(union);

	//find intersection
	let intersection = new Set([...nameSet].filter(x => nameFromArraySet.has(x)));
	let intersectionArr = Array.from(intersection);

	//helper values
	let intersectionLength = intersectionArr.length;
	let unionLength = unionArr.length;

	//find value
	let intersectionVal = intersectionLength/unionLength;

	return intersectionVal;

}

function filterPresData(index){
	let newPresData = allPresData.map(function(elem){
		return elem.name.split(" ");
	});

	let newPresDataByName = newPresData.map(function(elem){
		return elem[index];
	})

	return newPresDataByName;

}


function evaluateSearch(nameArr){
	let filteredArr = [];

	//sort - by value
	let sortedNameArr = nameArr.sort(function(a, b){
		return b[1] - a[1];
	})

	//filter - all values below .8
	let filterSortArr = sortedNameArr.filter(function(elem){
		if(elem[1] >= .8){
			return elem;
		}
	})

	//map - to delete value and name from array
	let filterIndexArr = filterSortArr.map(function(elem){
		return elem[2];
	})

	// for loop - to push the allPresData indexes still in nameArr
	for(let i = 0; i < filterIndexArr.length; i++){
		filteredArr.push(allPresData[filterIndexArr[i]]);
	}

	resetIcons(filteredArr);

}

//delete all current icons
//reload with filtered data
function resetIcons(data){
	let containerElem = document.querySelector(".row");

	while(containerElem.hasChildNodes()){
		containerElem.removeChild(containerElem.lastChild);
	}

	return createPresIcon(data)

}

//load app data and init app functions
getData();