const paintings = [
    { id: 1, name: "Painting 1", price: 100, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Painting 2", price: 150, image: "https://via.placeholder.com/200" },
    { id: 3, name: "Painting 3", price: 200, image: "https://via.placeholder.com/200" },
];

let selectedPainting = null;
let cart = [];

// Open modal
function openModal(id) {
    const painting = paintings.find(p => p.id === id);
    selectedPainting = painting;

    document.getElementById("modal-image").src = painting.image;
    document.getElementById("modal-description").textContent = `${painting.name} - €${painting.price}`;
    document.getElementById("modal").style.display = "flex";

    // Render PayPal button for modal
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    { amount: { value: painting.price.toString() } },
                ],
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
                closeModal();
            });
        },
    }).render("#paypal-button-modal");
}

// Close modal
function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("paypal-button-modal").innerHTML = ""; // Remove old PayPal button
}

// Add to cart
function addToCart(id) {
    const painting = paintings.find(p => p.id === id);
    cart.push(painting);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    alert(`${painting.name} added to cart!`);
}

// Update cart UI
function updateCart() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;
}

// Initialize cart
document.addEventListener("DOMContentLoaded", () => {
    updateCart();
});
