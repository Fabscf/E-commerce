
// Подключение из node_modules
import tippy from 'tippy.js';

// Подключение cтилей из src/scss/libs
import "../../scss/libs/tippy.scss";
import {
    showErrorMessage,
    setBasketLocalStorage,
    setFavoriteLocalStorage,
    getBasketLocalStorage,
    getFavoriteLocalStorage,
    checkingRelevanceValueBasket,
    checkingRelevanceValueFavorite
} from './utils.js';
import {
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';
import {
    loadProductBasket,
    totalSum
} from './burgerCart.js';
import { formRating } from './forms/forms.js';
const domElements = {
    shopBody: document.getElementById('catalog-shop__body'),
    search: {
        input: document.getElementById('search-input'),
        button: document.getElementById('search-button')
    },
    filters: {
        category: document.getElementById('category-filter'),
        price: document.getElementById('price-filter')
    },
    sorting: {
        price: document.getElementById('sort_button-price'),
        popular: document.getElementById('sort_button-popular')
    }
};


let productsData = [];
let filteredData = [];  // Данные после фильтрации
let selectedCategory = "All Rooms"; // Выбранная категория по умолчанию
let minPrice = 0;
let maxPrice = Infinity;

getProducts();

// Генерация HTML карточек
function generateCards(data) {
    return data.map(product => `
        <div class="catalog-shop__item">
            <article class="products__card card-products" data-product-id="${product.id}">
                <div class="card-products__wishlist">
					<span class="card-products__wishlist-text">Product added to <a
				        class="card-products__wishlist-link" href="profile.html">favorites</a></span>
			    </div>
                <div class="card-products__promotion">
                    <span class="card-products__new">NEW</span>
                    <span class="card-products__sale">-50%</span>
                </div>
                <div class="card-products__buttons">
                    <button data-tippy-content="Add to wishlist" class="card-products__favorite">
                        <svg class="card-products__wish-img" width="24" height="24" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6924 3.91706C11.3055 4.28838 10.6945 4.28838 10.3076 3.91706L9.6152 3.2526C8.80477 2.47487 7.70994 2 6.5 2C4.01472 2 2 4.01472 2 6.5C2 8.88263 3.28979 10.8501 5.15176 12.4666C7.01532 14.0844 9.2434 15.1574 10.5746 15.7051C10.853 15.8196 11.147 15.8196 11.4254 15.7051C12.7566 15.1574 14.9847 14.0844 16.8482 12.4666C18.7102 10.85 20 8.88262 20 6.5C20 4.01472 17.9853 2 15.5 2C14.2901 2 13.1952 2.47487 12.3848 3.2526L11.6924 3.91706ZM11 1.80957C9.83211 0.688804 8.24649 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 12.8683 6.97034 16.385 9.81379 17.5547C10.5796 17.8697 11.4204 17.8697 12.1862 17.5547C15.0297 16.385 22 12.8682 22 6.5C22 2.91015 19.0899 0 15.5 0C13.7535 0 12.1679 0.688804 11 1.80957Z" fill="rgb(108, 114, 117)"/>
                        </svg>
                    </button>
                    <button class="card-products__cart" data-product-id="${product.id}">       
                        <svg class="card-products__add-img" fill="#fff" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="check-circle" class="icon glyph"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,8.71-5,5a1,1,0,0,1-1.42,0l-3-3a1,1,0,1,1,1.42-1.42L11,13.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"></path></svg>
						</svg>
                        <span class="card-products__cart-text">
                            Add to cart
                        </span>
                    </button>
                </div>
                <a href="/E-commerce/product-card.html?id=${product.id}" class="card-products__img">
                    <img src="${product.image}" alt="">
                </a>
                <div class="card-products__info">
                    <div class="card-products__body">
                        <div class="rating rating_set">
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
                            <div hidden class="rating__value">3.2</div> 
                        </div>
                        <div class="card-products__main card-products__main_columns">
                            <h6 class="card-products__title">
                                <a href="/E-commerce/product-card.html?id=${product.id}" class="card-products__link-title">
                                    ${product.title}
                                </a>
                            </h6>
                            <div class="card-products__priceBlock">
                                <span class="card-products__price">$${product.post}</span>
                                <span class="card-products__price_prev">$${product.prevPost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `).join('');
}

// Получение данных о продуктах
async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('/E-commerce/data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }

        renderStartPage(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err);
    }
}
// Рендеринг начальной страницы
function renderStartPage(data) {
    if (!data || data.length === 0) {
        showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
        return;
    }
    renderCards(data);

    checkingRelevanceValueFavorite(data);
    checkingRelevanceValueBasket(data);
    const wish = getFavoriteLocalStorage();
    const basket = getBasketLocalStorage();

    checkingActiveButtons(basket);
    checkingFavoriteButtons(wish);
}

