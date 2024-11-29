// import versionNumber from "gulp-version-number";
// import webpHtmlNosvg from "gulp-webp-html-nosvg";
// export const html = () => {
// 	return app.gulp.src(`${app.path.build.html}*.html`)
// 		.pipe(app.plugins.plumber(
// 			app.plugins.notify.onError({
// 				title: "HTML",
// 				message: "Error: <%= error.message %>"
// 			}))
// 		)
// 		.pipe(
// 			app.plugins.if(
// 				app.isWebP,
// 				webpHtmlNosvg()
// 			)
// 		)
// 		.pipe(versionNumber({
// 			'value': '%DT%',
// 			'append': {
// 				'key': '_v',
// 				'cover': 0,
// 				'to': ['css', 'js', 'img']
// 			},
// 			'output': {
// 				'file': 'config/version.json'
// 			}
// 		}))
// 		.pipe(app.gulp.dest(app.path.build.html));
// }

// import fileInclude from "gulp-file-include"; // Подключение gulp-file-include
// import versionNumber from "gulp-version-number";
// import webpHtmlNosvg from "gulp-webp-html-nosvg";

// export const html = () => {
// 	return app.gulp.src(`${app.path.src.html}/*.html`) // Исходные файлы
// 		.pipe(app.plugins.plumber(
// 			app.plugins.notify.onError({
// 				title: "HTML",
// 				message: "Error: <%= error.message %>"
// 			}))
// 		)
// 		.pipe(fileInclude()) // Добавлено для обработки @@include
// 		.pipe(
// 			app.plugins.if(
// 				app.isWebP,
// 				webpHtmlNosvg()
// 			)
// 		)
// 		.pipe(versionNumber({
// 			'value': '%DT%',
// 			'append': {
// 				'key': '_v',
// 				'cover': 0,
// 				'to': ['css', 'js', 'img']
// 			},
// 			'output': {
// 				'file': 'config/version.json'
// 			}
// 		}))
// 		.pipe(app.gulp.dest(app.path.build.html)); // Вывод результата в папку dist
// }


import fileInclude from "gulp-file-include"; // Подключение для обработки включений
import versionNumber from "gulp-version-number"; // Для версионных номеров
import webpHtmlNosvg from "gulp-webp-html-nosvg"; // Для работы с WebP изображениями

export const html = () => {
	return app.gulp.src(`${app.path.src.html}/*.html`) // Исходные HTML файлы
		.pipe(app.plugins.plumber( // Обработка ошибок
			app.plugins.notify.onError({
				title: "HTML",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(fileInclude()) // Обработка включений @@include
		.pipe(
			app.plugins.if(
				app.isWebP, // Добавляем поддержку WebP изображений
				webpHtmlNosvg()
			)
		)
		.pipe(versionNumber({
			'value': '%DT%', // Используем текущую дату как версию
			'append': {
				'key': '_v',
				'cover': 0,
				'to': ['css', 'js', 'img'] // Для всех ресурсов, таких как CSS, JS, изображения
			},
			'output': {
				'file': 'config/version.json' // Сохранение информации о версии
			}
		}))
		.pipe(app.gulp.dest(app.path.build.html)); // Сохраняем результат в папку dist
};
