document.addEventListener('DOMContentLoaded', async () => {
    let total = 0;
    const versionNumber = await fetchVersionNumber();
    const noAlertCookie = getCookie('noAlert');

    if (noAlertCookie !== versionNumber) {
        alert(`This website is still in the Beta phase.\nNew features are slowly being added until the entire website is finished.\nFeel free to give constructive feedback on discord (@vexthecoder).\nVersion: ${versionNumber}`);
        setCookie('noAlert', versionNumber, 365);
    }

    const themes = await fetchThemes();
    const savedGifToggle = getCookie('gifToggle') === 'true';
    const savedTheme = getCookie('theme') || 'light';
    applyGifToggle(savedGifToggle);
    applyTheme(savedTheme, themes);
    document.getElementById('gif-toggle').checked = savedGifToggle;
    document.getElementById('theme-select').value = savedTheme;

    document.querySelector('.settings-toggle').addEventListener('click', () => {
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
        applyTheme(selectedTheme, themes);
        setCookie('theme', selectedTheme, 365);
    });

    const searchInput = document.getElementById('searchInput');
    const gridItems = document.querySelectorAll('.grid-item');

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase().trim();

        gridItems.forEach(item => {
            const keywords = item.getAttribute('data-keywords').toLowerCase().split(' ');
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
            const multiplier = button.closest('.grid-item').getAttribute('data-multiplier');
            total += value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = total;
            input.value = '1';
        });
    });

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-multiplier');
            total -= value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = total;
            input.value = '1';
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
    });
});

async function fetchVersionNumber() {
    try {
        const response = await fetch('version.txt');
        const versionText = await response.text();
        return versionText.trim();
    } catch (error) {
        console.error('Error fetching version number:', error);
        return 'unknown';
    }
}

async function fetchThemes() {
    try {
        const response = await fetch('themes.json');
        const themes = await response.json();
        return themes;
    } catch (error) {
        console.error('Error fetching themes:', error);
        return {};
    }
}

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

function applyTheme(theme, themes) {
    const root = document.documentElement;
    const themeProperties = themes[theme];
    for (let property in themeProperties) {
        root.style.setProperty(property, themeProperties[property]);
    }
    document.getElementById('settings-icon').style.fill = themeProperties['--settings-icon-color'];
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