function checkingActiveButtons(basketData) {
    // Проверяем, что basketData — объект и содержит массив товаров
    if (!basketData || !Array.isArray(basketData.basket)) return;

    const basket = basketData.basket;  // Получаем массив товаров из объекта

    const buttons = document.querySelectorAll('.card-products__cart');

    buttons.forEach(btn => {
        const card = btn.closest('.card-products');
        if (card) {
            const id = card.dataset.productId;
            // Проверяем, есть ли товар с этим id в корзине
            const isInBasket = basket.some(item => item.id === id);

            // Если товар есть в корзине, кнопка становится неактивной
            btn.disabled = isInBasket;
            btn.classList.toggle('card-products__cart_active', isInBasket);

            const buttonText = btn.querySelector('.card-products__cart-text');
            const addImg = btn.querySelector('.card-products__add-img');

            if (isInBasket) {
                buttonText.textContent = "Added"; // Изменяет текст только внутри текущей кнопки
                if (addImg) addImg.style.display = "block";  // Показывает изображение только для текущей кнопки
            } else {
                buttonText.textContent = "Add to cart"; // Восстановление текста для кнопки
                if (addImg) addImg.style.display = "none";  // Скрывает изображение для кнопки, если элемент не в корзине
            }
        }
    });
}

function checkingFavoriteButtons(wish) {
    if (!Array.isArray(wish)) return;  // Защитная проверка
    const buttons = document.querySelectorAll('.card-products__favorite');

    buttons.forEach(btn => {
        const card = btn.closest('.card-products');
        if (card) {
            const id = card.dataset.productId;
            const isInWishList = wish.includes(id);

            btn.disabled = isInWishList;
            btn.classList.toggle('card-products__favorite_active', isInWishList);

            const wishImg = btn.querySelector('.card-products__wish-img');

            if (!isInWishList) {
                return;
            } else {
                wishImg.classList.toggle('card-products__favorite_active');
            }
        }
    });
}
function handleCardClick(event, productsData) {
    const targetButton = event.target.closest('.card-products__cart');
    if (!targetButton) return;

    const card = targetButton.closest('.card-products');
    const id = card.dataset.productId;
    const product = productsData.find(item => item.id == id);

    // Если на странице каталога, берем первый цвет по умолчанию
    // const color = product.dataColor ? product.dataColor[0] : 'unknown'; // Дефолтный цвет
    const color = Array.isArray(product.dataColor) && product.dataColor.length > 0 ? product.dataColor[0] : 'unknown';
    console.log(`Выбранный цвет для товара ID ${id}:`, color);

    const quantity = 1;
    const basketData = getBasketLocalStorage();  // Получаем объект из localStorage
    const basket = basketData.basket || [];  // Получаем массив корзины из объекта

    // Проверяем, есть ли товар уже в корзине
    const isInBasket = basket.some(item => item.id === id);

    if (isInBasket) return;  // Если товар уже в корзине, ничего не делаем

    // Добавляем товар в корзину
    basket.push({ id: id, quantity: quantity, selectedColor: color });
    setBasketLocalStorage({ basket });

    // Обновляем состояние кнопок
    checkingActiveButtons({ basket });
    console.log(productsData);
    // Передаем productsData для обновления корзины
    loadProductBasket(productsData);
    totalSum();
}

