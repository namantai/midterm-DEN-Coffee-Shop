"use strict";

class Drink {
    constructor(name, size, price, type) {
        this.name = name;
        this.size = size;
        this.price = price;
        this.type = type;
    }

    getPriceLabel() {
        return this.price.toLocaleString("ru-RU") + " ₸";
    }
}

const drinks = [
    new Drink("Espresso", 30, 900, "hot"),
    new Drink("Americano", 250, 1200, "hot"),
    new Drink("Cappuccino", 300, 1500, "hot"),
    new Drink("Latte", 350, 1600, "hot"),
    new Drink("Iced Latte", 400, 1800, "iced")
];

const CART_KEY = "denCoffeeEstimate.v1";
const NOTES_KEY = "denCoffeeNotes.v1";
const THEME_KEY = "denCoffeeTheme.v1";
const searchInput = document.getElementById("drink-search");
const typeSelect = document.getElementById("drink-type");
const sortSelect = document.getElementById("drink-sort");
const drinkRows = document.getElementById("drink-rows");
const orderList = document.getElementById("order-items");
const orderStatus = document.getElementById("order-status");
const noteForm = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
const notesStatus = document.getElementById("notes-status");
const noteId = document.getElementById("note-id");
const noteDrink = document.getElementById("note-drink");
const noteText = document.getElementById("note-text");
const noteSubmit = document.getElementById("note-submit");
const noteCancel = document.getElementById("note-cancel");
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(dark) {
    document.body.classList.toggle("theme-dark", dark);
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.textContent = dark ? "Use light theme" : "Use dark theme";
}

function loadTheme() {
    try {
        return JSON.parse(localStorage.getItem(THEME_KEY)) === "dark";
    } catch (error) {
        console.warn("Saved theme preference could not be read; using the light theme.", error);
        return false;
    }
}

applyTheme(loadTheme());
themeToggle.addEventListener("click", function () {
    const dark = !document.body.classList.contains("theme-dark");
    applyTheme(dark);
    try {
        localStorage.setItem(THEME_KEY, JSON.stringify(dark ? "dark" : "light"));
    } catch (error) {
        console.warn("Theme preference could not be saved in this browser.", error);
    }
});

function readStoredArray(key, validateItem) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(validateItem);
    } catch (error) {
        console.warn("Saved coffee data could not be read; starting fresh.", error);
        return [];
    }
}

function writeStoredArray(key, items) {
    try {
        localStorage.setItem(key, JSON.stringify(items));
        return true;
    } catch (error) {
        console.warn("Coffee data could not be saved in this browser.", error);
        return false;
    }
}

const order = readStoredArray(CART_KEY, function (item) {
    return item && typeof item.name === "string" && Number.isInteger(item.quantity) && item.quantity > 0;
}).map(function (item) {
    const drink = drinks.find(function (entry) { return entry.name === item.name; });
    return drink ? { drink: drink, quantity: item.quantity } : null;
}).filter(Boolean);

function formatPrice(amount) {
    return amount.toLocaleString("ru-RU") + " ₸";
}

function saveOrder() {
    const saved = writeStoredArray(CART_KEY, order.map(function (item) {
        return { name: item.drink.name, quantity: item.quantity };
    }));
    if (!saved) orderStatus.textContent = "Estimate updated, but this browser could not save it.";
}

function renderMenu() {
    const search = searchInput.value.trim().toLowerCase();
    drinkRows.replaceChildren();
    let sortedDrinks = drinks.slice();
    if (sortSelect.value === "price") sortedDrinks.sort((a, b) => b.price - a.price);
    if (sortSelect.value === "name") sortedDrinks.sort((a, b) => a.name.localeCompare(b.name));

    const matches = sortedDrinks.filter(function (drink) {
        return drink.name.toLowerCase().includes(search) && (typeSelect.value === "all" || typeSelect.value === drink.type);
    });
    matches.forEach(function (drink) {
        const row = drinkRows.insertRow();
        row.insertCell().textContent = drink.name;
        row.insertCell().textContent = drink.size + " ml";
        row.insertCell().textContent = drink.getPriceLabel();
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "btn btn-sm btn-outline-dark";
        addButton.textContent = "Add";
        addButton.setAttribute("aria-label", "Add " + drink.name + " to estimate");
        addButton.addEventListener("click", function () { changeQuantity(drink, 1); });
        row.insertCell().append(addButton);
    });

    const status = document.getElementById("menu-status");
    status.textContent = matches.length ? "Showing " + matches.length + " of " + drinks.length + " drinks." : "No matching drinks. Try another name or choose All drinks.";
}

