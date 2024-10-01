document.addEventListener('DOMContentLoaded', async () => {
    let total = 0;
    let auraList = JSON.parse(localStorage.getItem('auraList')) || [];

    const versionNumber = await fetchVersionNumber();
    const savedVersion = localStorage.getItem('currentversionn') || '';
    const currentUrl = window.location.href;
    const dropdownIcon = document.getElementById('dropdown-icon');
    const auraDropdown = document.getElementById('auraDropdown');
    const auraListContainer = document.getElementById('auraListContainer');
    const totalContainer = document.querySelector('.total-container');
    const totalSpan = document.getElementById('total');
    const copyButton = document.querySelector('.copy-button');
    const clearButton = document.querySelector('.clear-button');

    if (!currentUrl.includes("/index.html") && savedVersion !== versionNumber) {
        const updateNotice = document.getElementById('updateNotice');
        const versionDisplay = document.getElementById('versionNumber');
        versionDisplay.innerText = versionNumber;
        updateNotice.style.display = 'block';
        document.getElementById('closeNotice').addEventListener('click', () => {
            updateNotice.style.display = 'none';
            localStorage.setItem('currentversionn', versionNumber);
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

    dropdownIcon.addEventListener('click', () => {
        auraDropdown.classList.toggle('open');
        totalContainer.classList.toggle('shifted-up');
        renderAuraList();
    });

    function renderAuraList() {
        auraListContainer.innerHTML = '';
        auraList.forEach(aura => {
            const auraItem = document.createElement('div');
            auraItem.classList.add('aura-item');
            auraItem.innerHTML = `
                <span class="aura-name">${aura.name}</span>
                <span class="aura-quantity">x${aura.quantity}</span>
                <span class="aura-rarity">Rarity: ${aura.rarity}</span>
                <button class="remove-aura">Remove 1</button>
            `;
            auraItem.querySelector('.remove-aura').addEventListener('click', () => {
                removeAura(aura.name);
            });
            auraListContainer.appendChild(auraItem);
        });
    }

    function removeAura(auraName) {
        const auraIndex = auraList.findIndex(aura => aura.name === auraName);
        if (auraIndex !== -1) {
            if (auraList[auraIndex].quantity > 1) {
                auraList[auraIndex].quantity--;
            } else {
                auraList.splice(auraIndex, 1);
            }
            localStorage.setItem('auraList', JSON.stringify(auraList));
            renderAuraList();
            updateTotal();
        }
    }

    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            const auraName = button.closest('.grid-item').querySelector('.aura-name').innerText;

            const aura = auraList.find(aura => aura.name === auraName);
            if (aura) {
                aura.quantity += value;
            } else {
                auraList.push({ name: auraName, quantity: value, rarity: multiplier });
            }

            total += value * multiplier;
            total = Math.max(total, 0);
            localStorage.setItem('auraList', JSON.stringify(auraList));
            localStorage.setItem('totalValue', total);
            totalSpan.innerText = formatValue(total);
            input.value = '1';
        });
    });

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            const auraName = button.closest('.grid-item').querySelector('.aura-name').innerText;

            const aura = auraList.find(aura => aura.name === auraName);
            if (aura) {
                aura.quantity = Math.max(0, aura.quantity - value);
                if (aura.quantity === 0) {
                    auraList = auraList.filter(a => a.name !== auraName);
                }
            }

            total -= value * multiplier;
            total = Math.max(total, 0);
            localStorage.setItem('auraList', JSON.stringify(auraList));
            localStorage.setItem('totalValue', total);
            totalSpan.innerText = formatValue(total);
            input.value = '1';
        });
    });

    clearButton.addEventListener('click', () => {
        total = 0;
        auraList = [];
        localStorage.setItem('auraList', JSON.stringify(auraList));
        localStorage.setItem('totalValue', total);
        totalSpan.innerText = formatValue(total);
        renderAuraList();
    });

    function updateTotal() {
        total = auraList.reduce((acc, aura) => acc + aura.quantity * aura.rarity, 0);
        localStorage.setItem('totalValue', total);
        totalSpan.innerText = formatValue(total);
    }

    function formatValue(number) {
        return number.toLocaleString('en-US');
    }

    copyButton.addEventListener('click', () => {
        const totalValue = totalSpan.innerText;
        navigator.clipboard.writeText(`My Sol's RNG inventory value is ${totalValue}! What's yours?\nCalculate your inventory value at https://bit.ly/rng-calculator and share it with friends!`);
    });

    total = parseInt(localStorage.getItem('totalValue')) || 0;
    totalSpan.innerText = formatValue(total);
    renderAuraList();

    function setLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

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
});
