document.addEventListener('DOMContentLoaded', async () => {
    let total = 0;
    const versionNumber = await fetchVersionNumber();
    const noAlertCookie = getCookie('noAlert');
    const currentUrl = window.location.href;

    if (!currentUrl.includes("/index.html") && noAlertCookie !== versionNumber) {
        alert("This website is still in the Beta phase.\nNew features are slowly being added until the entire website is finished.\nFeel free to give constructive feedback on discord (@vexthecoder).\nVersion: ${versionNumber}");
        setCookie('noAlert', versionNumber, 365);
        alert("NOTES:\n1. If Gifs take forever to load, please just toggle them off in the settings. It is not a bug, and is dependent on how good your device is.\n2. Please do report bugs to me on discord (@vexthecoder), it really helps out as I will be able to fix them faster.\n3. The reason Memory, Oblivion, and DEILEMMA are not listed in the calculator is because they have no real calculatable value.")
    }

    const savedGifToggle = getCookie('gifToggle') === 'true';
    const savedTheme = getCookie('theme') || 'light';
    applyGifToggle(savedGifToggle);
    applyTheme(savedTheme);
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
        applyTheme(selectedTheme);
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
