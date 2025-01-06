// Prices for paintings
const paintings = [
    { id: 1, name: "Painting 1", price: 100 },
    { id: 2, name: "Painting 2", price: 150 },
    { id: 3, name: "Painting 3", price: 200 },
];

// Render PayPal buttons for individual paintings
paintings.forEach((painting) => {
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: { value: painting.price.toString() },
                        description: painting.name,
                    },
                ],
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
            });
        },
    }).render(`#paypal-button-${painting.id}`);
});

// Cart functionality
let cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Add items to cart
function addToCart(painting) {
    cart.push(painting);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        total += item.price;
        const li = document.createElement("li");
        li.textContent = `${item.name} - €${item.price}`;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = total.toString();
}

// Render PayPal button for cart
paypal.Buttons({
    createOrder: (data, actions) => {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: total.toString() },
                },
            ],
        });
    },
    onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
            alert(`Transaction completed by ${details.payer.name.given_name}`);
        });
    },
}).render("#paypal-button-cart");
