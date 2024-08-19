const logFiles = [
    'version-1.0.3.txt'
];

async function loadChangelogs() {
    const container = document.getElementById('changelog-container');

    try {
        for (const file of logFiles) {
            const category = categorizeFile(file);

            const versionNumber = file.replace('version-', '').replace('.txt', '');

            const changelogItem = document.createElement('div');
            changelogItem.className = 'changelog-item';

            const changelogTitle = document.createElement('div');
            changelogTitle.className = 'changelog-title';
            changelogTitle.textContent = `${category} ${versionNumber}`;

            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'arrow-left';
            changelogTitle.appendChild(arrowSpan);

            const changelogContent = document.createElement('div');
            changelogContent.className = 'changelog-content';
            changelogContent.style.display = 'none';

            changelogItem.appendChild(changelogTitle);
            changelogItem.appendChild(changelogContent);
            container.appendChild(changelogItem);

            changelogTitle.addEventListener('click', async () => {
                if (changelogContent.style.display === 'none') {
                    const response = await fetch(`/changelog/logs/${file}`);
                    if (response.ok) {
                        const text = await response.text();
                        changelogContent.innerHTML = marked(text);
                    } else {
                        changelogContent.textContent = "Failed to load content.";
                    }
                    changelogContent.style.display = 'block';
                    arrowSpan.className = 'arrow-down';
                } else {
                    changelogContent.style.display = 'none';
                    arrowSpan.className = 'arrow-left';
                }
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