function changeQuantity(drink, amount) {
    let item = order.find(function (entry) { return entry.drink.name === drink.name; });
    if (!item && amount > 0) {
        item = { drink: drink, quantity: 0 };
        order.push(item);
    }
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) order.splice(order.indexOf(item), 1);
    }
    renderOrder();
    saveOrder();
    orderStatus.textContent = item && item.quantity > 0 ? drink.name + " in your estimate: " + item.quantity + "." : "Your estimate is empty. Add a drink to start again.";
}

function quantityButton(item, amount) {
    const button = document.createElement("button");
    const action = amount === 1 ? "Add" : "Remove";
    button.type = "button";
    button.className = "btn btn-sm btn-outline-dark";
    button.textContent = amount === 1 ? "+" : "−";
    button.setAttribute("aria-label", action + " one " + item.drink.name);
    button.addEventListener("click", function () {
        changeQuantity(item.drink, amount);
        (orderList.querySelector("button") || document.getElementById("estimate-heading")).focus();
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
        line.className = "d-flex align-items-center gap-2 pb-3 flex-wrap";
        const summary = document.createElement("span");
        summary.className = "me-auto";
        summary.textContent = item.drink.name + " × " + item.quantity + " · " + formatPrice(subtotal);
        line.append(summary, quantityButton(item, -1), quantityButton(item, 1));
        orderList.append(line);
    });
    document.getElementById("order-total").textContent = formatPrice(total);
}

function readNotes() {
    return readStoredArray(NOTES_KEY, function (note) {
        return note && typeof note.id === "string" && typeof note.drink === "string" && typeof note.text === "string";
    });
}

function renderNotes() {
    const notes = readNotes();
    notesList.replaceChildren();
    if (!notes.length) {
        notesStatus.textContent = "No tasting notes yet. Add one above to get started.";
        return;
    }
    notesStatus.textContent = notes.length + (notes.length === 1 ? " saved note." : " saved notes.");
    notes.forEach(function (note) {
        const item = document.createElement("li");
        item.className = "note-item d-flex align-items-start gap-3 flex-wrap";
        const content = document.createElement("div");
        content.className = "me-auto";
        const title = document.createElement("strong");
        title.textContent = note.drink;
        const detail = document.createElement("p");
        detail.className = "mb-0";
        detail.textContent = note.text;
        content.append(title, detail);
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "btn btn-sm btn-outline-dark";
        edit.textContent = "Edit";
        edit.addEventListener("click", function () { startEdit(note); });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn-sm btn-outline-danger";
        remove.textContent = "Delete";
        remove.addEventListener("click", function () { deleteNote(note.id); });
        item.append(content, edit, remove);
        notesList.append(item);
    });
}

function startEdit(note) {
    noteId.value = note.id;
    noteDrink.value = note.drink;
    noteText.value = note.text;
    noteSubmit.textContent = "Update note";
    noteCancel.hidden = false;
    noteDrink.focus();
}

function resetNoteForm() {
    noteForm.reset();
    noteId.value = "";
    noteSubmit.textContent = "Save note";
    noteCancel.hidden = true;
}

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const notes = readNotes();
    const note = { id: noteId.value || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), drink: noteDrink.value.trim(), text: noteText.value.trim() };
    if (!note.drink || !note.text) return;
    const existingIndex = notes.findIndex(function (entry) { return entry.id === note.id; });
    if (existingIndex >= 0) notes[existingIndex] = note;
    else notes.unshift(note);
    if (!writeStoredArray(NOTES_KEY, notes)) {
        notesStatus.textContent = "Could not save this note. Check browser storage and try again.";
        return;
    }
    resetNoteForm();
    renderNotes();
});

function deleteNote(id) {
    const notes = readNotes().filter(function (note) { return note.id !== id; });
    if (!writeStoredArray(NOTES_KEY, notes)) {
        notesStatus.textContent = "Could not delete this note. Check browser storage and try again.";
        return;
    }
    if (noteId.value === id) resetNoteForm();
    renderNotes();
}

searchInput.addEventListener("input", renderMenu);
typeSelect.addEventListener("change", renderMenu);
sortSelect.addEventListener("change", renderMenu);
noteCancel.addEventListener("click", resetNoteForm);
renderMenu();
renderOrder();
renderNotes();
