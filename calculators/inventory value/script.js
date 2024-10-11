document.addEventListener('DOMContentLoaded', async () => {
    let total = localStorage.getItem('invValue') ? parseInt(localStorage.getItem('invValue')) : 0;
    const element_invValue = document.getElementById('total');
    const element_gif = document.getElementById('gif-toggle');
    const element_themeSelect = document.getElementById('theme-select');
    const element_searchQuery = document.getElementById('searchInput');
    const element_gridItems = document.querySelectorAll('.grid-item');
    const element_add = document.querySelectorAll('.add-button');
    const element_remove = document.querySelectorAll('.remove-button');
    const element_update = document.getElementById('updateNotice');
    const element_displayVersion = document.getElementById('versionNumber');
    const element_copy = document.querySelector('.copy-button');
    const element_clear = document.querySelector('.clear-button');

    element_invValue.innerText = languageFormat(total);

    const settings_gifs = localStorage.getItem('gifToggle') === 'true';
    const settings_theme = localStorage.getItem('theme') || 'dark';
    const storage_version = await getVersion();
    const storage_savedVersion = localStorage.getItem('storage_version');
    const currentUrl = window.location.href;

    async function getVersion() {
        if (localStorage.getItem('version_cached')) {
            return localStorage.getItem('version_cached');
        }
        try {
            const response = await fetch('version');
            const versionText = (await response.text()).trim();
            localStorage.setItem('version_cached', versionText);
            return versionText;
        } catch (error) {
            console.error('Error fetching version number:', error);
            return 'unknown';
        }
    }

    if (!currentUrl.includes("/index.html") && storage_savedVersion !== storage_version) {
        element_displayVersion.innerText = storage_version;
        element_update.style.display = 'block';

        document.getElementById('closeNotice').addEventListener('click', () => {
            element_update.style.display = 'none';
            localStorage.setItem('storage_version', storage_version);
        });
    }

    applySettings_gifs(settings_gifs);
    applySettings_theme(settings_theme);
    element_gif.checked = settings_gifs;
    element_themeSelect.value = settings_theme;

    document.querySelector('.settings-open').addEventListener('click', () => {
        document.querySelector('.settings-modal').style.display = 'flex';
    });

    document.getElementById('settings-close').addEventListener('click', () => {
        document.querySelector('.settings-modal').style.display = 'none';
    });

    element_gif.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        applySettings_gifs(isChecked);
        localStorage.setItem('gifToggle', isChecked.toString());
    });

    element_themeSelect.addEventListener('change', (event) => {
        const chosenTheme = event.target.value;
        applySettings_theme(chosenTheme);
        localStorage.setItem('theme', chosenTheme);
    });

    let searchTimeout;
    element_searchQuery.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchValue = element_searchQuery.value.toLowerCase().trim();
            element_gridItems.forEach(item => {
                const keywords = item.getAttribute('search-terms').toLowerCase().split(' ');
                const itemLabel = item.querySelector('.image-label').textContent.toLowerCase();
                const matchesKeyword = keywords.some(keyword => keyword.includes(searchValue));
                item.style.display = (itemLabel.includes(searchValue) || matchesKeyword) ? 'block' : 'none';
            });
        }, 300);
    });

    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('.add-button, .remove-button');
        if (!button) return;

        const input = button.closest('.grid-item').querySelector('input');
        const value = parseInt(input.value) || 0;
        const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
        if (button.classList.contains('add-button')) {
            total += value * multiplier;
        } else if (button.classList.contains('remove-button')) {
            total -= value * multiplier;
        }

        if (total < 0) total = 0;
        element_invValue.innerText = languageFormat(total);
        input.value = '1';
        localStorage.setItem('invValue', total);
    });

    element_clear.addEventListener('click', () => {
        total = 0;
        element_invValue.innerText = total;
        localStorage.setItem('invValue', total);
    });

    element_copy.addEventListener('click', () => {
        const totalValue = element_invValue.innerText;
        navigator.clipboard.writeText(`My Sol's RNG inventory value is ${totalValue}! What's yours?\nCalculate your inventory value at https://bit.ly/rng-calculator and share it to friends!`)
            .then(() => {
                console.log('Total value copied to clipboard:', totalValue);
            })
            .catch(error => {
                console.error('Failed to copy text: ', error);
            });
    });
});

function applySettings_theme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme !== 'dark');
}

function applySettings_gifs(gifToggle) {
    const element_gridItems = document.querySelectorAll('.grid-item img');
    element_gridItems.forEach(img => {
        const imgSrc = img.getAttribute('data-img-src');
        const gifSrc = img.getAttribute('data-gif-src');
        img.src = gifToggle ? gifSrc : imgSrc;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = window.location.href;
    if (currentUrl.includes("/index.html")) {
        window.location.replace(currentUrl.replace("/index.html", ""));
    }
});

function languageFormat(number) {
    return number.toLocaleString('en-US');
}
