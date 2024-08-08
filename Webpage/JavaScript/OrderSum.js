document.addEventListener('DOMContentLoaded', () => {
    const orderTableBody = document.getElementById('cart-table-body');
    const totalPriceElement = document.getElementById('total-price');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalPrice = 0;

    cartItems.forEach(item => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${item.productKey.charAt(0).toUpperCase() + item.productKey.slice(1)}</td>
            <td>${item.quantity}</td>
            <td>Rs ${item.price.toFixed(2)}</td>
            <td>Rs ${item.totalPrice.toFixed(2)}</td>
        `;
        orderTableBody.appendChild(tableRow);
        totalPrice += item.totalPrice;
    });

    totalPriceElement.textContent = `Rs ${totalPrice.toFixed(2)}`;
});