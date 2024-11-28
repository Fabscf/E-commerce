import {
    ERROR_SERVER,
} from './constants.js';
import {
    showErrorMessage,
    checkingRelevanceValueBasket,
    checkingRelevanceValueFavorite,
    setBasketLocalStorage,
    setFavoriteLocalStorage,
    getBasketLocalStorage,
    getFavoriteLocalStorage,
    updateCartCount,
} from './utils.js';
import {
    formRating,
} from './forms/forms.js';
import {
    loadProductBasket,
    totalSum
} from './burgerCart.js';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { Thumbs } from 'swiper/modules';
import "../../scss/base/swiper.scss";
import 'swiper/css';
import 'swiper/css/navigation';
let productsData = [];
const cartBurger = document.querySelector('.header__cart-burger');
getProducts();

async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('/E-commerce/data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }

        loadProductDetails(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err);
    }
}

function getParameterFromURL(parametr) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametr);
}

function loadProductDetails(data) {
    // Проверка на корректность данных
    if (!data || data.length === 0) {
        showErrorMessage(ERROR_SERVER);
        return;
    }

    checkingRelevanceValueBasket(data);
    checkingRelevanceValueFavorite(data);

    const productId = getParameterFromURL('id');

    if (!productId) {
        return;
    }

    const findProduct = data.find(card => card.id == productId);
    if (!findProduct) {
        return;
    }
    renderInfoProduct(findProduct);
    formRating();
    timer();
    chooseColor();
    formQuantity();
    if (document.querySelector('.thumbs-images')) {
        const thumbsSwiper = new Swiper('.thumbs-images', {
            modules: [Thumbs],
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            spaceBetween: 24,
            speed: 800,
        });
        new Swiper('.product__slider', {
            modules: [Navigation, Thumbs],
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 40,
            speed: 800,
            thumbs: {
                swiper: thumbsSwiper
            },
            navigation: {
                prevEl: '.control-block__prev',
                nextEl: '.control-block__next'
            },
        });
    }
    const basketData = getBasketLocalStorage();
    const wishlist = getFavoriteLocalStorage();
    const basket = basketData.basket || [];
    const cartButton = document.querySelector('.product__cart');
    const cartButtonImg = document.querySelector('.product__cart-img');
    const wishButtonImg = document.querySelector('.product__wish-img');
    const wishButtonImg2 = document.querySelector('.product__wish-img_added');
    const wishlistButton = document.querySelector('.product__wish');
    const isInBasket = basket.some(item => item.id == productId);
    const isInWishlist = wishlist.includes(productId);
    if (isInBasket) {
        cartButton.classList.add('product__cart_active');
        cartButton.disabled = true;
        cartButtonImg.style.display = "block";
        cartButton.querySelector('.card-products__cart-text').textContent = "Added";
    }
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            const quantity = parseInt(document.querySelector('.quantity__input input').value) || 1;
            let color;
            const colorElement = document.querySelector('.color__item_active');
            if (colorElement) {
                color = colorElement.getAttribute('data-color');
            } else {
                const product = productsData.find(item => item.id == productId);
                color = product.dataColor && product.dataColor.length > 0 ? product.dataColor[0] : 'unknown';
            }
            const basketData = getBasketLocalStorage();
            const basket = basketData.basket || [];
            const isInBasket = basket.some(item => item.id == productId && item.selectedColor === color);
            if (!isInBasket) {
                basket.push({
                    id: productId,
                    quantity: quantity,
                    selectedColor: color
                });
                setBasketLocalStorage({ basket });
                cartButton.classList.add('product__cart_active');
                cartButton.disabled = true;
                cartButtonImg.style.display = "block";
                cartButton.querySelector('.card-products__cart-text').textContent = "Added";
            } else {
            }
            loadProductBasket(productsData);
            totalSum();
        });
    }
    if (wishlistButton) {
        wishlistButton.addEventListener('click', () => {
            if (!isInWishlist) {
                wishlist.push(productId);
                setFavoriteLocalStorage(wishlist);

                wishlistButton.classList.add('product__wish_active');
                wishlistButton.disabled = true;
                wishButtonImg.style.display = "none";
                wishButtonImg2.style.display = "block";
                wishlistButton.querySelector('.product__wish-text').textContent = "Added";

            }
        });
    }
}

