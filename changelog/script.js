const logFiles = [
    'version-1.0.3.txt'
];

async function loadChangelogs() {
    const container = document.getElementById('changelog-container');

    try {
        for (const file of logFiles) {
            const category = categorizeFile(file);

            const changelogItem = document.createElement('div');
            changelogItem.className = 'changelog-item';

            const changelogTitle = document.createElement('div');
            changelogTitle.className = 'changelog-title';
            changelogTitle.textContent = `${category} - ${file.replace('.txt', '')}`;

            const changelogContent = document.createElement('div');
            changelogContent.className = 'changelog-content';

            changelogItem.appendChild(changelogTitle);
            changelogItem.appendChild(changelogContent);
            container.appendChild(changelogItem);

            changelogTitle.addEventListener('click', async () => {
                if (!changelogContent.textContent) {
                    const response = await fetch(`/changelog/logs/${file}`);
                    if (response.ok) {
                        const text = await response.text();
                        changelogContent.textContent = text;
                    } else {
                        changelogContent.textContent = "Failed to load content.";
                    }
                }
                changelogContent.style.display = changelogContent.style.display === 'none' ? 'block' : 'none';
            });
        }
    } catch (error) {
        console.error('Error loading changelogs:', error);
        container.textContent = 'Failed to load changelogs.';
    }
}

function categorizeFile(filename) {
    if (filename.toLowerCase().includes('fix')) {
        return "Fix";
    } else if (filename.toLowerCase().includes('beta')) {
        return "Beta";
    } else {
        return "Version";
    }
}

window.onload = loadChangelogs;
