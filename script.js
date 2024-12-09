// Menu Items Data
const menu = [
    { id: 1, name: "Coffee", price: 5 },
    { id: 2, name: "Tea", price: 10 },
    { id: 3, name: "Cold Coffee", price: 15 },
    { id: 4, name: "Milk Shake", price: 20 },
    { id: 5, name: "Burger", price: 50 },
    { id: 6, name: "Pizza", price: 100 },
];

// Variables
const menuContainer = document.getElementById("menu-items");
const orderList = document.getElementById("order-list");
const totalAmount = document.getElementById("total-amount");
const kitchenNotification = document.getElementById("kitchen-notification");

let currentOrder = [];

// Populate Menu Items
menu.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    menuItem.innerHTML = `
        <span>${item.name} - ₹${item.price}</span>
        <button onclick="addToOrder(${item.id})">Add</button>
    `;
    menuContainer.appendChild(menuItem);
});

// Add item to the order
function addToOrder(itemId) {
    const item = menu.find((menuItem) => menuItem.id === itemId);

    const existingItem = currentOrder.find((orderItem) => orderItem.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentOrder.push({ ...item, quantity: 1 });
    }

    updateOrderSummary();
}

// Update the Order Summary
function updateOrderSummary() {
    orderList.innerHTML = "";
    let total = 0;

    currentOrder.forEach((item) => {
        total += item.price * item.quantity;

        const orderItem = document.createElement("li");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        `;
        orderList.appendChild(orderItem);
    });

    totalAmount.textContent = total;
}

// Place Order
document.getElementById("place-order").addEventListener("click", () => {
    if (currentOrder.length === 0) {
        alert("Please add items to your order!");
        return;
    }

    notifyKitchen();
});

// Notify Kitchen with Sound
function notifyKitchen() {
    const notification = document.createElement("div");
    notification.classList.add("new-order");

    notification.innerHTML = `<strong>New Order:</strong><br>`;
    currentOrder.forEach((item) => {
        notification.innerHTML += `${item.name} x ${item.quantity}<br>`;
        playNotificationSound(item.name, item.quantity); // Play sound for each item
    });

    kitchenNotification.appendChild(notification);

    // Clear current order after notifying
    currentOrder = [];
    updateOrderSummary();

    alert("Order sent to the kitchen!");
}

// Play Notification Sound for Each Item
function playNotificationSound(itemName, quantity) {
    const utterance = new SpeechSynthesisUtterance(
        `${quantity} ${itemName}${quantity > 1 ? 's' : ''}`
    );
    utterance.lang = "en-US"; // Set the language
    utterance.volume = 1;     // Volume (0 to 1)
    utterance.rate = 1;       // Rate of speech (default is 1)
    utterance.pitch = 1;      // Pitch (default is 1)

    // Check if speechSynthesis is available
    if ('speechSynthesis' in window) {
        speechSynthesis.speak(utterance);
    } else {
        console.error("Speech Synthesis not supported in this browser.");
    }
}
