const fs = require('fs');

const { log } = console;
const { task, src, dest, series } = require('gulp');
const { bgRed } = require('colorette');


const configPath = `${process.cwd()}/postproxy.config`;

if (!fs.existsSync(`${configPath}.js`)) {
  log(`${bgRed(' ERROR ')} postproxy.config.js Not Found in ${process.cwd()}`);
  process.exit(1);
}

const opts = require(configPath);

const gif = require('gulp-if');
const chokidar = require('chokidar');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');

/**
 * Proxy server
 ============================================= */
const bs = require('browser-sync').create('postproxy-dev');

task('proxy:server', (done) => {
  bs.init(opts.browserSync, () => {
    done();
  });
});

/**
 * Styles
 ============================================= */
const postcss = require('gulp-postcss');
const stylus = require('gulp-stylus');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('autoprefixer');

const plugins = [];

Object.keys(opts.postcss.plugins).forEach(key => {
  const options = opts.postcss.plugins[key];

  if (options) {
    plugins.push(require(`postcss-${key}`)(options));
  }
});

plugins.push(autoprefixer(opts.postcss.autoprefixer));

task('proxy:styles', (done) => {
  const stream = src(opts.styles.src)
    .pipe(gif('*.styl', stylus({
      'include css': true,
    })))
    .pipe(plumber({
      errorHandler: (error) => {
        log(`Error in styles ${error.plugin}`);
        log(error.toString());
      },
    }))
    .pipe(gif('*.scss', sassGlob()))
    .pipe(gif('*.scss', sass()))
    .pipe(gif('*.sass', sass({
      indentedSyntax: true,
    })))
    .pipe(postcss(plugins, { from: undefined }))
    .pipe(rename({
      dirname: '',
    }))
    .pipe(bs.stream())
    .pipe(dest(opts.styles.dest));

  stream.on('end', () => {
    log('[styles] done');
    done();
  });

  stream.on('error', (err) => {
    log('[styles] error');
    done(err);
  });
});

/**
 * Scripts
 ============================================= */
task('proxy:scripts', (done) => {
  done();
});

/**
 * Watch
 ============================================= */
task('watcher', (done) => {
  // styles
  const watchStyles = chokidar.watch(opts.styles.watch, { ignoreInitial: false });

  watchStyles.on('all', () => {
    series('proxy:styles')();
  });

  // scripts
  const watchScripts = chokidar.watch(opts.scripts.watch, { ignoreInitial: false });

  watchScripts.on('all', () => {
    series('proxy:scripts')();
  });


  done();
});

series('proxy:styles', 'watcher', 'proxy:server')();
