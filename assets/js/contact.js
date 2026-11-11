const form = document.getElementById("message-form");
const fields = form.querySelectorAll("input, select, textarea");
const statusMessage = document.getElementById("form-status");
let hasSubmitted = false;

function getError(field) {
    const value = field.value.trim();

    switch (field.id) {
        case "name":
            if (value.length < 2) return "Enter a name with at least 2 characters.";
            break;
        case "email":
            if (!value) return "Enter your email address.";
            if (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Enter an email address such as name@example.com.";
            }
            break;
        case "topic":
            if (!value) return "Choose a topic for your message.";
            break;
        case "message":
            if (value.length < 10) return "Write a message with at least 10 characters.";
            break;
    }
    return "";
}

function validateField(field) {
    const error = getError(field);
    document.getElementById(field.id + "-error").textContent = error;
    field.classList.toggle("is-invalid", error !== "");
    field.setAttribute("aria-invalid", String(error !== ""));
}

form.addEventListener("input", function (event) {
    statusMessage.textContent = "";
    if (hasSubmitted) validateField(event.target);
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    hasSubmitted = true;
    fields.forEach(validateField);

    const firstInvalid = form.querySelector(".is-invalid");
    if (firstInvalid) {
        statusMessage.textContent = "";
        firstInvalid.focus();
        return;
    }

    statusMessage.textContent = "Your message passed validation. It stays in this browser.";
});

form.querySelector("button[type=submit]").disabled = false;
