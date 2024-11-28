import {
    getBasketLocalStorage,
    setBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';
// import { loadProductBasket } from './burgerCart.js';

const cart = document.querySelector('.cart');
const cartItemsContainer1 = document.querySelector('.products-body__items');
const cartItemsContainer2 = document.querySelector('.order-summary__items');
const cartItemsContainer3 = document.querySelector('.completed-body__items');

let productsData = [];
getProducts();

if (cart) {
    cart.addEventListener('click', function (event) {
        const targetButton = event.target.closest('.item-body__button');
        if (!targetButton) return;
        event.stopPropagation();
        handleDeleteCartItem(targetButton); // Вызов функции для удаления товара
    });
}
if (cart) {
    cart.addEventListener('click', function (event) {
        quantityCartItem(event);
        totalSum();
    });
}


async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('/E-commerce/data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }
        loadProductBasket(productsData);
    } catch (err) {
        console.log(err);
    }
}

function loadProductBasket(data) {
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
            product.selectedColor = product.selectedColor || product.dataColor[0]; // Выбранный цвет или первый по умолчанию
            product.quantity = product.quantity || 1; // Количество
        }
    });
    generateItems1(findProducts);
    generateItems2(findProducts);
    generateItems3(findProducts);
    totalSum();
}


function handleDeleteCartItem(targetButton) {
    const cartItem = targetButton.closest('.item-body');
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
    const subTotalContainer = document.querySelector('.cart__subtotal-price');
    const totalContainer = document.querySelector('.cart__total-price');
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

function stepCart() {
    if (window.location.pathname.includes('cart.html')) {
        const steps = document.querySelectorAll('.cart-step');
        const step2 = document.getElementById('to-step-2');
        const step3 = document.getElementById('to-step-3');
        const stepNumbers = document.querySelectorAll('.steps-cart__item');
        let currentStep = 0;
        if (step2) {
            step2.addEventListener('click', () => {
                if (currentStep === 0) {
                    currentStep++;
                    console.log("Переход на шаг 2");
                    updateStepsCart();
                }
            });
        }
        if (step3) {
            step3.addEventListener('click', () => {
                if (currentStep === 1) {
                    currentStep++;
                    console.log("Переход на шаг 3");
                    updateStepsCart();
                    const basketData = getBasketLocalStorage();
                    const basket = basketData.basket || [];
                    setBasketLocalStorage({ basket: []});

                }
            });
        }
        function updateStepsCart() {
            steps.forEach((step, index) => {
                step.classList.remove('cart-step--active');
                stepNumbers[index]?.classList.remove('steps-cart__item--active', 'steps-cart__item--succes');
                if (index < currentStep) {
                    stepNumbers[index]?.classList.add('steps-cart__item--succes');
                }
            });

            steps[currentStep]?.classList.add('cart-step--active');
            stepNumbers[currentStep]?.classList.add('steps-cart__item--active');
        }
        updateStepsCart();
    }
}
stepCart();



function generateItems1(arr) {
    if (!cartItemsContainer1) return;
    arr.forEach(item => {
        // Получаем цвет из item.selectedColor или используем 'unknown', если он не установлен
        let color = item.selectedColor || 'unknown';

        // Проверяем, что color является строкой перед использованием charAt()
        const formattedColor = typeof color === 'string' ? color.charAt(0).toUpperCase() + color.slice(1) : 'Unknown';

        const quantity = item.quantity || 1;
        const cartItem =
            `
    <div class="products-body__item item-body" data-product-id="${item.id}">
                <div class="item-body__left">
                    <div class="item-body__img">
                        <img src="${item.image}" alt="productImg">
                    </div>
                    <div class="item-body__info">
                        <div class="item-body__title">${item.title}</div>
                        <div class="item-body__color-body">Color: <span
                            class="item-body__color">${formattedColor}</span></div>
                        <button type="button" class="item-body__button">
                            <img src="../../img/svg/close-item-cart.svg" alt="remove">
                                Remove</button>
                    </div>
                </div>
                <div class="item-body__quantity quantity">
                    <button type="button"
                        class="quantity__button quantity__button_minus"></button>
                    <div class="quantity__input item-body__quantity-input">
                        <input autocomplete="off" type="text" name="form[]" value="${quantity}">
                    </div>
                    <button type="button"
                        class="quantity__button quantity__button_plus"></button>
                </div>
                <div class="item-body__price">${item.post}</div>
                <div class="item-body__subtotal">${item.prevPost}</div>
            </div>`;

        cartItemsContainer1.insertAdjacentHTML('beforeend', cartItem);
    });
}
function generateItems2(arr) {
    if (!cartItemsContainer2) return;
    arr.forEach(item => {
        // Получаем цвет из item.selectedColor или используем 'unknown', если он не установлен
        let color = item.selectedColor || 'unknown';

        // Проверяем, что color является строкой перед использованием charAt()
        const formattedColor = typeof color === 'string' ? color.charAt(0).toUpperCase() + color.slice(1) : 'Unknown';

        const quantity = item.quantity || 1;
        const cartItem =
            `
    <div class="order-summary__item item-order" data-product-id="${item.id}">
    <div class="item-order__left">
        <div class="item-order__img">
            <img src="${item.image}" alt="productImg">
        </div>
        <div class="item-order__info">
            <div class="item-order__title">${item.title}</div>
            <div class="item-order__color-body">Color:
                <span class="item-order__color">${formattedColor}</span>
            </div>
            <div class="item-order__quantity quantity">
                <button type="button"
                    class="quantity__button quantity__button_minus"></button>
                <div class="quantity__input item-order__quantity-input">
                    <input autocomplete="off" type="text" name="form[]"
                        value=${quantity}>
                </div>
                <button type="button"
                    class="quantity__button quantity__button_plus"></button>
            </div>
        </div>
    </div>
    <div class="item-order__subtotal">${item.prevPost}</div>
</div>`;

        cartItemsContainer2.insertAdjacentHTML('beforeend', cartItem);
    });
}
function generateItems3(arr) {
    if (!cartItemsContainer3) return;
    arr.forEach(item => {
        // Получаем цвет из item.selectedColor или используем 'unknown', если он не установлен
        let color = item.selectedColor || 'unknown';

        // Проверяем, что color является строкой перед использованием charAt()
        const formattedColor = typeof color === 'string' ? color.charAt(0).toUpperCase() + color.slice(1) : 'Unknown';

        const quantity = item.quantity || 1;
        const cartItem =
            `<div class="completed-body__item completed-item">
            <img src="${item.image}" alt="">
            <div class="completed-body__quantity">${quantity}</div>
            </div>`;

        cartItemsContainer3.insertAdjacentHTML('beforeend', cartItem);
    });

}