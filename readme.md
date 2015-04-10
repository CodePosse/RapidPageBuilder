# Tim's Rapid Page Builder

##Purpose

To allow a simple edit of HTML fragments to be injected into a template that dictates what elements are used and what order they are placed in.

##How It Works

After you have made sure you installed all the gulp packages, you can type the name of a task like `gulp html-build` or just `gulp` to build/optimize the whole thing.

1. `html-build` goes to `./src/templates/` and looks for html files in that folder. Then the inject method is used to look in the sample file `template.html` for injection points. once it identifies that, it looks in the `/fragments` folder for the appropriate file.

This seeks the inject that includes "meta" and resolves it to `./src/templates/fragments/meta.html`:
```
.pipe(inject(gulp.src(['./src/templates/fragments/meta.html']), {starttag: '<!-- inject:meta:{{ext}} -->',transform: function (filePath, file) { return file.contents.toString('utf8')} }))
```

This is the `template.html` placeholder for the injection of that above snippet:
```
  <!-- inject:meta:html -->
  <!-- global meta tags will be here -->
  <!-- endinject -->
  ```

  2. `html-clean` goes in the compiled html files that were output by `html-build` adds blank alt tags where there were none, strips whitespace and minifies it. It will be smaller but unreadable to humans.
  3. `css-build` grabs all the css in `./src/css/` combines (concatinate) it to one file called `global.css` and dumps it in `./dist/css/`
  4. `css-clean` lookes in the compiled css, makes it shorthand by way of `gulp-csso`, then uses `gulp-uncss` to look for unused CSS in all your html docs (does not work for elements created in the DOM by JS), finally it minifies it.
  5. `js-build` grabs all the javascript in `./src/js/` combines (concatinate) it to one file called `global.js` and dumps it in `./dist/js/`.
  6. `js-clean` lookes in the compiled js, then minifies it.
  7. `gulp` by itself runs the builds, followed by the cleans.

##Required Gulp packages

  You need to go to the root of the project and in the command line you'll use npm to install these packages, assuming you don't have gulp already, here it is installedd globally:
```
npm install gulp -g
npm install gulp-if gulp-cheerio
npm install --save gulp-concat gulp-uglifycss gulp-uglifyjs
npm install --save-dev gulp-plumber gulp-inject gulp-uglify gulp-uncss gulp-csso gulp-htmlclean
npm update
```