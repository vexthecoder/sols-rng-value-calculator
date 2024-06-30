// script.js

let total = getInventoryValueFromCookie() || 0;

document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = getCookie('theme') || 'dark'; // Default to dark mode
    applyTheme(currentTheme);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
        setCookie('theme', newTheme, 365);
    });

    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-multiplier');
            total += value * multiplier;
            if (total < 0) total = 0; // Ensure total doesn't go below 0
            document.getElementById('total').innerText = total;
            input.value = '1';
            saveInventoryValueToCookie(total);
        });
    });

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-multiplier');
            total -= value * multiplier;
            if (total < 0) total = 0; // Ensure total doesn't go below 0
            document.getElementById('total').innerText = total;
            input.value = '1';
            saveInventoryValueToCookie(total);
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
        saveInventoryValueToCookie(total);
    });

    // Function to save inventory value to cookie
    function saveInventoryValueToCookie(value) {
        setCookie('inventory_value', value, 365);
    }

    // Function to retrieve inventory value from cookie
    function getInventoryValueFromCookie() {
        return parseInt(getCookie('inventory_value')) || 0;
    }
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function applyTheme(theme) {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';

    if (theme !== currentTheme) {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
    }
}
