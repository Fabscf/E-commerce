import {
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

const cart = document.querySelector('.header__cart');
const cartBurger = document.querySelector('.header__cart-burger');
const cartCloseBurger = document.querySelector('.burger-cart__close');
const cartBurgerInner = document.querySelector('.burger-cart__inner');
const cartItems = document.querySelector('.burger-cart__items');
let productsData = [];
getProducts();
cartBurger.addEventListener('click', function (event) {
    const targetButton = event.target.closest('.item-cart__delete');
    if (!targetButton) return;
    event.stopPropagation();
    handleDeleteCartItem(targetButton); // Вызов функции для удаления товара
});

cartBurger.addEventListener('click', function (event) {
    quantityCartItem(event);
    totalSum();
});

async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }
        loadProductBasket(productsData);

    } catch (err) {
        console.log(err.message);
    }
}

export function loadProductBasket(data) {
    cartItems.textContent = '';
    if (!data || !data.length) {
        return;
    }
    checkingRelevanceValueBasket(data);
    const basketData = getBasketLocalStorage();
    const basket = basketData.basket || [];
    if (!basket.length) {
        return;
    }
    const findProducts = basket.map(basketItem => {
        const product = data.find(item =>
            String(item.id) === String(basketItem.id) &&
            item.dataColor.includes(basketItem.selectedColor)
        );
        if (product) {
            return { ...product, selectedColor: basketItem.selectedColor, quantity: basketItem.quantity };
        }
        return null;
    }).filter(item => item !== null);

    if (!findProducts.length) {
        return;
    }

    findProducts.forEach(product => {
        if (product) {
            product.selectedColor = product.selectedColor; // Выбранный цвет или первый по умолчанию
            product.quantity = product.quantity || 1; // Количество
        }
    });


    generateItems(findProducts);
    totalSum();
}
function closeCart() {
    cartBurger.classList.remove('burger-cart_active');
    cartBurgerInner.classList.remove('burger-cart__inner_active');
    document.body.style.overflow = "auto";
}
function openCart() {
    cartBurger.classList.add('burger-cart_active');
    cartBurgerInner.classList.add('burger-cart__inner_active');
    document.body.style.overflow = "hidden";
}
if (cart) {
    cart.addEventListener('click', function () {
        openCart();
        totalSum();
    });

    cartCloseBurger.addEventListener('click', function () {
        closeCart();
    });

    cartBurger.addEventListener('click', function (event) {
        const targetButton = event.target.closest('.item-cart__delete');
        if (!cartBurgerInner.contains(event.target) && !targetButton) {
            closeCart();
        }
    });
}



function handleDeleteCartItem(targetButton) {
    const cartItem = targetButton.closest('.burger-cart__item');
    const id = cartItem.dataset.productId;
    const basketData = getBasketLocalStorage();
    const updatedBasket = basketData.basket.filter(item => String(item.id) !== String(id));
    setBasketLocalStorage({ basket: updatedBasket });
    cartItem.remove();

    const addToCartButton = document.querySelector(`.card-products__cart[data-product-id="${id}"]`);
    if (addToCartButton) {
        const isInBasket = updatedBasket.some(item => String(item.id) === String(id));
        const buttonText = addToCartButton.querySelector('.card-products__cart-text');
        const addImg = addToCartButton.querySelector('.card-products__add-img');

        if (isInBasket) {
            addToCartButton.classList.add('product__cart_active');
            addToCartButton.disabled = true;
            buttonText.textContent = "Added";
            if (addImg) addImg.style.display = "block";
        } else {
            addToCartButton.classList.remove('product__cart_active');
            addToCartButton.disabled = false;
            buttonText.textContent = "Add to Cart";
            if (addImg) addImg.style.display = "none";
        }
    }
}
function quantityCartItem(event) {
    const cartItem = event.target.closest('.burger-cart__item');
    if (!cartItem) {
        return;
    }
    const productId = cartItem.dataset.productId;
    if (!productId) {
        return;
    }
    const quantityButtonMinus = event.target.classList.contains('quantity__button_minus');
    const quantityButtonPlus = event.target.classList.contains('quantity__button_plus');
    const priceElement = document.querySelector('.burger-cart__subtotal-price');
    const quantityInput = cartItem.querySelector('.quantity__input input');
    const priceValue = parseFloat(priceElement.textContent);
    let quantityValue = parseInt(quantityInput.value);

    if (quantityButtonPlus) {
        quantityValue++;
    }
    else if (quantityButtonMinus) {
        quantityValue--;
        if (quantityValue < 1) quantityValue = 1;
    }
    quantityInput.value = quantityValue;
    const newPrice = (priceValue * quantityValue).toFixed(2);
    console.log(newPrice);
    priceElement.textContent = newPrice;
    updateItemQuantityInBasket(productId, quantityValue);
}

function updateItemQuantityInBasket(id, newQuantity) {
    const basketData = getBasketLocalStorage();
    const basket = basketData.basket || [];
    const item = basket.find(product => String(product.id) === String(id));
    if (item) {
        item.quantity = newQuantity;
    }
    setBasketLocalStorage({ basket });
}

export function totalSum() {
    const basketData = getBasketLocalStorage();
    const basketItems = basketData.basket || [];
    const subTotalContainer = document.querySelector('.burger-cart__subtotal-price');
    const totalContainer = document.querySelector('.burger-cart__total-price');
    const discoveryPost = 25;
    let subTotal = 0;
    if (!basketItems.length) {
        if (subTotalContainer && totalContainer) {
            subTotalContainer.textContent = "0.00";
            totalContainer.textContent = "0.00";
        }
        return;
    }
    basketItems.forEach((basketItem) => {
        const product = productsData.find(item => String(item.id) === String(basketItem.id));
        if (product) {
            const post = product.post || 0;
            const quantity = basketItem.quantity || 1;
            subTotal += post * quantity;
        }
    })
    if (subTotalContainer) {
        subTotalContainer.textContent = subTotal.toFixed(2);
    }
    let total = subTotal + discoveryPost;
    if (totalContainer) {
        totalContainer.textContent = total.toFixed(2);
    }
}



function generateItems(arr) {
    arr.forEach(item => {
        let color = item.selectedColor || 'unknown';
        const formattedColor = typeof color === 'string' ? color.charAt(0).toUpperCase() + color.slice(1) : 'Unknown';
        console.log(formattedColor);

        const quantity = item.quantity || 1;
        const cartItem =
            `
<div class="burger-cart__item item-cart" data-product-id="${item.id}">
    <div class="item-cart__img">
        <img src="${item.image}" alt="">
    </div>
    <div class="item-cart__parameters">
        <div class="item-cart__title">${item.title}</div>
        <div class="item-cart__color">Color: ${formattedColor}</div>
        <div class="item-cart__quantity">
            <div class="quantity">
                <button type="button" class="quantity__button quantity__button_plus"></button>
                <div class="quantity__input">
                    <input autocomplete="off" type="text" name="form[]" value="${quantity}">
                </div>
                <button type="button" class="quantity__button quantity__button_minus"></button>
            </div>
        </div>
    </div>
    <div class="item-cart__right-block">
        <div class="item-cart__price"><span>${item.post}</span></div>
        <div class="item-cart__delete">
            <img src="../../img/svg/close-item-cart.svg" alt="">
        </div>
    </div>
</div>
            `;
        cartItems.insertAdjacentHTML('beforeend', cartItem);
    });
}