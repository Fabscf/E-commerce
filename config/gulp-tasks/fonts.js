import fs from 'fs';
import gulp from 'gulp';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
    return gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {encoding:false})
        .pipe(app.plugins.plumber(app.plugins.notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>"
        })))
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(gulp.dest(`${app.path.srcFolder}/fonts/`));
}

export const ttfToWoff = () => {
    return gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {encoding:false})
        .pipe(app.plugins.plumber(app.plugins.notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>"
        })))
        .pipe(fonter({
            formats: ['woff']
        }))
        .pipe(gulp.dest(`${app.path.build.fonts}`))
        .pipe(gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        .pipe(ttf2woff2())
        .pipe(gulp.dest(`${app.path.build.fonts}`));
}

export const fonstStyle = (done) => {
    let fontsFile = `${app.path.srcFolder}/scss/fonts/fonts.scss`;
    
    if (app.isFontsReW) {
        fs.unlinkSync(fontsFile);
    }
    
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            if (!fs.existsSync(fontsFile)) {
                fs.writeFileSync(fontsFile, '');
                let newFileOnly;
                for (let i = 0; i < fontsFiles.length; i++) {
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        switch (fontWeight.toLowerCase()) {
                            case 'thin': fontWeight = 100; break;
                            case 'extralight': fontWeight = 200; break;
                            case 'light': fontWeight = 300; break;
                            case 'medium': fontWeight = 500; break;
                            case 'semibold': fontWeight = 600; break;
                            case 'bold': fontWeight = 700; break;
                            case 'extrabold':
                            case 'heavy': fontWeight = 800; break;
                            case 'black': fontWeight = 900; break;
                            default: fontWeight = 400;
                        }
                        fs.appendFileSync(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`);
                        newFileOnly = fontFileName;
                    }
                }
            } else {
                console.log("Файл scss/fonts/fonts.scss уже существует. Для обновления файла нужно его удалить!");
            }
        } else {
            // fs.unlinkSync(fontsFile);
        }
    });

    done();
}

export const fonts = gulp.series(otfToTtf, ttfToWoff, fonstStyle);
