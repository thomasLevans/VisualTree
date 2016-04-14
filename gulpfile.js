var gulp = require('gulp');
var webpack = require('webpack-stream');
var mocha = require('gulp-spawn-mocha');
var nsp = require('gulp-nsp');
var eslint = require('gulp-eslint');

gulp.task('default', ['test','secure','lint'], function() {
  return gulp.src('src/tree.js')
    .pipe(webpack({
      output: {
        filename: 'tree.min.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', function() {
  return gulp.src('test/*.spec.js', { read: false })
    .pipe(mocha({
      require: 'test/test.config.js',
      recursive: true,
      compilers: 'js:babel-core/register'
    }));
});

gulp.task('secure', function(cb) {
  nsp({package: __dirname + '/package.json'}, cb);
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js','!node_modules/**','!dist/**','!coverage/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
