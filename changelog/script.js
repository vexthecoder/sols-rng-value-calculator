async function loadChangelogs() {
    const container = document.getElementById('changelog-container');
    try {
        const response = await fetch('/changelog/logs');
        const files = await response.json();

        const filteredFiles = files.filter(file => file !== 'template.txt');

        const sortedFiles = filteredFiles.sort((a, b) => {
            const versionA = extractVersion(a);
            const versionB = extractVersion(b);

            const versionComparison = versionB.localeCompare(versionA, undefined, { numeric: true, sensitivity: 'base' });
            if (versionComparison !== 0) return versionComparison;

            return getTypePriority(a) - getTypePriority(b);
        });

        for (const file of sortedFiles) {
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
                    const fileContent = await fetch(`/changelog/logs/${file}`);
                    const text = await fileContent.text();
                    changelogContent.textContent = text;
                }
                changelogContent.style.display = changelogContent.style.display === 'none' ? 'block' : 'none';
            });
        }
    } catch (error) {
        console.error('Error loading changelogs:', error);
        container.textContent = 'Failed to load changelogs.';
    }
}

function extractVersion(filename) {
    const match = filename.match(/\d+(\.\d+)+/);
    return match ? match[0] : filename;
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

function getTypePriority(filename) {
    if (filename.toLowerCase().includes('fix')) {
        return 3;
    } else if (filename.toLowerCase().includes('beta')) {
        return 2;
    } else {
        return 1;
    }
}

window.onload = loadChangelogs;
