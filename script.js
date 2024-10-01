document.addEventListener('DOMContentLoaded', async () => {
    let total = localStorage.getItem('total') ? parseInt(localStorage.getItem('total')) : 0;
    const auras = JSON.parse(localStorage.getItem('auras')) || [];
    const versionNumber = await fetchVersionNumber();
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

    const updateNotice = document.getElementById('updateNotice');
    const versionDisplay = document.getElementById('versionNumber');

    versionDisplay.innerText = versionNumber;
    updateNotice.style.display = 'block';

    document.getElementById('closeNotice').addEventListener('click', () => {
        updateNotice.style.display = 'none';
        localStorage.setItem('currentversionn', versionNumber);
    });

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
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-rarity');
            total += value * multiplier;
            if (total < 0) total = 0;
            document.getElementById('total').innerText = formatValue(total);
            input.value = '1';

            const auraName = button.closest('.grid-item').querySelector('.image-label').textContent;
            const auraRarity = multiplier;
            const existingAura = auras.find(aura => aura.name === auraName);

            if (existingAura) {
                existingAura.count += value;
            } else {
                auras.push({ name: auraName, count: value, rarity: auraRarity });
            }

            localStorage.setItem('auras', JSON.stringify(auras));
            updateAuraList();
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

            const auraName = button.closest('.grid-item').querySelector('.image-label').textContent;
            const existingAura = auras.find(aura => aura.name === auraName);

            if (existingAura) {
                existingAura.count -= value;
                if (existingAura.count <= 0) {
                    auras.splice(auras.indexOf(existingAura), 1);
                }
            }

            localStorage.setItem('auras', JSON.stringify(auras));
            updateAuraList();
        });
    });

    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        total = 0;
        document.getElementById('total').innerText = total;
        auras.length = 0;
        localStorage.setItem('auras', JSON.stringify(auras));
        updateAuraList();
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

    const dropdownButton = document.querySelector('.dropdown-button');
    dropdownButton.addEventListener('click', () => {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.classList.toggle('show');
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
        updateAuraList();
    });

    function updateAuraList() {
        const auraList = document.querySelector('.aura-list');
        auraList.innerHTML = '';
        auras.forEach(aura => {
            const auraItem = document.createElement('div');
            auraItem.innerText = `${aura.name} - ${aura.count} - Rarity: ${aura.rarity}`;
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', () => {
                aura.count--;
                if (aura.count <= 0) {
                    auras.splice(auras.indexOf(aura), 1);
                }
                localStorage.setItem('auras', JSON.stringify(auras));
                updateAuraList();
                total = Math.max(0, total - aura.rarity); // Adjust total based on aura rarity
                document.getElementById('total').innerText = formatValue(total);
            });
            auraItem.appendChild(removeButton);
            auraList.appendChild(auraItem);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const currentUrl = window.location.href;
        if (currentUrl.includes("/index.html")) {
            window.location.replace(currentUrl.replace("/index.html", ""));
        }
    });
});
