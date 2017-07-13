//load president icons
let presidentFactApp = (function() {
	//empty array to be filled by getJSON method
	let presidentData = [];
	//represents index of presidentData to be shared with createPresidentElement()
	let i = -1;

	//load JSON file using jQuery's .getJSON method
	$.getJSON('presidents.json', function(data) {
		presidentData = data;

		//execute one presidential element per item in array
		presidentData.forEach(function() {
			i++;	
			return createPresidentElement();
		});
	});

	//create president element cards
	let createPresidentElement = function() {
		//append card div to container div
		let containerElement = document.querySelector(".row");
		let presidentCard = document.createElement("div");
		presidentCard.classList.add("card");
		presidentCard.setAttribute("tabindex", "1");
		presidentCard.style.width = "15rem";
		containerElement.appendChild(presidentCard);

		//append president's image to card div
		let presidentImage = document.createElement("img");
		presidentImage.classList.add("card-img-top");
		presidentImage.setAttribute("src", presidentData[i].image);
		presidentImage.setAttribute("alt", "image of a president");
		presidentCard.appendChild(presidentImage);

		//append president's description div to card div
		let presidentDescription = document.createElement("div");
		presidentDescription.classList.add("card-block");
		presidentCard.appendChild(presidentDescription);

		//append president's name to the president description area div
		let presidentName = document.createElement("h4");
		presidentName.classList.add("card-title");
		presidentName.textContent = presidentData[i].name;
		presidentDescription.appendChild(presidentName);

		//append president's title to the president description area div
		let presidentTitle = document.createElement("p");
		presidentTitle.classList.add("card-text");
		presidentTitle.textContent = presidentData[i].title;
		presidentDescription.appendChild(presidentTitle);

		//append fun fact area div to the president description area div
		let funFactArea = document.createElement("div");
		funFactArea.classList.add("fun-fact");
		presidentDescription.appendChild(funFactArea);

		//append fun fact text to the fun fact area
		let funFactText = document.createElement("p");
		funFactText.textContent = presidentData[i].fact;
		funFactArea.appendChild(funFactText);

		//append break element in the fun fact area
		let funFactTextBreak = document.createElement("br");
		funFactArea.appendChild(funFactTextBreak);

		//append source information in the funfact area
		let funFactSource = document.createElement("a");
		funFactSource.classList.add("card-link");
		funFactSource.setAttribute("target", "_blank");
		funFactSource.setAttribute("href", presidentData[i].factSourceURL);
		funFactSource.textContent = "Source: " + presidentData[i].factSourceName;
		funFactArea.appendChild(funFactSource);

		//append unordered list area to presidential card div
		yearsInOfficeArea = document.createElement("ul");
		yearsInOfficeArea.classList.add("list-group");
		presidentCard.appendChild(yearsInOfficeArea);

		//append list item to the unordered list area
		yearsInOfficeText = document.createElement("li");
		yearsInOfficeText.classList.add("list-group-item");
		yearsInOfficeText.textContent = "In office: " + presidentData[i].yearsServed;
		yearsInOfficeArea.appendChild(yearsInOfficeText);
	};
}());

//search functionality
window.setTimeout(function(){
	let inputField = document.getElementById("search");

	//return fuzzy search function on enter
	inputField.addEventListener("keyup", function(e) {
		if (e.which === 13) {
			return searchCards();
		}
	});

	let searchCards = function() {
		//manipulate input text into a character array
		let lowerSearchText = inputField.value.toLowerCase();
		let charSearchText = lowerSearchText.split('');

		randomPresidentNames = document.querySelectorAll(".card-title");
			randomPresidentNames.forEach(function(title) {
				let presidentName = title;
				let presidentNameString = title.textContent;

				//manipulate president names into character arrays - to be compared
				let lowerPresidentNameString = presidentNameString.toLowerCase();
				let lowerPresidentNameChar = lowerPresidentNameString.split('');

				//perform intersection on input and presidents names - creating a new array
				let inputData = new Set(charSearchText);
				let listData = new Set(lowerPresidentNameChar);
				let intersection = new Set([...inputData].filter(x => listData.has(x)));
				let intersectionArr = Array.from(intersection);

				//perform union on input and president names - creating a new array
				let union = new Set([...inputData, ...listData]);
				let unionArr = Array.from(union);

				//calculate the difference between the union and intersection
				let intersectionArrLength = intersectionArr.length;
				let unionArrLength = unionArr.length;
				let calculateStringApproximation = (function() {
					let result = intersectionArrLength/unionArrLength;

					//identify the parent div of the card
					let selectedCard = presidentName.parentNode.parentNode;
					//if the result is less than .7 change card to display none
					selectedCard.classList.toggle("inactive", result <= .7);
				}());
			});
	};
}, 500);