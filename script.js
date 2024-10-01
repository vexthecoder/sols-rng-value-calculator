document.addEventListener('DOMContentLoaded', async () => {
    let total = parseInt(getCookie('inventoryTotal')) || 0;
    const versionNumber = await fetchVersionNumber();
    const noAlertCookie = getCookie('currentversionn');
    const currentUrl = window.location.href;
    const auras = JSON.parse(getCookie('auras')) || [];

    function updateAurasList() {
        const aurasList = document.getElementById('aurasList');
        aurasList.innerHTML = '';

        auras.forEach((aura, index) => {
            const li = document.createElement('li');
            li.textContent = aura;
            li.addEventListener('click', () => removeAura(index));
            aurasList.appendChild(li);
        });
    }

    function removeAura(index) {
        auras.splice(index, 1);
        setCookie('auras', JSON.stringify(auras), 365);
        updateAurasList();
    }

    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });

    document.getElementById('total').innerText = formatValue(total);
    updateAurasList();

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

    if (!currentUrl.includes("/index.html") && noAlertCookie !== versionNumber) {
        const updateNotice = document.getElementById('updateNotice');
        const versionDisplay = document.getElementById('versionNumber');

        versionDisplay.innerText = versionNumber;
        updateNotice.style.display = 'block';

        document.getElementById('closeNotice').addEventListener('click', () => {
            updateNotice.style.display = 'none';
            setCookie('currentversionn', versionNumber, 365);
        });
    }

    const savedGifToggle = getCookie('gifToggle') === 'true';
    const savedTheme = getCookie('theme') || 'dark';
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
        setCookie('gifToggle', isChecked.toString(), 365);
    });

    document.getElementById('theme-select').addEventListener('change', (event) => {
        const selectedTheme = event.target.value;
        applyTheme(selectedTheme);
        setCookie('theme', selectedTheme, 365);
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
            auras.push(`${value} × ${button.closest('.grid-item').querySelector('.image-label').textContent}`);
            setCookie('auras', JSON.stringify(auras), 365);
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            input.value = '1';
            updateAurasList();
        });
    });

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            total -= value * multiplier;
            auras.push(`-${value} × ${button.closest('.grid-item').querySelector('.image-label').textContent}`);
            setCookie('auras', JSON.stringify(auras), 365);
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            input.value = '1';
            updateAurasList();
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
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
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
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

function applyGifToggle(isChecked) {
    const gifContainer = document.querySelector('.gif-container');
    if (isChecked) {
        gifContainer.style.display = 'block';
    } else {
        gifContainer.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.href;
    if (currentUrl.includes("/index.html")) {
        window.location.replace(currentUrl.replace("/index.html", ""));
    }
});
