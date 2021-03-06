var gulp   = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var Filter = require('gulp-filter');
var lr = require('gulp-livereload');
var gif = require('gulp-if');
var cached = require('gulp-cached');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var nib = require('nib');
var autoprefixer = require('autoprefixer-stylus');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');


//Broswer reloading
var browserSync = require('browser-sync').create();

// define the default task and add the watch task to it
gulp.task('default', ['watch','serve'], function()
{
    gulp.watch("stylus");
    gulp.watch("jade");
    gulp.watch("coffee");
    
   
    gulp.start('vendors')
    gulp.start('copyfonts')
    //gulp.watch("serve");
});



gulp.task('stylus', function () {

    //var filter = Filter('**/*.styl');

    return gulp.src(
        [   
            './src/stylus/**/*.styl',
            '!./src/stylus/**/_*.styl'
        ], { base: 'src/stylus' }
        )
        //.pipe(cached('build'))
        //.pipe(filter)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(stylus({error: true, use: [nib()]}))
        //.pipe(filter.restore())
        //.pipe(concat('base.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
        ;
});

gulp.task('jade', function () {

    //var filter = Filter('**/*.styl');

    return gulp.src(
        [   
            './src/jade/**/*.jade',
            '!./src/jade/**/_*.jade'
        ], { base: 'src/jade' }
        )
        //.pipe(cached('build'))
        .pipe(plumber(swallowError))
        //.pipe(filter)
        .pipe(jade({pretty:true}))
        //.pipe(filter.restore())
        //.pipe(concat('base.css'))
        .pipe(gulp.dest('./build/html'))
        .pipe(browserSync.stream())
        ;
});


gulp.task('coffee', function () {
   
   gulp.src([   
            './src/coffee/*.coffee',
            '!./src/coffee/_*.coffee',
        ], { base: 'src/coffee' }
        )
            .pipe(plumber(swallowError))
            .pipe(coffee().on('error', swallowError))
            //.pipe(concat('admin.js'))
            .pipe(gulp.dest('./build/js'))
/*            .pipe(browserSync.stream())*/
            ;
            
   
  

    
            
        
});

gulp.task('vendors', function () {

      gulp.src(
        [   
            "bower_components/jquery/dist/jquery.js",
            'bower_components/inventive/dist/js/inventive.js',
            'bower_components/metisMenu/src/metisMenu.js',
            'bower_components/chartkick/chartkick.js',
            'bower_components/datatables/media/js/jquery.dataTables.js',
            'bower_components/datatables-responsive/js/dataTables.responsive.js'
            
           
        ]
        )
        .pipe(plumber(
        {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        ))
		.pipe(concat('vendors.js'))
		//.pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        ;
        
        gulp.src(
        [   
            
            'bower_components/inventive/dist/css/inventive.css',
            'bower_components/inventive-font/css/stripe.css',
            'bower_components/metisMenu/src/metisMenu.css',
            'bower_components/datatables-responsive/css/dataTables.responsive.css',
            'bower_components/datatables/media/css/jquery.dataTables.css'

        ]
        )
        .pipe(plumber(
        {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        ))
        .pipe(concat('vendors.css'))
		   //.pipe(minifyCss())
        .pipe(gulp.dest('./build/css/'))
        ;
});

gulp.task('copyfonts', function() {
   
   gulp.src('bower_components/inventive-font/fonts/*')
   .pipe(gulp.dest('./build/font'));
   
    gulp.src('src/img/**/*')
   .pipe(gulp.dest('./build/img'));
   
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/coffee/*.coffee', ['coffee']);
  
});





// doc Server + watching stylus/html files
gulp.task('serve', ['stylus','jade','coffee'], function() {

    browserSync.init({
        server: "./build/"
    });

    
    gulp.watch("build/css/**/*.css").on('change', browserSync.reload);
    gulp.watch("build/html/*.html").on('change', browserSync.reload);
    gulp.watch("build/js/*.js").on('change', browserSync.reload);
    
});





function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}








//SAMPLE for learning Gulp ;)
// gulp.task('default', function(){
//   return gulp.src('src/**/*')
//     .pipe(cached('build'))
//     .pipe(gif('*.styl', stylus({
//       use:[
//         nib(),
//         autoprefixer()
//       ]
//     })))
//     .pipe(gif('*.js', uglify()))
//     .pipe(gulp.dest('dist'))
//     .pipe(lr());
// });

// gulp.watch('src/**/*', ['default']);
// configure the jshint task
// gulp.task('jshint', function() {
//   return gulp.src('source/javascript/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('jshint-stylish'));
// });
