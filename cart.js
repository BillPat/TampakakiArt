document.addEventListener("DOMContentLoaded", () => {
    const cartItemsDiv = document.getElementById("cart-items");
    const paypalButtonContainer = document.getElementById("paypal-button-container");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Ενημέρωση του UI του καλαθιού
    function updateCart() {
        cartItemsDiv.innerHTML = ""; // Καθαρισμός προηγούμενου περιεχομένου

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
            paypalButtonContainer.innerHTML = ""; // Καθαρισμός κουμπιού PayPal αν το καλάθι είναι άδειο
            return;
        }

        // Προβολή αντικειμένων στο καλάθι
        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <div class="cart-item-details">
                    <p>${item.name} - €${item.price}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        renderPayPalButton(); // Εμφάνιση κουμπιού PayPal
        addRemoveFunctionality(); // Σύνδεση κουμπιών "Remove" με τη λειτουργία αφαίρεσης
    }

    // Σύνδεση κουμπιών "Remove" με λειτουργία αφαίρεσης
    function addRemoveFunctionality() {
        const removeButtons = document.querySelectorAll(".remove-item");
        removeButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const index = parseInt(event.target.getAttribute("data-index"), 10); // Παίρνουμε το index
                cart.splice(index, 1); // Αφαίρεση του αντικειμένου από τον πίνακα
                localStorage.setItem("cart", JSON.stringify(cart)); // Ενημέρωση του localStorage
                updateCart(); // Ανανέωση του UI
            });
        });
    }

    // Εμφάνιση κουμπιού PayPal
    function renderPayPalButton() {
        paypalButtonContainer.innerHTML = ""; // Καθαρισμός προηγούμενου κουμπιού PayPal
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{ amount: { value: total.toFixed(2) } }],
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    alert(`Transaction completed by ${details.payer.name.given_name}`);
                    localStorage.removeItem("cart"); // Άδειασμα καλαθιού μετά από επιτυχή πληρωμή
                    window.location.href = "index.html"; // Ανακατεύθυνση στην αρχική σελίδα
                });
            },
        }).render("#paypal-button-container");
    }

    // Αρχική φόρτωση του καλαθιού
    updateCart();
});
