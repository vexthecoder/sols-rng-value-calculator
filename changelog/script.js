const logFiles = [
    // Newer versions go above older versions.
    'fix-1.0.4-1.md',
    'version-1.0.4.md',
    'version-1.0.3.md',
    'version-1.0.2.md',
    'version-1.0.1.md'
];

async function loadChangelogs() {
    const container = document.getElementById('changelog-container');

    try {
        for (const file of logFiles) {
            const category = categorizeFile(file);

            const versionNumber = file.replace('version-', '').replace('fix-', '').replace('-', ' ').replace('.md', '');

            const changelogItem = document.createElement('div');
            changelogItem.className = 'changelog-item';

            const changelogTitle = document.createElement('div');
            changelogTitle.className = 'changelog-title';
            changelogTitle.innerHTML = `${category} ${versionNumber} <span class="arrow arrow-left"></span>`;

            const changelogContent = document.createElement('div');
            changelogContent.className = 'changelog-content';
            changelogContent.style.display = 'none';

            changelogItem.appendChild(changelogTitle);
            changelogItem.appendChild(changelogContent);
            container.appendChild(changelogItem);

            changelogTitle.addEventListener('click', async () => {
                const arrow = changelogTitle.querySelector('.arrow');
                if (changelogContent.style.display === 'none') {
                    console.log(`Fetching content for ${file}`);
                    const response = await fetch(`/changelog/logs/${file}`);
                    if (response.ok) {
                        const text = await response.text();
                        console.log(`Fetched content for ${file}:`, text);
                        
                        if (typeof marked === 'function') {
                            changelogContent.innerHTML = marked(text);
                        } else {
                            changelogContent.textContent = text;
                        }
                        
                        changelogContent.style.display = 'block';
                        arrow.className = 'arrow arrow-down';
                    } else {
                        changelogContent.textContent = "Failed to load content.";
                        changelogContent.style.display = 'block';
                    }
                } else {
                    changelogContent.style.display = 'none';
                    arrow.className = 'arrow arrow-left';
                }
            });
        }
    } catch (error) {
        console.error('Error loading changelogs:', error);
        container.textContent = 'Failed to load changelogs. Please reload. If the issue persists, contact vexthecoder on discord with the console error log.';
    }
}

function categorizeFile(filename) {
    if (filename.toLowerCase().includes('fix')) {
        return "Fix";
    } else {
        return "Version";
    }
}

window.onload = loadChangelogs;
