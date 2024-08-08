// Get the form and table elements
const form = document.getElementById('order-form');
const cartTableBody = document.getElementById('cart-table-body');
const totalPriceElement = document.getElementById('total-price');
const addToFavoritesButton = document.getElementById('add-to-favorites-button');
const applyFavoritesButton = document.getElementById('apply-favorites-button');

// Function to handle "Add to Cart" button clicks
function addToCart(event) {
    event.preventDefault(); // Add this line to prevent form submission
    const button = event.target;
    const productKey = button.dataset.product;
    const quantityInput = document.getElementById(productKey);
    const priceElement = document.getElementById(`${productKey}-price`);
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceElement.textContent.replace('Rs ', '').replace(',', ''));
    if (quantity > 0) {
        const totalPrice = quantity * price;
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${productKey.charAt(0).toUpperCase() + productKey.slice(1)}</td>
            <td>${quantity}</td>
            <td>Rs ${price.toFixed(2)}</td>
            <td>Rs ${totalPrice.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(tableRow);
        updateTotalPrice();

        // Save cart items to local storage
        const cartItems = Array.from(cartTableBody.querySelectorAll('tr')).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                productKey: cells[0].textContent.toLowerCase(),
                quantity: parseInt(cells[1].textContent),
                price: parseFloat(cells[2].textContent.replace('Rs ', '')),
                totalPrice: parseFloat(cells[3].textContent.replace('Rs ', ''))
            };
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}

// Function to handle "Add to Favorites" button click
function addToFavorites() {
    const selectedProducts = Array.from(form.elements).filter(element => element.type === 'number' && element.value > 0);
    const favorites = selectedProducts.map(element => {
        const productKey = element.id;
        const quantity = parseInt(element.value);
        const priceElement = document.getElementById(`${productKey}-price`);
        const price = parseFloat(priceElement.textContent.replace('Rs ', '').replace(',', ''));
        return {
            productKey,
            quantity,
            price
        };
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`Added the following item(s) to favorites: ${favorites.map(favorite => `${favorite.productKey} x ${favorite.quantity}`).join(', ')}`);
}

// Function to handle "Apply Favorites" button click
function applyFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites) {
        favorites.forEach(favorite => {
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td>${favorite.productKey.charAt(0).toUpperCase() + favorite.productKey.slice(1)}</td>
                <td>${favorite.quantity}</td>
                <td>Rs ${favorite.price.toFixed(2)}</td>
                <td>Rs ${(favorite.quantity * favorite.price).toFixed(2)}</td>
            `;
            cartTableBody.appendChild(tableRow);
            updateTotalPrice();
        });
        // Update local storage with new cart items
        updateLocalStorage();
    }
}

// Function to update local storage with new cart items
function updateLocalStorage() {
    const cartItems = Array.from(cartTableBody.querySelectorAll('tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            productKey: cells[0].textContent.toLowerCase(),
            quantity: parseInt(cells[1].textContent),
            price: parseFloat(cells[2].textContent.replace('Rs ', '')),
            totalPrice: parseFloat(cells[3].textContent.replace('Rs ', ''))
        };
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
// Add event listeners to the buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});

addToFavoritesButton.addEventListener('click', addToFavorites);
applyFavoritesButton.addEventListener('click', applyFavorites);

// Function to update the total price
function updateTotalPrice() {
    const totalPrice = Array.from(cartTableBody.children).reduce((acc, row) => {
        const priceCell = row.cells[3];
        const price = parseFloat(priceCell.textContent.replace('Rs ', ''));
        return acc + price;
    }, 0);
    totalPriceElement.textContent = `Rs ${totalPrice.toFixed(2)}`;
}
// Function to validate the form
function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const zip = document.getElementById('zip').value;
    const ccNumber = document.getElementById('cc-number').value;
    const ccv = document.getElementById('ccv').value;
    const expiryDate = document.getElementById('expiry-date').value;

    if (name && email && address && zip && ccNumber && ccv && expiryDate) {
        return true;
    } else {
        return false;
    }
}

// Function to place the order and show the popup
function placeOrder() {
    if (validateForm()) { 
        document.getElementById('orderConfirmation').style.display = 'block'; 
    } else {
        alert('Please fill out all required fields.');
    }
}

// Function to close the popup
function closePopup() {
    document.getElementById('orderConfirmation').style.display = 'none';
}



function redirectToOrderPage() {
    window.location.href = "Payment.html";
}

// ...

// Function to handle "Pay" button clicks
function payButtonClicked() {
    const tableRows = cartTableBody.children;
    const cartData = [];
    for (const row of tableRows) {
        const item = {
            name: row.cells[0].textContent,
            quantity: row.cells[1].textContent,
            price: row.cells[2].textContent,
            totalPrice: row.cells[3].textContent
        };
        cartData.push(item);
    }       
    localStorage.setItem('cartData', JSON.stringify(cartData));
    redirectToOrderPage();
}

document.getElementById('pay-button').addEventListener('click', payButtonClicked);

// Order page JavaScript
const orderTableBody = document.getElementById('order-table-body');

function loadCartData() {
    const cartData = localStorage.getItem('cartData');
    if (cartData) {
        const items = JSON.parse(cartData);
        for (const item of items) {
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.totalPrice}</td>
            `;
            orderTableBody.appendChild(tableRow);
        }
    }
}

loadCartData();




