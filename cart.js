document.addEventListener("DOMContentLoaded", () => {
    const cartItemsDiv = document.getElementById("cart-items");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Display cart items
    cartItemsDiv.innerHTML = ''; // Clear any previous content
    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p>${item.name} - €${item.price}</p>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    // Add remove functionality
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1); // Remove the item from the cart
            localStorage.setItem("cart", JSON.stringify(cart)); // Update the local storage
            updateCart(); // Refresh the page content
        });
    });

    // Render PayPal button
    paypal.Buttons({
        createOrder: (data, actions) => {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            return actions.order.create({
                purchase_units: [{ amount: { value: total.toString() } }],
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
                localStorage.removeItem("cart"); // Empty cart after successful transaction
                window.location.href = "index.html"; // Redirect to home page
            });
        },
    }).render("#paypal-button-container");

    // Function to update cart items UI and PayPal button
    function updateCart() {
        cartItemsDiv.innerHTML = ''; // Clear previous cart items
        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <p>${item.name} - €${item.price}</p>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
    }
});
