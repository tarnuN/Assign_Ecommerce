let currency = "₹"; // Set to Indian Rupees

let cart = [];
let products = [];
let totalPrice = document.getElementById("total_price");
let cartCounter = document.getElementById("cart-counter");
let cartItemsCount = document.getElementById("cart_counts");
const cartTextElements = document.querySelectorAll(".cart_products");
const btnControl = document.querySelector(".btn_control");
const cartTotal = document.querySelector(".cart_total");

loadCart();
getData();
checkCart();

async function getData() {
    let response = await fetch('json/products.json');
    let json = await response.json();
    products = json;
}
function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, inputQuantity = 1) {
    let product = products.find(p => p.id == productId);
    if (product) {
        let existingProduct = cart.find(p => p.id == productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            let productWithQuantity = { ...product, quantity: inputQuantity };
            cart.push(productWithQuantity);
        }
        saveCart();
        checkCart();
    }
}

function addCartToHTML() {
    let content = ``;
    cart.forEach((product, index) => {
        let price = parseFloat(product.price);
        let totalPrice = price * product.quantity;
        content += `
        <div class="cart_product">
            <div class="cart_product_img">  
                <img src=${product.images[0]} alt="${product.name}">
            </div>
            <div class="cart_product_info">  
                <div class="top_card">
                    <div class="left_card">
                        <h4 class="product_name">${product.name}</h4>
                        <span class="product_price">${currency}${price.toFixed(2)}</span>
                    </div>
                    <div class="remove_product" onclick="removeFromCart(${index})">
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
                <div class="buttom_card">
                    <div class="counts">
                        <button class="counts_btns minus"  onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" inputmode="numeric" name="productCount" min="1" step="1" max="999"
                            class="product_count" value=${product.quantity}>
                        <button class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="total_price">${currency}${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>`;
    });
    cartTextElements.forEach(element => {
        element.innerHTML = content;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    checkCart();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    checkCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        checkCart();
    } else {
        removeFromCart(index);
    }
}

function updateTotalPrice() {
    let total = cart.reduce((sum, product) => {
        let price = parseFloat(product.price);
        return sum + (price * product.quantity);
    }, 0);
    totalPrice.innerHTML = `${currency}${total.toFixed(2)}`;
    localStorage.setItem("total price", total + 70);
    return total;
}

function checkCart() {
    if (cart.length == 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Your cart is empty";
        });
        cartCounter.innerHTML = 0;
        btnControl.style.display = "none";
        cartTotal.style.display = "none";
        checkCartPage(0, 0);
    } else {
        cartTextElements.forEach(element => {
            element.classList.remove("empty");
        });
        addCartToHTML();
        let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
        cartCounter.innerHTML = totalQuantity;
        btnControl.style.display = "flex";
        cartTotal.style.display = "flex";
        let total = updateTotalPrice();
        checkCartPage(total, totalQuantity);       
    }
}

function checkCartPage(total, totalQuantity) {
    if (window.location.pathname.includes("cartPage.html")) {
        if (cart.length == 0) {
            cartItemsCount.innerHTML = `(0 items)`;
            document.getElementById("Subtotal").innerHTML = `${currency}0.00`;
            document.getElementById("total_order").innerHTML = `${currency}0.00`;
        } else {
            cartItemsCount.innerHTML = `(${totalQuantity} items)`;
            displayInCartPage(total);
        }
    }
}

function displayInCartPage(total) {
    let subTotal = document.getElementById("Subtotal");
    subTotal.innerHTML = `${currency}${total.toFixed(2)}`;
    let totalOrder = total + 70; // Add flat rate for additional charges
    document.getElementById("total_order").innerHTML = `${currency}${totalOrder.toFixed(2)}`;
}

function checkOut() {
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    if (cart.length != 0) {
        if (email && password) {
          window.location.href = "checkout.html";
        } else {
          window.location.href = "login.html";
        }
    }
}