// function handleCardClick(event, productsData) {
//     const targetButton = event.target.closest('.card-products__cart');
//     if (!targetButton) return;

//     const card = targetButton.closest('.card-products');
//     const id = card.dataset.productId; // Получаем ID товара
//     const quantity = 1;

//     // Находим продукт по ID из списка productsData
//     const product = productsData.find(item => String(item.id) === String(id));

//     if (!product) {
//         console.error(`Продукт с ID ${id} не найден`);
//         return;
//     }

//     // Используем первый цвет из массива цветов товара
//     const color = product.dataColor[0] || "black"; // По умолчанию "black", если массив пуст
//     console.log(`Выбранный цвет для товара ID ${id}:`, color);

//     const basketData = getBasketLocalStorage();  // Получаем объект из localStorage
//     const basket = basketData.basket || [];  // Получаем массив корзины из объекта

//     // Проверяем, есть ли товар уже в корзине
//     const isInBasket = basket.some(item => item.id === id); // Вернет true, если товар в корзине

//     if (isInBasket) return;  // Если товар уже в корзине, ничего не делаем

//     // Добавляем товар в корзину с выбранным цветом
//     basket.push({ id: id, quantity: quantity, color: color });
//     console.log({ basket });

//     // Сохраняем обновленные данные в localStorage
//     setBasketLocalStorage({ basket });

//     // Обновляем состояние кнопок
//     checkingActiveButtons({ basket });

//     // Передаем productsData для обновления корзины
//     if (productsData && productsData.length) {
//         loadProductBasket(productsData);
//     } else {
//         console.error("Ошибка: данные о продуктах не были переданы");
//     }
// }


window.addEventListener('DOMContentLoaded', () => {
    const basket = getBasketLocalStorage(); // Получаем данные корзины из LS
    checkingActiveButtons(basket); // Проверяем и обновляем состояние кнопок
});

function handleFavoriteClick(event) {
    const targetButton = event.target.closest('.card-products__favorite');
    if (!targetButton) return;

    const card = targetButton.closest('.card-products');
    const id = card.dataset.productId;
    const wish = getFavoriteLocalStorage();

    if (wish.includes(id)) return;

    wish.push(id);
    console.log('Click on favorite button');
    setFavoriteLocalStorage(wish);
    console.log('Current wish array before:', wish);
    checkingFavoriteButtons(wish);
    console.log('Current wish array after:', wish);
}
// Привязка события к родительскому контейнеру после рендеринга карточек
function initializeCardClickEvents() {
    if (domElements.shopBody) {
        domElements.shopBody.addEventListener('click', function (event) {
            handleFavoriteClick(event);
            handleCardClick(event, productsData);
        });
        if (!domElements.shopBody) {
            return;
        }
    }
}
// Управление избранными карточками товаров
function initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.card-products__favorite');

    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const img = button.querySelector('svg');
                const path = img.querySelector('path');
                const isActive = button.classList.contains('active');

                if (isActive) {
                    path.setAttribute("fill-rule", "evenodd");
                    path.setAttribute("fill", "rgb(108, 114, 117)");
                } else {
                    path.setAttribute("fill-rule", "nonzero");
                    path.setAttribute("fill", "black");
                }
                button.classList.toggle('active');

                const cardWishList = button.closest('.card-products').querySelector('.card-products__wishlist');
                if (button.classList.contains('active')) {
                    cardWishList.style.display = "block";

                    // Запуск таймера для скрытия уведомления через 3 секунды
                    setTimeout(() => {
                        cardWishList.style.display = "none";
                    }, 3000);  // 3000 миллисекунд = 3 секунды
                } else {
                    cardWishList.style.display = "none";
                }
            });
        });
    }
}

