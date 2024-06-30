/* styles.css */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
    color: #333;
    transition: background-color 0.5s, color 0.5s;
    position: relative; /* Ensure body is relative for absolute positioning */
}

.theme-toggle {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    z-index: 1000;
}

.theme-toggle:hover {
    background-color: #0056b3;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 columns per row */
    gap: 20px;
    padding: 20px;
    max-width: 90vw;
    margin: 0 auto;
}

.grid-item {
    background-color: #fff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: background-color 0.3s, color 0.3s;
}

.grid-item img {
    border-radius: 8px;
    max-width: 100%;
    height: auto;
}

.input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.quantity {
    width: 50px;
    text-align: center;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0 5px;
}

.add-button, .remove-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.add-button:hover, .remove-button:hover {
    background-color: #218838;
}

.remove-button {
    margin-left: 5px;
}

.total-container {
    position: absolute;
    bottom: 10px; /* Adjust bottom spacing as needed */
    right: 10px; /* Adjust right spacing as needed */
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border-top-left-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, color 0.3s;
    z-index: 1000;
}

.total-container span {
    margin-left: 5px; /* Add space between number and colon */
}

.clear-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #dc3545;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px; /* Add gap between inventory value and clear button */
}

.clear-button:hover {
    background-color: #c82333;
}

.dark-mode {
    background-color: #333;
    color: #fff;
}

.dark-mode .grid-item {
    background-color: #444;
    color: #fff;
}

.dark-mode .add-button, .dark-mode .remove-button {
    background-color: #28a745;
}

.dark-mode .add-button:hover, .dark-mode .remove-button:hover {
    background-color: #218838;
}

.dark-mode .total-container {
    background-color: rgba(0, 0, 0, 0.8);
}

.dark-mode .total-container span {
    color: #fff;
}

.dark-mode .clear-button {
    background-color: #dc3545;
}

.dark-mode .clear-button:hover {
    background-color: #c82333;
}