function renderInfoProduct(product) {
    const productInner = document.getElementById('product-inner');
    let colorItems = "";
    product.color.forEach((color, index) => {
        const colorData = product.dataColor[index] || "";
        const isActive = index === 0 ? "color__item_active" : "";
        colorItems += `<div class="color__item ${isActive}" data-color="${colorData}">
                            <img src="${color}" alt="">
                        </div>`;
    })

    const card = ` <div class="product__slider swiper"> 
                <div class="product__wrapper swiper-wrapper">
                    <div class="product__slide swiper-slide">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="product__slide swiper-slide">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="product__slide swiper-slide">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="product__slide swiper-slide">
                        <img src="${product.image}" alt="">
                    </div>
                </div>
                <div class="control-block__nav">
                    <button class="swiper-button-prev control-block__prev">
                        <img src="../../img/arrows/left.svg" alt="left">
                    </button>
                    <button class="swiper-button-next control-block__next">
                        <img src="../../img/arrows/right.svg" alt="right">
                    </button>
                </div>
                <div class="product__thumbs thumbs-images swiper">
                    <div class="thumbs-images__wrapper swiper-wrapper">
                        <div class="thumbs-images__slide swiper-slide">
                            <img src="${product.image}" alt="image">
                        </div>
                        <div class="thumbs-images__slide swiper-slide">
                            <img src="${product.image}" alt="image">
                        </div>
                        <div class="thumbs-images__slide swiper-slide">
                            <img src="${product.image}" alt="image">
                        </div>
                        <div class="thumbs-images__slide swiper-slide">
                            <img src="${product.image}" alt="image">
                        </div>
                    </div>
                </div>
            </div >
            <div class="product__body" data-product-id="${product.id}">
                <div class="rating rating_set product__rating">
                    <div class="rating__body">
                        <div class="rating__active"></div>
                        <div class="rating__items">
                            <input type="radio" class="rating__item" value="1" name="rating">
                                <input type="radio" class="rating__item" value="2" name="rating">
                                    <input type="radio" class="rating__item" value="3" name="rating">
                                        <input type="radio" class="rating__item" value="4" name="rating">
                                            <input type="radio" class="rating__item" value="5" name="rating">
                                            </div>
                                        </div>
                                        <div class="rating__value">5</div>
                                        <div class="rating__info" data-goto=".other__block" data-goto-top="100px">11 Reviews</div>
                                    </div>
                                    <h3 class="product__title">${product.title}</h3>
                                    <p class="product__description">${product.description}</p>
                                    <div class="product__block-post">
                                        <span class="product__post">$${product.post}</span>
                                        <span class="product__prev-post">$${product.prevPost}</span>
                                    </div>
                                    <div class="product__offer offer">
                                        <h5 class="offer__title">Offer expires in:</h5>
                                        <div class="offer__timer timer">
                                            <div class="timer__item">
                                                <div class="timer__time timer__days">00</div>
                                                <div class="timer__text">Days</div>
                                            </div>
                                            <div class="timer__item">
                                                <div class="timer__time timer__hours">00</div>
                                                <div class="timer__text">Hours</div>
                                            </div>
                                            <div class="timer__item">
                                                <div class="timer__time timer__minutes">00</div>
                                                <div class="timer__text">Minutes</div>
                                            </div>
                                            <div class="timer__item">
                                                <div class="timer__time timer__seconds">00</div>
                                                <div class="timer__text">Seconds</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="product__size size">
                                        <h5 class="size__title">Measurements</h5>
                                        <span class="size__info">17 1/2x20 5/8 "</span>
                                    </div>
                                    <div class="product__color color">
                                        <h5 class="color__title">Choose Color</h5>
                                        <span class="color__text"></span>
                                        <div class="color__body">
                                            ${colorItems}             
                                        </div>
                                    </div>
                                    <div class="product__wish-block">
                                       <div class="quantity">
                                            <button type="button" class="quantity__button quantity__button_minus"></button>
                                                <div class="quantity__input">
                                                    <input autocomplete="off" type="text" name="form[]" value="1">
                                                </div>
                                            <button type="button" class="quantity__button quantity__button_plus"></button>
                                        </div>
                                        <button class="product__wish" type="button">
                                            <svg class="product__wish-img" width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6924 3.91706C11.3055 4.28838 10.6945 4.28838 10.3076 3.91706L9.6152 3.2526C8.80477 2.47487 7.70994 2 6.5 2C4.01472 2 2 4.01472 2 6.5C2 8.88263 3.28979 10.8501 5.15176 12.4666C7.01532 14.0844 9.2434 15.1574 10.5746 15.7051C10.853 15.8196 11.147 15.8196 11.4254 15.7051C12.7566 15.1574 14.9847 14.0844 16.8482 12.4666C18.7102 10.85 20 8.88262 20 6.5C20 4.01472 17.9853 2 15.5 2C14.2901 2 13.1952 2.47487 12.3848 3.2526L11.6924 3.91706ZM11 1.80957C9.83211 0.688804 8.24649 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 12.8683 6.97034 16.385 9.81379 17.5547C10.5796 17.8697 11.4204 17.8697 12.1862 17.5547C15.0297 16.385 22 12.8682 22 6.5C22 2.91015 19.0899 0 15.5 0C13.7535 0 12.1679 0.688804 11 1.80957Z" fill="#141718"/>
                                            </svg>
                                            <svg class="product__wish-img_added" width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path clip-rule="evenodd" d="M11.6924 3.91706C11.3055 4.28838 10.6945 4.28838 10.3076 3.91706L9.6152 3.2526C8.80477 2.47487 7.70994 2 6.5 2C4.01472 2 2 4.01472 2 6.5C2 8.88263 3.28979 10.8501 5.15176 12.4666C7.01532 14.0844 9.2434 15.1574 10.5746 15.7051C10.853 15.8196 11.147 15.8196 11.4254 15.7051C12.7566 15.1574 14.9847 14.0844 16.8482 12.4666C18.7102 10.85 20 8.88262 20 6.5C20 4.01472 17.9853 2 15.5 2C14.2901 2 13.1952 2.47487 12.3848 3.2526L11.6924 3.91706ZM11 1.80957C9.83211 0.688804 8.24649 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 12.8683 6.97034 16.385 9.81379 17.5547C10.5796 17.8697 11.4204 17.8697 12.1862 17.5547C15.0297 16.385 22 12.8682 22 6.5C22 2.91015 19.0899 0 15.5 0C13.7535 0 12.1679 0.688804 11 1.80957Z" fill="rgb(20, 23, 24)"/>
                                            </svg>
                                            <span class="product__wish-text">
                                                Wishlist
                                            </span>
                                        </button>
                                    </div>
                                    <button class="product__cart" data-product-id="${product.id}">
                                        <svg class="product__cart-img" fill="#fff" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="check-circle" class="icon glyph"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,8.71-5,5a1,1,0,0,1-1.42,0l-3-3a1,1,0,1,1,1.42-1.42L11,13.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"></path></svg>
						                </svg>
                                        <span class="card-products__cart-text">
                                            Add to cart
                                        </span>
                                    </button>
                                    <div class="product__table table-product">
                                        <div class="table-product__label">SKU</div>
                                        <div class="table-product__value">${product.articul}</div>
                                        <div class="table-product__label">CATEGORY</div>
                                        <div class="table-product__value">${product.category}</div>
                                    </div>
                                </div>`;
    productInner.insertAdjacentHTML('beforeend', card);

}
cartBurger.addEventListener('click', function (event) {
    const targetButton = event.target.closest('.item-cart__delete');
    if (!targetButton) return;
    event.stopPropagation();

    const cartItem = targetButton.closest('.burger-cart__item');
    const id = cartItem.dataset.productId;

    // Получаем корзину и обновляем её
    const basketData = getBasketLocalStorage();
    const updatedBasket = basketData.basket.filter(item => String(item.id) !== String(id));
    setBasketLocalStorage({ basket: updatedBasket });

    // Удаляем товар из DOM

    // Ищем товар в массиве data

    // Обновляем состояние кнопки добавления товара
    const addToCartButton = document.querySelector(`.product__cart[data-product-id="${id}"]`);
    if (addToCartButton) {
        const isInBasket = updatedBasket.some(item => String(item.id) === String(id));
        console.log(isInBasket);
        const buttonText = addToCartButton.querySelector('.card-products__cart-text');
        const addImg = addToCartButton.querySelector('.product__cart-img');

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
    const findProduct = productsData.find(card => card.id == id); // Используем id, а не productId, так как id — переменная товара
    if (findProduct) {
        console.log("Товар найден: ", findProduct); // Вы можете выполнить любые действия с найденным товаром
    } else {
        console.log("Товар не найден");
    }
    cartItem.remove();
});

function chooseColor() {
    const colorContainer = document.querySelector('.color__body');
    const colorText = document.querySelector('.color__text');
    const firstColorItem = colorContainer.querySelector('.color__item');
    const cartButton = document.querySelector('.product__cart');
    const cartButtonImg = document.querySelector('.product__cart-img');
    if (firstColorItem.classList.contains('color__item_active')) {
        const colorItemData = firstColorItem.getAttribute('data-color');
        const firstLetter = colorItemData.charAt(0).toUpperCase();
        const lastPart = colorItemData.slice(1);
        const fullColorText = firstLetter + lastPart;
        colorText.textContent = fullColorText;
    }
    colorContainer.addEventListener("click", (event) => {
        const target = event.target.closest('.color__item');
        if (target) {
            if (!target.classList.contains('color__item_active')) {
                document.querySelectorAll('.color__item').forEach((item) => {
                    item.classList.remove('color__item_active');
                });
                target.classList.add('color__item_active');
            }
            const colorItemData = target.getAttribute('data-color');
            const firstLetter = colorItemData.charAt(0).toUpperCase();
            const lastPart = colorItemData.slice(1);
            const fullColorText = firstLetter + lastPart;
            colorText.textContent = fullColorText;
            cartButton.disabled = false;
            cartButton.classList.remove('product__cart_active');
            cartButton.querySelector('.card-products__cart-text').textContent = "Add to Cart";
            cartButtonImg.style.display = "none";
        }
    });
}
function formQuantity() {
    document.addEventListener("click", function (e) {
        let targetElement = e.target;
        if (targetElement.closest('.burger-cart')) {
            return; // Прерываем выполнение, если это корзина
        }
        if (targetElement.closest('.quantity__button')) {
            let quantityInput = targetElement.closest('.quantity').querySelector('input');
            let value = parseInt(quantityInput.value);
            if (targetElement.classList.contains('quantity__button_plus')) {
                value++;
            } else {
                value--;
                if (value < 1) value = 1;
            }
            quantityInput.value = value;
        }
    });
}
function timer() {
    const deadline = new Date(2024, 8, 31); // 1 июля 2024 года

    let timerId = null;

    function countdownTimer() {
        const diff = deadline - new Date();

        if (diff <= 0) {
            clearInterval(timerId);
        }

        const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
        const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
        const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
        const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;


        if ($days && $hours && $minutes && $seconds) {
            $days.textContent = days < 10 ? '0' + days : days;
            $hours.textContent = hours < 10 ? '0' + hours : hours;
            $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
            $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
        }
    }

    const $days = document.querySelector('.timer__days');
    const $hours = document.querySelector('.timer__hours');
    const $minutes = document.querySelector('.timer__minutes');
    const $seconds = document.querySelector('.timer__seconds');


    if ($days && $hours && $minutes && $seconds) {
        timerId = setInterval(countdownTimer, 1000);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});