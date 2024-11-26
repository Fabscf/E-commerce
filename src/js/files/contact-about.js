const form = document.querySelector('.form-about');
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Останавливает стандартное поведение формы (отправку)
        window.location.reload(); // Перезагружает страницу
    })
};