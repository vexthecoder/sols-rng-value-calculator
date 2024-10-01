document.addEventListener('DOMContentLoaded', async () => {
    let total = localStorage.getItem('inventoryTotal') ? parseInt(localStorage.getItem('inventoryTotal')) : 0;
    document.getElementById('total').innerText = formatValue(total);

    const versionNumber = await fetchVersionNumber();
    const currentVersion = localStorage.getItem('currentVersion');
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

    if (!currentUrl.includes("/index.html") && currentVersion !== versionNumber) {
        const updateNotice = document.getElementById('updateNotice');
        const versionDisplay = document.getElementById('versionNumber');
        versionDisplay.innerText = versionNumber;
        updateNotice.style.display = 'block';

        document.getElementById('closeNotice').addEventListener('click', () => {
            updateNotice.style.display = 'none';
            localStorage.setItem('currentVersion', versionNumber);
        });
    }

    const savedGifToggle = localStorage.getItem('gifToggle') === 'true';
    const savedTheme = localStorage.getItem('theme') || 'dark';
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
    const auraList = document.getElementById('auraList');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            total += value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            localStorage.setItem('inventoryTotal', total);
            input.value = '1';

            const auraName = button.closest('.grid-item').querySelector('.image-label').textContent;
            const auraEntry = document.createElement('div');
            auraEntry.innerHTML = `${auraName} (${value}) <button class="remove-aura">Remove</button>`;
            auraList.appendChild(auraEntry);
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
            localStorage.setItem('inventoryTotal', total);
            input.value = '1';
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
        localStorage.setItem('inventoryTotal', total);
        auraList.innerHTML = '';
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

    const dropdownButton = document.getElementById('dropdown-button');
    if (dropdownButton) {
        dropdownButton.addEventListener('click', () => {
            const dropdownContent = document.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.toggle('show');
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (!event.target.matches('#dropdown-button') && !event.target.matches('.remove-aura')) {
            const dropdownContent = document.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.remove('show');
            }
        }
    });

    auraList.addEventListener('click', (event) => {
        if (event.target.matches('.remove-aura')) {
            const auraEntry = event.target.parentElement;
            auraEntry.remove();
        }
    });
});

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

function formatValue(number) {
    return number.toLocaleString('en-US');
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
