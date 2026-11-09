const drinks = [
    { name: "Espresso", size: 30, price: 900, type: "hot" },
    { name: "Americano", size: 250, price: 1200, type: "hot" },
    { name: "Cappuccino", size: 300, price: 1500, type: "hot" },
    { name: "Latte", size: 350, price: 1600, type: "hot" },
    { name: "Iced Latte", size: 400, price: 1800, type: "iced" }
];
const order = [];
const searchInput = document.getElementById("drink-search");
const typeSelect = document.getElementById("drink-type");
const sortSelect = document.getElementById("drink-sort");
const drinkRows = document.getElementById("drink-rows");
const orderList = document.getElementById("order-items");
const orderStatus = document.getElementById("order-status");

function formatPrice(amount) {
    return amount.toLocaleString("ru-RU") + " ₸";
}

function renderMenu() {
    const search = searchInput.value.trim().toLowerCase();
    drinkRows.replaceChildren();
    let shown = 0;

    const sortedDrinks = drinks.slice();
    if (sortSelect.value === "price") {
        sortedDrinks.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "name") {
        sortedDrinks.sort((a, b) => a.name.localeCompare(b.name));
    }

    for (const drink of sortedDrinks) {
        const matchesName = drink.name.toLowerCase().includes(search);
        const matchesType = typeSelect.value === "all" || typeSelect.value === drink.type;
        if (matchesName && matchesType) {
            const row = drinkRows.insertRow();
            row.insertCell().textContent = drink.name;
            row.insertCell().textContent = drink.size + " ml";
            row.insertCell().textContent = formatPrice(drink.price);

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "btn btn-sm btn-outline-dark";
            addButton.textContent = "Add";
            addButton.setAttribute("aria-label", "Add " + drink.name + " to estimate");
            addButton.addEventListener("click", function () {
                changeQuantity(drink, 1);
            });
            row.insertCell().append(addButton);
            shown++;
        }
    }

    const status = document.getElementById("menu-status");
    status.textContent = "Showing " + shown + " of " + drinks.length + " drinks.";
    if (shown === 0) {
        status.textContent = "No matching drinks. Try another name or choose All drinks.";
    }
}

function changeQuantity(drink, amount) {
    let item = order.find(function (entry) {
        return entry.drink === drink;
    });
    if (!item) {
        item = { drink: drink, quantity: 0 };
        order.push(item);
    }

    item.quantity += amount;
    if (item.quantity === 0) {
        order.splice(order.indexOf(item), 1);
    }
    renderOrder();
    orderStatus.textContent = drink.name + " in your estimate: " + item.quantity + ".";
    if (order.length === 0) {
        orderStatus.textContent = "Your estimate is empty. Add a drink to start again.";
    }
}

function quantityButton(item, amount) {
    const button = document.createElement("button");
    const action = amount === 1 ? "Add" : "Remove";
    button.type = "button";
    button.id = action + "-" + item.drink.name.replaceAll(" ", "-");
    button.className = "btn btn-sm btn-outline-dark";
    button.textContent = amount === 1 ? "+" : "−";
    button.setAttribute("aria-label", action + " one " + item.drink.name);
    button.addEventListener("click", function () {
        changeQuantity(item.drink, amount);
        const next = document.getElementById(button.id) || orderList.querySelector("button");
        (next || document.getElementById("estimate-heading")).focus();
    });
    return button;
}

function renderOrder() {
    let total = 0;
    orderList.replaceChildren();
    order.forEach(function (item) {
        const subtotal = item.quantity * item.drink.price;
        total += subtotal;

        const line = document.createElement("li");
        line.className = "d-flex align-items-center gap-2 pb-3";
        const summary = document.createElement("span");
        summary.className = "me-auto";
        summary.textContent = item.drink.name + " × " + item.quantity + " · " + formatPrice(subtotal);
        line.append(summary, quantityButton(item, -1), quantityButton(item, 1));
        orderList.append(line);
    });
    document.getElementById("order-total").textContent = formatPrice(total);
}

searchInput.addEventListener("input", renderMenu);
typeSelect.addEventListener("change", renderMenu);
sortSelect.addEventListener("change", renderMenu);
renderMenu();