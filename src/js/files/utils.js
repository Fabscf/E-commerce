// Вывод ошибки
export function showErrorMessage(message) {
    const h1 = document.querySelector('.wrapper h1');
    if (h1) {
        const msg =
            `<div class="error">
            <p>${message}</p>
            <p><a href="/">Перейти к списку товаров!</a></p>
        </div>`;
        h1.insertAdjacentHTML('afterend', msg);
    } else {
        console.error('Element .wrapper h1 not found in DOM');
    }

}

// Получение id из LS
export function getBasketLocalStorage() {
    const cartDataJSON = localStorage.getItem('basket');
    return cartDataJSON ? JSON.parse(cartDataJSON) : { basket: [] }; // Возвращаем объект с массивом, если данных нет
}

// Запись id товаров в LS
export function setBasketLocalStorage(basket) {
    try {
        localStorage.setItem('basket', JSON.stringify(basket));
    } catch (error) {
    }
    updateCartCount();
}

// export function updateCartCount() {
//     const basketData = getBasketLocalStorage();
//     const basketItems = basketData.basket || []; // Извлекаем массив товаров из ключа "basket"
//     const uniqueItemsCount = basketItems.length; // Количество уникальных товаров

//     // Выводим в консоль для проверки

//     // Обновляем текст на всех элементах счётчика
//     const basketCountElements = document.querySelectorAll('.header__cart-count, .wish-cart__cart-count');
//     basketCountElements.forEach(element => {
//         element.textContent = uniqueItemsCount;
//     });
// }
export function updateCartCount() {
    const basketData = getBasketLocalStorage();
    const basketItems = basketData.basket || []; // Извлекаем массив товаров из ключа "basket"
    // Считаем общее количество всех товаров, включая их количество
    const totalItemsCount = basketItems.reduce((total, item) => {
        return total + (item.quantity || 1); // Суммируем количество каждого товара (если quantity отсутствует, считаем 1)
    }, 0);
    // Обновляем текст на всех элементах счётчика
    const basketCountElements = document.querySelectorAll('.header__cart-count, .wish-cart__cart-count');
    basketCountElements.forEach(element => {
        element.textContent = totalItemsCount; // Общее количество товаров
    });
}
// Проверка, существует ли товар указанный в LS 
//(если например пару дней не заходил юзер, а товар, который у него в корзине, уже не существует)
export function checkingRelevanceValueBasket(productsData) {
    const basketData = getBasketLocalStorage();

    // Проверь, что в localStorage хранится объект с ключом "basket", а не массив
    const basket = basketData.basket || [];

    // Проходим по массиву basket и проверяем, существуют ли товары с такими id
    basket.forEach((basketItem, index) => {
        const existsInProducts = productsData.some(item => item.id === Number(basketItem.id));
        if (!existsInProducts) {
            basket.splice(index, 1);  // Удаляем элемент, если его нет в списке продуктов
        }
    });

    // Обновляем localStorage, теперь храним объект с ключом "basket"
    setBasketLocalStorage({ basket });
}


// Получение id из LS
export function getFavoriteLocalStorage() {
    const wishDataJSON = localStorage.getItem('favorite');
    return wishDataJSON ? JSON.parse(wishDataJSON) : [];
}

// Запись id товаров в LS
export function setFavoriteLocalStorage(favorite) {
    const favoriteCount = document.querySelector('.wish-cart__wish-count');
    if (favoriteCount) {
        favoriteCount.textContent = favorite.length;
    }
    localStorage.setItem('favorite', JSON.stringify(favorite));
}

// Проверка, существует ли товар указанный в LS 
//(если например пару дней не заходил юзер, а товар, который у него в избранном, уже не существует)
export function checkingRelevanceValueFavorite(productsData) {
    const favorite = getFavoriteLocalStorage();

    favorite.forEach((favoriteId, index) => {
        const existsInProducts = productsData.some(item => item.id === Number(favoriteId));
        if (!existsInProducts) {
            favorite.splice(index, 1);
        }
    });

    setFavoriteLocalStorage(favorite);
}

