document.addEventListener('DOMContentLoaded', async () => {
    let total = localStorage.getItem('inventoryTotal') ? parseInt(localStorage.getItem('inventoryTotal')) : 0;
    document.getElementById('total').innerText = formatValue(total);

    const savedGifToggle = localStorage.getItem('gifToggle') === 'true';
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const currentVersionNumber = await fetchVersionNumber();
    const savedVersionNumber = localStorage.getItem('currentVersionNumber');
    const currentUrl = window.location.href;

    async function fetchVersionNumber() {
        try {
            const response = await fetch('version');
            const versionText = await response.text();
            return versionText.trim();
        } catch (error) {
            console.error('Error fetching version number:', error);
            return 'unknown';
        }
    }

    if (!currentUrl.includes("/index.html") && savedVersionNumber !== currentVersionNumber) {
        const updateNotice = document.getElementById('updateNotice');
        const versionDisplay = document.getElementById('versionNumber');

        versionDisplay.innerText = currentVersionNumber;
        updateNotice.style.display = 'block';

        document.getElementById('closeNotice').addEventListener('click', () => {
            updateNotice.style.display = 'none';
            localStorage.setItem('currentVersionNumber', currentVersionNumber);
        });
    }

    applyGifToggle(savedGifToggle);
    applyTheme(savedTheme);
    document.getElementById('gif-toggle').checked = savedGifToggle;
    document.getElementById('theme-select').value = savedTheme;

    document.querySelector('.settings-open').addEventListener('click', () => {
        const settingsModal = document.querySelector('.settings-modal');
        settingsModal.style.display = 'flex';
    });

    document.getElementById('settings-close').addEventListener('click', () => {
        const settingsModal = document.querySelector('.settings-modal');
        settingsModal.style.display = 'none';
    });

    document.getElementById('gif-toggle').addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        applyGifToggle(isChecked);
        localStorage.setItem('gifToggle', isChecked.toString());
    });

    document.getElementById('theme-select').addEventListener('change', (event) => {
        const selectedTheme = event.target.value;
        applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    });

    const searchInput = document.getElementById('searchInput');
    const gridItems = document.querySelectorAll('.grid-item');

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase().trim();
        gridItems.forEach(item => {
            const keywords = item.getAttribute('search-terms').toLowerCase().split(' ');
            const itemLabel = item.querySelector('.image-label').textContent.toLowerCase();
            const matchesKeyword = keywords.some(keyword => keyword.includes(searchValue));

            if (itemLabel.includes(searchValue) || matchesKeyword) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            total += value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            input.value = '1';
            localStorage.setItem('inventoryTotal', total);
        });
    });

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            total -= value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            input.value = '1';
            localStorage.setItem('inventoryTotal', total);
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
        localStorage.setItem('inventoryTotal', total);
    });

    function formatValue(number) {
        return number.toLocaleString('en-US');
    }

    const copyButton = document.querySelector('.copy-button');
    copyButton.addEventListener('click', () => {
        const totalValue = document.getElementById('total').innerText;
        navigator.clipboard.writeText("My Sol's RNG inventory value is " + totalValue + "! What's yours?\nCalculate your inventory value at https://bit.ly/rng-calculator and share it to friends!")
            .then(() => {
                console.log('Total value copied to clipboard:', totalValue);
            })
            .catch(error => {
                console.error('Failed to copy text: ', error);
            });
    });
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
    for (let i = 0; i < ca.length; i++) {
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
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

function applyGifToggle(gifToggle) {
    const gridItems = document.querySelectorAll('.grid-item img');
    gridItems.forEach(img => {
        const imgSrc = img.getAttribute('data-img-src');
        const gifSrc = img.getAttribute('data-gif-src');
        if (gifToggle) {
            img.src = gifSrc;
        } else {
            img.src = imgSrc;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.href;
    if (currentUrl.includes("/index.html")) {
        window.location.replace(currentUrl.replace("/index.html", ""));
    }
});