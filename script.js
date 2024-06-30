let total = 0;

document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const value = parseInt(input.value) || 0;
            const multiplier = button.closest('.grid-item').getAttribute('data-multiplier');
            total += value * multiplier;
            document.getElementById('total').innerText = total;
            input.value = '';
        });
    });
});
