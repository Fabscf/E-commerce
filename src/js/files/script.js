// Подключение функционала "Чертогов Фрилансера"
// import { isMobile } from "./functions.js";
// Подключение списка активных модулей
// import { flsModules } from "./modules.js";
// document.addEventListener('DOMContentLoaded', function () {
//     // Получаем текущий URL
//     const currentPath = window.location.pathname;

//     // Определяем соответствие пути и элемента меню
//     const menuItems = {
//         '/home.html': 'home-link',
//         '/shop.html': 'shop-link',
//         '/product-card.html': 'product-link',
//         '/contact.html': 'contact-link'
//     };

//     // Получаем id элемента навигации, который должен быть активным
//     const activeLinkId = menuItems[currentPath];
//     // Если такой элемент найден, добавляем ему класс 'active'
//     if (activeLinkId) {
//         const activeLink = document.getElementById(activeLinkId);
//         if (activeLink) {
//             activeLink.classList.add('menu-header__link_active');
//         }
//     }

//     // Закрытие предложения в хедере
//     const offerCloseButton = document.querySelector('.offer-header__close');
//     if (offerCloseButton) {
//         offerCloseButton.addEventListener('click', function () {
//             document.querySelector('.offer-header').style.display = "none";
//             document.querySelector('.header__container').style.paddingTop = '0';
//             document.querySelector('.menu__body').style.bottom = '30px';
//         });
//     }

//     // Логика поиска
//     const searchInput = document.querySelector('.search__input');
//     const searchButton = document.querySelector('.search__button');
//     const search = document.querySelector('.search');
//     const form = document.querySelector('.search__form');

//     if (searchButton && searchInput && form) {
//         searchButton.addEventListener("click", function (event) {
//             if (searchInput) {
//                 event.preventDefault();
//                 searchInput.classList.toggle('search__input_active');
//                 search.classList.toggle('search_active');
//             }
//         });
//     }

//     // Фильтр по категориям
//     const categoryLinks = document.querySelectorAll('.category-filter__link');
//     const catalogTitle = document.querySelector('.catalog-shop__title');

//     if (categoryLinks.length > 0 && catalogTitle) {
//         categoryLinks.forEach(link => {
//             link.addEventListener("click", () => {
//                 categoryLinks.forEach(link => link.classList.remove("category-filter__link_active"));
//                 link.classList.add("category-filter__link_active");
//                 catalogTitle.innerHTML = link.innerHTML;
//             });
//         });
//     }

//     // Управление отображением вида
//     const viewButtons = document.querySelectorAll('.view__button');
//     const viewImgs = document.querySelectorAll('.view__img');
//     const activeColor = '#141718';
//     const inactiveColor = '#6C7275';

//     if (viewButtons.length > 0 && viewImgs.length > 0) {
//         viewButtons.forEach((button, index) => {
//             button.addEventListener("click", () => {
//                 viewImgs.forEach((img, imgIndex) => {
//                     img.querySelectorAll("path").forEach((path) => {
//                         if (imgIndex === index) {
//                             path.setAttribute("fill", activeColor);
//                         } else {
//                             path.setAttribute("fill", inactiveColor);
//                         }
//                     });
//                 });
//             });
//         });
//     }


//     // Спойлер для сортировки
//     const sortSpoller = document.querySelector('.sort__span');
//     const sortSpollerArrow = document.querySelector('.sort__spoller-arrow');
//     const sortButton = document.querySelectorAll('.sort__button');
//     const sortArrow = document.querySelectorAll('.sort__arrow');

//     if (sortSpoller && sortSpollerArrow) {
//         sortSpoller.addEventListener("click", () => {
//             sortSpollerArrow.classList.toggle('sort__spoller-arrow_active');
//         });
//     }

//     if (sortButton.length > 0 && sortArrow.length > 0) {
//         sortButton.forEach((button, index) => {
//             button.addEventListener("click", () => {
//                 // Сначала сбрасываем все стрелки в неактивное состояние
//                 sortArrow.forEach((arrow, i) => {
//                     if (i !== index) { // Если это не текущая стрелка
//                         arrow.classList.add('sort__none');
//                         arrow.style.transform = "rotate(0deg)";
//                     }
//                 });

//                 // Если текущая стрелка скрыта, то показываем её
//                 if (sortArrow[index].classList.contains('sort__none')) {
//                     sortArrow[index].classList.remove('sort__none');
//                     sortArrow[index].style.transform = "rotate(0deg)";
//                 } else {
//                     // Если текущая стрелка показана, переключаем её поворот
//                     if (sortArrow[index].style.transform === "rotate(0deg)") {
//                         sortArrow[index].style.transform = "rotate(-180deg)";
//                     } else {
//                         sortArrow[index].style.transform = "rotate(0deg)";
//                     }
//                 }
//             });
//         });
//     }

    


   

    

// });


