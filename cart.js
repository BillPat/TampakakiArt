document.addEventListener("DOMContentLoaded", () => {
    const cartItemsDiv = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update the displayed cart items
    function updateCartUI() {
        cartItemsDiv.innerHTML = ""; // Clear existing items
        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = `
                ${item.name} - €${item.price}
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        }

        // Update the PayPal button
        renderPayPalButton();
    }

    // Function to handle item removal
    cartItemsDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1); // Remove the item from the cart array
            localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
            updateCartUI(); // Refresh the cart display
        }
    });

    // Function to render the PayPal button
    function renderPayPalButton() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const paypalButtonContainer = document.getElementById("paypal-button-container");
        paypalButtonContainer.innerHTML = ""; // Clear existing button

        if (total > 0) {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{ amount: { value: total.toString() } }],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        alert(`Transaction completed by ${details.payer.name.given_name}`);
                        localStorage.removeItem("cart");
                        window.location.href = "index.html";
                    });
                },
            }).render("#paypal-button-container");
        }
    }

    // Initial UI update
    updateCartUI();
});
