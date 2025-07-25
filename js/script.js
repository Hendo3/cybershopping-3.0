
function salvarNoCarrinho(itemId, category, itemObj) {
	const cart = JSON.parse(localStorage.getItem("cyber_cart") || "[]");

	let itemPrice = itemObj.price;
	itemObj.price = parseFloat(itemObj.price);
	if (isNaN(itemPrice)) {
		return;
	}
	itemPrice = parseFloat(itemPrice);
	if (isNaN(itemPrice)) {
		return;
	}

	cart.push({ id: itemId, category, ...itemObj });
	localStorage.setItem("cyber_cart", JSON.stringify(cart));
}

async function carregarCategorys(jsonPath) {
	const res = await fetch(jsonPath);
	const json = await res.json();
	const data = json.data;
	const categoryList = document.getElementById("category-list");
	categoryList.innerHTML = ""; // Clear previous categories

	for (const category in data) {
		const div = document.createElement("div");
		div.className = "category";
		div.innerHTML = `<button class="btn-add" data-cat="${category}">${category}</button>`;
		div.querySelector("button").addEventListener("click", () => carregarItens(data, category));
		categoryList.appendChild(div);
	}
}
	

function carregarItens(data, category) {
	const section = document.getElementById("items-section");
	const listEl = document.getElementById("items-list");
	document.getElementById("items-title").textContent = category;
	listEl.innerHTML = ""; // Clear previous items

	if (section.style.display === "none" &&
		document.getElementById("category-section").style.display !== "none") {
		
		document.getElementById("category-section").toggleAttribute("style", true);
		document.getElementById("category-section").style.display = "none";
		section.toggleAttribute("style", false);
	}

	const itens = data[category].itens || data[category].items;

	for (const [id, item] of Object.entries(itens)) {
		const div = document.createElement("div");
		div.className = "item";

		div.innerHTML = `
			<h3>${item.name}</h3>
			<p class="desc">${item.description}</p>
			<p class="meta">Cir: ${item.surg}</p>
			<p class="meta">HL: ${item.HL}</p>
			<button class="btn-add" data-id="${id}">Buy <br> ${item.price}ED$</button>
		`;

		div.querySelector(".btn-add").addEventListener("click", () => {
		salvarNoCarrinho(id, category, item);
		});

		listEl.appendChild(div);
	}


}

function carregarItensPorCategoria(category) {
	const section = document.getElementById("items-section");
	const listEl = document.getElementById("items-list");
	document.getElementById("items-title").textContent = category;
	listEl.innerHTML = ""; // Clear previous items
	
	if (section.style.display === "none" &&
		document.getElementById("category-section").style.display !== "none") {
		document.getElementById("category-section").toggleAttribute("style", true);
		document.getElementById("category-section").style.display = "none";
		section.toggleAttribute("style", false);
	}
	
	fetch("../data/cyberwares.json")
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			const itens = data.data[category].itens || data.data[category].items;
			for (const [id, item] of Object.entries(itens)) {
				const div = document.createElement("div");
				div.className = "item";

				div.innerHTML = `
				<div class="info">
					<h3>${item.name}</h3>
					<p class="desc">${item.description}</p>
					<p class="meta">Cir: ${item.surg} <br> HL: ${item.HL}</p>
		
				</div>
				<button class="btn-add" data-id="${id}">Buy <br> ${item.price}ED$</button>
				`;

				div.querySelector(".btn-add").addEventListener("click", () => {
					salvarNoCarrinho(id, category, item);
				});

				listEl.appendChild(div);
			}
		})
		.catch(error => console.error("Error loading items:", error));
}


function loaderItems (jsonPath) {
	fetch(jsonPath)
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			const categoryList = document.getElementById("category-list");
			categoryList.innerHTML = ""; // Clear previous categories

			for (const [category, info] of Object.entries(data.data)) {
				const div = document.createElement("div");
				const button = document.createElement("button");
				div.className = "category";
				button.className = "btn-add";
				button.setAttribute("data-cat", category);
				button.textContent = category;
				div.appendChild(button);
				
				button.addEventListener("click", () => {
					carregarItensPorCategoria(category);
				});
				categoryList.appendChild(div);
			}
		})
		.catch(error => console.error("Error loading items:", error));
}

function toggleSectionVisibility(sectionId, isVisible) {
	const section = document.getElementById(sectionId);
	if (isVisible) {
		section.style.display = "";
	} else {
		section.style.display = "none";
	}
}


document.addEventListener("DOMContentLoaded", () => {
	// Initialize the items section to be hidden
	document.getElementById("items-section").style.display = "none";
	
	// Load categories
	// Use the correct path to the JSON file
	if (window.location.pathname.includes("html/accessories.html")) {
		loaderItems("../data/accessories.json");
	} else if (window.location.pathname.includes("html/cyberwares.html")) {
		loaderItems("../data/cyberwares.json");
	}
	
	if (document.getElementById("items-section").style.display === "none" &&
		document.getElementById("category-section").style.display !== "none") {
		toggleSectionVisibility("category-section", true);
		toggleSectionVisibility("items-section", false);
	} else {
		toggleSectionVisibility("category-section", false);
		toggleSectionVisibility("items-section", true);
	}

	document.getElementById("apply-filter").addEventListener("click", () => {
		const category = document.getElementById("category-filter").value;
		const maxPrice = parseFloat(document.getElementById("max-price").value);
		const minPrice = parseFloat(document.getElementById("min-price").value);
		const hlMin = parseFloat(document.getElementById("hl-filter").value);
		const hlMax = parseFloat(document.getElementById("hl-filter").value);
		const cir = document.getElementById("cir-filter").value;
		const cyberwareList = document.getElementById("items-list");
		cyberwareList.innerHTML = ""; // Clear previous items
	
		const filteredItems = items.filter(item => {
			fetch("../data/cyberwares.json")
				.then(response => response.json())
				.then(data => {
					const items = data.data[category].items;
					return items.filter(item => {
						return (!category || item.category === category) &&
							(!maxPrice || item.price <= maxPrice) &&
							(!minPrice || item.price >= minPrice) &&
							(!hlMin || item.HL >= hlMin) &&
							(!hlMax || item.HL <= hlMax) &&
							(!cir || item.surg === cir);
					});
				})
				.catch(error => console.error("Error loading items:", error));
		});

		filteredItems.forEach(item => {
			const div = document.createElement("div");
			div.className = "item";

			div.innerHTML = `
				<h3>${item.name}</h3>
				<p class="desc">${item.description}</p>
				<p class="meta">Cir: ${item.surg} <br> HL: ${item.HL}</p>
				<button class="btn-add" data-id="${item.id}">Buy <br> ${item.price}ED$</button>
			`;

		});
		filteredItems.forEach(item => {
			const button = div.querySelector(".btn-add");
			button.addEventListener("click", () => {
				salvarNoCarrinho(item.id, item.category, item);
			});
			cyberwareList.appendChild(div);
		});
	})
});

