let cart = [];

// Add item to cart
function addToCart(id) {
    const paintings = [
        { id: 1, name: "Painting 1", price: 100 },
        { id: 2, name: "Painting 2", price: 150 },
    ];
    const painting = paintings.find(p => p.id === id);
    cart.push(painting);

    // Update cart count
    document.getElementById("cart-count").textContent = cart.length;

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${painting.name} added to cart!`);
}
