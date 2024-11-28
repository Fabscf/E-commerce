// export const json = () => {
//     return app.gulp.src(`${app.path.src.json}/**/*.json`) // Берем все JSON-файлы из папки src/data
//         .pipe(app.gulp.dest(app.path.build.json)); // Копируем в dist/data
// };

export const json = () => {
    return app.gulp.src(app.path.src.json) // Источник JSON
        .pipe(app.gulp.dest(app.path.build.json)); // Папка назначения
};
