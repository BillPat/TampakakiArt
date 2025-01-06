document.addEventListener("DOMContentLoaded", () => {
    const cartItemsDiv = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Display cart items
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = `${item.name} - €${item.price}`;
        cartItemsDiv.appendChild(itemDiv);
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
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            });
        },
    }).render("#paypal-button-container");
});
