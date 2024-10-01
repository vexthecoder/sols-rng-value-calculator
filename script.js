document.addEventListener('DOMContentLoaded', async () => {
    let total = localStorage.getItem('invValue') ? parseInt(localStorage.getItem('invValue')) : 0;
    document.getElementById('total').innerText = languageFormat(total);

    const settings_gifs = localStorage.getItem('gifToggle') === 'true';
    const settings_theme = localStorage.getItem('theme') || 'dark';
    const storage_version = await getVersion();
    const storage_savedVersion = localStorage.getItem('storage_version');
    const currentUrl = window.location.href;

    async function getVersion() {
        try {
            const response = await fetch('version');
            const versionText = await response.text();
            return versionText.trim();
        } catch (error) {
            console.error('Error fetching version number:', error);
            return 'unknown';
        }
    }

    if (!currentUrl.includes("/index.html") && storage_savedVersion !== storage_version) {
        const updateNotice = document.getElementById('updateNotice');
        const versionDisplay = document.getElementById('versionNumber');

        versionDisplay.innerText = storage_version;
        updateNotice.style.display = 'block';

        document.getElementById('closeNotice').addEventListener('click', () => {
            updateNotice.style.display = 'none';
            localStorage.setItem('storage_version', storage_version);
        });
    }

    applySettings_gifs(settings_gifs);
    applySettings_theme(settings_theme);
    document.getElementById('gif-toggle').checked = settings_gifs;
    document.getElementById('theme-select').value = settings_theme;

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
        applySettings_gifs(isChecked);
        localStorage.setItem('gifToggle', isChecked.toString());
    });

    document.getElementById('theme-select').addEventListener('change', (event) => {
        const chosenTheme = event.target.value;
        applySettings_theme(chosenTheme);
        localStorage.setItem('theme', chosenTheme);
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
            document.getElementById('total').innerText = languageFormat(total);
            input.value = '1';
            localStorage.setItem('invValue', total);
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
            document.getElementById('total').innerText = languageFormat(total);
            input.value = '1';
            localStorage.setItem('invValue', total);
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
        localStorage.setItem('invValue', total);
    });

    function languageFormat(number) {
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

function applySettings_theme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

function applySettings_gifs(gifToggle) {
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