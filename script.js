// Ensure toggleMenu is defined globally
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
        navLinks.classList.toggle("active");
    } else {
        console.error("Element with id 'navLinks' not found.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const productsSelect = document.getElementById('products');

    productsSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value;

        if (selectedValue === "vitamins") {
            window.location.href = 'vitamins.html';
        }
        // You can add more conditions here for other options if needed
    });

    // Existing cart button logic
    function addToCart(product_id, product_name, quantity, price) {
        const user_id = 1; // Replace with the actual user ID in a real application
        fetch('/add-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, product_id, product_name, quantity, price })
        })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error adding to cart:', error));
    }

    // Add event listeners for other elements
    document.getElementById('vitamins-link').addEventListener('click', function () {
        window.location.href = '/vitamins';
    });
    document.getElementById('medic-link').addEventListener('click', function () {
        window.location.href = '/medic';
    });
    document.getElementById('suppliments-link').addEventListener('click', function () {
        window.location.href = '/suppliments';
    });

    // Carousel functionality
    const images = [
        'banner2.jpg',
        'banner3.jpg',
        'banner4.jpg',
        'banner5.jpg',
        'banner6.jpg',
    ];

    let currentIndex = 0; // Track the current image index

    function changeImage() {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        document.getElementById('slideshow-image').src = images[currentIndex];
    }

    // Change image every 3 seconds (3000 milliseconds)
    setInterval(changeImage, 3000);

    // Fetching cart items
    const user_id = 1; // Make sure to set the correct user ID here
    fetch(`/cart/${user_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const cartItems = document.getElementById('cart-items');
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${item.product_name} - $${item.price} x ${item.quantity}</p>
            `;
            cartItems.appendChild(itemDiv);
        });
    })
    .catch(error => console.error('Error fetching cart items:', error));

    // Banner text functionality
    const bannerTextElement = document.getElementById('bannerText');
    const banners = [
        "Welcome to Lyotex! Your health, our priority.",
        "Shop the best vitamins and supplements!",
        "Join us for exclusive offers and discounts!",
        "Explore our range of medications for your needs."
    ];

    let currentBannerIndex = 0;

    function changeBanner() {
        bannerTextElement.innerText = banners[currentBannerIndex];
        currentBannerIndex = (currentBannerIndex + 1) % banners.length;
    }

    // Change the banner text every 3 seconds
    setInterval(changeBanner, 3000);
    changeBanner(); // Initialize the first banner

    console.log('DOM fully loaded and parsed');
});
document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("totalCart");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Update cart icon count on page load
    updateCartCount();

    // Add to cart functionality
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const productCard = event.target.closest(".product-card");
            const productName = productCard.getAttribute("data-name");
            const productPrice = parseFloat(productCard.getAttribute("data-price").replace("$", ""));
            const quantity = parseInt(productCard.querySelector("input[type='number']").value);

            addToCart(productName, productPrice, quantity);
            updateCartCount();
        });
    });

    // Function to add items to cart
    function addToCart(name, price, quantity) {
        const itemIndex = cartItems.findIndex(item => item.name === name);
        
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity += quantity;
        } else {
            cartItems.push({ name, price, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    // Function to update cart count on icon
    function updateCartCount() {
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalQuantity;
    }
});

// Function to display cart items in the cart page
function displayCartItems() {
    const cartContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "$0.00";
        return;
    }

    let totalAmount = 0;
    cartContainer.innerHTML = cartItems.map(item => {
        totalAmount += item.price * item.quantity;
        return `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    }).join("");

    cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
}
