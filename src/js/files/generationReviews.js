let reviewsData = [];

getReviews();

async function getReviews() {
	try {
		if (!reviewsData.length) {
			const res = await fetch('/E-commerce/data/reviews.json');
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			reviewsData = await res.json();
		}

		loadReviews(reviewsData);

	} catch (err) {
		console.log(err);
	}
}

function loadReviews(data) {
	// Проверка на корректность данных
	if (!data || data.length === 0) {
		return;
	}

	generateReviews(data); // Передаем массив данных в функцию generateReviews
}

function generateReviews(data) {
	const reviewInner = document.querySelector('.other__reviews');

	data.forEach(review => {  // Перебираем каждый элемент массива
		const reviewHtml = `<div class="reviews__item">
								<div class="reviews__avatar">
									<img src="${review.avatar}" alt="user_avatar">
								</div>
								<div class="reviews__inner">
									<div class="reviews__info">
										<span class="reviews__name">${review.name}</span>
										<span class="reviews__surname">${review.surname}</span>
									</div>
									<ul class="reviews__rating-list">
										<li class="reviews__rating-item">
											<img src="/E-commerce/img/svg/star-rating.svg" alt="">
										</li>
										<li class="reviews__rating-item">
											<img src="/E-commerce/img/svg/star-rating.svg" alt="">
										</li>
										<li class="reviews__rating-item">
											<img src="/E-commerce/img/svg/star-rating.svg" alt="">
										</li>
										<li class="reviews__rating-item">
											<img src="/E-commerce/img/svg/star-rating.svg" alt="">
										</li>
										<li class="reviews__rating-item">
											<img src="/E-commerce/img/svg/star-rating.svg" alt="">
										</li>
									</ul>
									<div class="reviews__text">
										<p>I bought it 3 weeks ago and now come back just to say “Awesome Product”.
											I really enjoy it. At vero eos et accusamus et iusto odio dignissimos
											ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas
											molestias excepturi sint non provident.</p>
									</div>
									<div class="reviews__buttons">
										<span class="reviews__time">about 1 hour ago</span>
										<button type="button" class="reviews__button-text">
											Like
										</button>
										<button type="button" class="reviews__button-text">
											Reply
										</button>
									</div>
								</div>
							</div>`;
		if (reviewInner) {
			reviewInner.insertAdjacentHTML('beforeend', reviewHtml);
		}
	});
}