// Store counter data - all checkouts start empty per problem statement
const counters = [
    { id: 1, customers: 0, items: [], total: 0 },
    { id: 2, customers: 0, items: [], total: 0 },
    { id: 3, customers: 0, items: [], total: 0 }
];

// DOM elements
const itemsInput = document.getElementById('itemsInput');
const checkoutBtn = document.getElementById('checkoutBtn');
const counterElements = document.querySelectorAll('.counter');

// Initialize the application
function init() {
    // Add event listener for checkout button
    checkoutBtn.addEventListener('click', addItemToOptimalCounter);
    
    // Display initial empty checkout counters
    updateAllCounters();
}

// Update all counters' displays
function updateAllCounters() {
    for (let i = 1; i <= counters.length; i++) {
        updateCustomerCount(i);
        updateTotalItems(i);
    }
}

// Setup all remove buttons in the DOM
function setupRemoveButtons() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', handleItemRemoval);
    });
}

// Handle item removal when minus button is clicked
function handleItemRemoval() {
    const item = this.closest('.item');
    const counterElement = this.closest('.counter');
    const counterId = parseInt(counterElement.id.replace('counter', ''));
    
    // Get the item count from the text
    const itemText = item.querySelector('.item-info span:last-child').textContent;
    const itemCount = parseInt(itemText);
    
    // Find the index of this item in the counter's items array
    const counterIndex = counterId - 1;
    const itemIndex = Array.from(counterElement.querySelectorAll('.item')).indexOf(item);
    
    // Remove the item from DOM and data
    item.remove();
    counters[counterIndex].items.splice(itemIndex, 1);
    
    // Decrease the customer count
    counters[counterIndex].customers--;
    updateCustomerCount(counterId);
    
    // Recalculate the total
    counters[counterIndex].total -= itemCount;
    updateTotalItems(counterId);
}

// Update the customer count display for a counter
function updateCustomerCount(counterId) {
    const counterIndex = counterId - 1;
    const customerCount = counters[counterIndex].customers;
    document.getElementById(`customers${counterId}`).textContent = 
        `${customerCount} customer${customerCount === 1 ? '' : 's'}`;
}

// Update the total items display for a counter
function updateTotalItems(counterId) {
    const counterIndex = counterId - 1;
    document.getElementById(`total${counterId}`).textContent = 
        `Total Items: ${counters[counterIndex].total}`;
}

// Add a new item to the optimal counter based on queueing algorithm
function addItemToOptimalCounter() {
    const itemCount = parseInt(itemsInput.value);
    
    if (!itemCount || itemCount <= 0) {
        alert('Please enter a valid number of items.');
        return;
    }
    
    // Find the optimal counter based on our algorithm
    const optimalCounter = findOptimalCounter();
    const counterId = optimalCounter.id;
    const counterIndex = counterId - 1;
    
    // Add item to the counter's items array
    counters[counterIndex].items.push(itemCount);
    
    // Increase the customer count
    counters[counterIndex].customers++;
    updateCustomerCount(counterId);
    
    // Recalculate the total
    counters[counterIndex].total += itemCount;
    updateTotalItems(counterId);
    
    // Add the new item to the DOM
    addItemToDOM(counterId, itemCount);
    
    // Highlight the chosen counter
    highlightCounter(counterId);
    
    // Clear the input field
    itemsInput.value = '';
}

// Find the optimal counter based on the queueing algorithm
function findOptimalCounter() {
    // Find the counter with minimum total items
    let minItemsCounter = counters[0];
    
    for (let i = 1; i < counters.length; i++) {
        if (counters[i].total < minItemsCounter.total) {
            minItemsCounter = counters[i];
        }
    }
    
    // If there are multiple counters with the same minimum total items
    // return the leftmost one (smallest index)
    const minTotal = minItemsCounter.total;
    for (let i = 0; i < counters.length; i++) {
        if (counters[i].total === minTotal) {
            return counters[i]; // Return the leftmost counter with minimum total
        }
    }
    
    return minItemsCounter;
}

// Add a new item element to the DOM for a specific counter
function addItemToDOM(counterId, itemCount) {
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <div class="item-info">
            <span class="cart-icon">🛒</span>
            <span>${itemCount} item${itemCount === 1 ? '' : 's'}</span>
        </div>
        <button class="remove-btn">−</button>
    `;
    
    // Add the new item to the DOM
    document.getElementById(`itemList${counterId}`).appendChild(newItem);
    
    // Add event listener to the new remove button
    newItem.querySelector('.remove-btn').addEventListener('click', handleItemRemoval);
}

// Highlight the selected counter
function highlightCounter(counterId) {
    // Remove active class from all counters
    document.querySelectorAll('.counter').forEach(counter => counter.classList.remove('active'));
    
    // Add active class to the selected counter
    document.getElementById(`counter${counterId}`).classList.add('active');
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);