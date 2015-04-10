// RapidPageBuilder - created with Gulp Fiction
var gulp = require("gulp");
var concat = require("gulp-concat");
var inject = require("gulp-inject");
var plumber = require("gulp-plumber");
var cheerio = require("gulp-cheerio");
var htmlclean = require("gulp-htmlclean");
var uncss = require("gulp-uncss");
var csso = require("gulp-csso");
var uglifycss = require("gulp-uglifycss");
var uglify = require('gulp-uglifyjs');

gulp.task("default", function () {
  gulp.start('html-build', 'js-build', 'css-build', 'css-clean', 'html-clean', 'js-clean');
});

gulp.task("html-build", [], function () {
    gulp.src("./src/templates/*.html")
        .pipe(inject(gulp.src(['./src/templates/fragments/meta.html']), {starttag: '<!-- inject:meta:{{ext}} -->',transform: function (filePath, file) { return file.contents.toString('utf8')} }))
    	.pipe(inject(gulp.src(['./src/templates/fragments/header.html']), {starttag: '<!-- inject:header:{{ext}} -->',transform: function (filePath, file) { return file.contents.toString('utf8')} }))
    	.pipe(inject(gulp.src(['./src/templates/fragments/content.html']), {starttag: '<!-- inject:content:{{ext}} -->',transform: function (filePath, file) { return file.contents.toString('utf8')} }))
    	.pipe(inject(gulp.src(['./src/templates/fragments/footer.html']), {starttag: '<!-- inject:footer:{{ext}} -->',transform: function (filePath, file) { return file.contents.toString('utf8')} }))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("html-clean", [], function () {
    gulp.src("./dist/*.html")
        .pipe(cheerio(function ($, file) {
      $("img:not([alt])").attr("alt", ""); //this adds a blank alt tag to images without an alt
    }))
        .pipe(htmlclean())
        .pipe(gulp.dest("./dev/"));
});

gulp.task("css-build", [], function () {
    gulp.src("./src/css/*.css")
    	.pipe(concat("global.css"))
    	.pipe(gulp.dest("./dist/css/"));
});    	

gulp.task("css-clean", [], function () {
    gulp.src("./dist/css/*.css")
        .pipe(uncss({html: ['dev/*.html','src/**/*.html'] }))
        .pipe(csso())
        .pipe(uglifycss())
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task('js-build', function(){
        gulp.src('./src/js/*.js')
            .pipe(concat("global.js"))
            .pipe(plumber())
            .pipe(gulp.dest('./dist/js/'));
});
gulp.task('js-clean', function(){
        gulp.src('./dist/js/*.js')
            .pipe(plumber())
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js/'));
});