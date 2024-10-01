document.addEventListener('DOMContentLoaded', async () => {
    let total = parseInt(getCookie('total')) || 0;
    const versionNumber = await fetchVersionNumber();
    const noAlertCookie = getCookie('currentversionn');
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

    if (!currentUrl.includes("/index.html") && noAlertCookie !== versionNumber) {
        const updateNotice = document.getElementById('updateNotice');
        const versionDisplay = document.getElementById('versionNumber');

        if (versionDisplay) {
            versionDisplay.innerText = versionNumber;
        }
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
        if (settingsModal) {
            settingsModal.style.display = 'flex';
        }
    });

    const settingsCloseButton = document.getElementById('settings-close');
    if (settingsCloseButton) {
        settingsCloseButton.addEventListener('click', () => {
            const settingsModal = document.querySelector('.settings-modal');
            if (settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    const gifToggle = document.getElementById('gif-toggle');
    if (gifToggle) {
        gifToggle.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            applyGifToggle(isChecked);
            setCookie('gifToggle', isChecked.toString(), 365);
        });
    }

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            applyTheme(selectedTheme);
            setCookie('theme', selectedTheme, 365);
        });
    }

    const searchInput = document.getElementById('searchInput');
    const gridItems = document.querySelectorAll('.grid-item');

    if (searchInput) {
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
    }

    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            total += value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            setCookie('total', total, 365);
            input.value = '1';
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
            setCookie('total', total, 365);
            input.value = '1';
        });
    });

    const clearButton = document.querySelector('.clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            total = 0;
            document.getElementById('total').innerText = total;
            setCookie('total', total, 365);
        });
    }

    function formatValue(number) {
        return number.toLocaleString('en-US');
    }

    const copyButton = document.querySelector('.copy-button');
    if (copyButton) {
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
