// RapidPageBuilder - created with Gulp Fiction
var gulp = require("gulp");
var concat = require("gulp-concat"); //concatinates files
var inject = require("gulp-inject"); //uses inject method to pages
var plumber = require("gulp-plumber"); //error handler
var cheerio = require("gulp-cheerio"); //allows you to use jquery in a task
var htmlclean = require("gulp-htmlclean"); //minification of html
var uncss = require("gulp-uncss"); //removes unused css
var csso = require("gulp-csso"); //css shorthand task
var uglifycss = require("gulp-uglifycss"); //minifies css
var uglify = require('gulp-uglifyjs'); //minifies js

gulp.task("default", function () {
  gulp.start('html-build', 'js-build', 'css-build', 'css-clean', 'html-clean', 'js-clean');//runs all the tasks below
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
        .pipe(htmlclean())//minifies html
        .pipe(gulp.dest("./dev/"));
});

gulp.task("css-build", [], function () {
    gulp.src("./src/css/*.css")
    	.pipe(concat("global.css"))
    	.pipe(gulp.dest("./dist/css/"));
});    	

gulp.task("css-clean", [], function () {
    gulp.src("./dist/css/*.css")
        .pipe(uncss({html: ['dev/*.html','src/**/*.html'] }))//sifts rendered html and removes unused css
        .pipe(csso())//css shorthanding
        .pipe(uglifycss())//minification of css
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task('js-build', function(){
        gulp.src('./src/js/*.js')
            .pipe(concat("global.js"))
            .pipe(plumber())//error handler
            .pipe(gulp.dest('./dist/js/'));
});
gulp.task('js-clean', function(){
        gulp.src('./dist/js/*.js')
            .pipe(plumber())//error handler
            .pipe(uglify())//minification of js
            .pipe(gulp.dest('./dist/js/'));
});