// Рендеринг карточек на странице
function renderCards(data) {
    if (domElements.shopBody) {
        // Генерация и вставка новых карточек в DOM
        domElements.shopBody.innerHTML = generateCards(data);
        // Инициализация Tippy.js для новых кнопок
        tippy('.card-products__favorite', {
            content: "Add to wishlist",
            // Настройки Tippy.js
        });

        // Инициализация кнопок "Добавить в избранное"
        initializeFavoriteButtons();

        // Получение актуального значения корзины и обновление состояния кнопок
        const basket = getBasketLocalStorage();
        const wish = getFavoriteLocalStorage();
        checkingActiveButtons(basket);
        checkingFavoriteButtons(wish);
        formRating();
        // Инициализация обработчиков кликов на карточки
        initializeCardClickEvents();
    }
}

// Фильтрация по категории
function filterByCategory(data) {
    if (selectedCategory === "All Rooms") {
        return data; // Если выбрана категория "All Rooms", возвращаем все данные
    } else {
        return data.filter(card => card.category === selectedCategory);
    }
}


// Фильтрация по цене
function filterByPrice(data) {
    return data.filter(card => card.post >= minPrice && card.post <= maxPrice);
}
// Фильтрация по поисковому запросу
function filterSearch(data) {
    const rgx = new RegExp(domElements.search.input.value, "i");
    return data.filter(card => rgx.test(card.title) || rgx.test(card.articul));
}
// Применение всех фильтров
function applyFilters() {
    let filteredData = filterByCategory(productsData); // Фильтрация по категории
    filteredData = filterByPrice(filteredData); // Фильтрация по цене
    filteredData = filterSearch(filteredData); // Фильтрация по поисковому запросу
    renderCards(filteredData); // Отображаем отфильтрованные данные
}

// Сортировка карточек
function sortCards(byPrice = true, ascending = true) {
    filteredData.sort((a, b) => {
        if (byPrice) {
            return ascending ? a.post - b.post : b.post - a.post;
        } else {
            return ascending ? a.popularity - b.popularity : b.popularity - a.popularity;
        }
    });
    renderCards(filteredData);
}

// Обработка клика на кнопку сортировки
function handleSortButtonClick(event, byPrice) {
    const transformValue = window.getComputedStyle(event.target.querySelector('.sort__arrow')).transform;
    let ascending = true;

    if (transformValue.includes('matrix')) {
        const values = transformValue.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
        const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));

        if (angle === 180 || angle === -180) {
            ascending = false;
        }
    }

    sortCards(byPrice, ascending);
}


// Обработка изменения фильтра категории
function handleCategoryFilter(value) {
    selectedCategory = value;
    applyFilters();  // Применяем фильтры
}

// Обработка изменения фильтра цены
function handlePriceFilter(value) {
    if (value.includes("-")) {
        [minPrice, maxPrice] = value.split("-").map(Number);
    } else if (value.includes("+")) {
        minPrice = Number(value.replace("+", ""));
        maxPrice = Infinity;  // Убираем верхнюю границу
    } else {
        minPrice = 0;
        maxPrice = Infinity;  // Сброс фильтра
    }
    applyFilters();  // Применяем фильтры
}

// Отображение кнопок на карточках продуктов при наведении
document.addEventListener('mouseover', (event) => {
    const card = event.target.closest('.card-products');
    if (card) {
        const buttons = card.querySelector('.card-products__buttons');
        if (buttons) {
            buttons.style.display = 'block';
        }
    }
});

document.addEventListener('mouseout', (event) => {
    const card = event.target.closest('.card-products');
    if (card) {
        const buttons = card.querySelector('.card-products__buttons');
        if (buttons) {
            buttons.style.display = 'none';
        }
    }
});


// Остальной код обработки событий
if (domElements.sorting.price) {
    domElements.sorting.price.onclick = (event) => handleSortButtonClick(event, true);
}
if (domElements.sorting.popular) {
    domElements.sorting.popular.onclick = (event) => handleSortButtonClick(event, false);
}
domElements.search.input.oninput = applyFilters;

if (domElements.filters.category) {
    domElements.filters.category.onclick = (event) => {
        if (event.target.classList.contains('category-filter__link')) {
            handleCategoryFilter(event.target.innerHTML);
        }
    };
}

if (domElements.filters.price) {
    domElements.filters.price.onchange = (event) => handlePriceFilter(event.target.value);
}