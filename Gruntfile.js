var fs = require('fs');
var path = require('path');

var PKG = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8').replace(/\/{2}[^\n]+\n/g, ''));

// desktop (桌面)
var DESKTOP_META = PKG.desktop.dependencies;

var DESKTOP_CONCAT = {
  src: [],
  dest: 'production/js/all-<%= pkg.desktop.version %>.js'
};

var MOBILE_CONCAT = {
  src: [],
  dest: 'production/js/mobile-all-<%= pkg.mobile.version %>.js'
};

// mobile (移动)
var MOBILE_META = PKG.mobile.dependencies;

var IGNORE = 'zepto jquery jqmousewheel tween store marked handlebars countrycodes phonepanel mnemosyne filehtml5 uploader profile cross lightsaber live tween store';


// publish {{{
var PUBLISH = {};
// }}}


// JSHint {{{
var JSHINT_OPTIONS = JSON.parse(fs.readFileSync(__dirname + '/tools/jshintrc', 'utf8').replace(/\/{2}[^\n]+\n/g, ''));

var JSHINT = {
  /*
  options: {
    jshintrc: 'tools/jshintrc'
  },
  */
  options: JSHINT_OPTIONS,

  desktop: [],
  mobile: []

};

var DESKTOP_OTHERS = ['home', 'newbieguide'];

DESKTOP_META.forEach(function (v) {
  var p = path.join('src', v.name, 'lib', v.name + '.js');
  JSHINT.desktop.push(p);
  JSHINT[v.name + '_'] = p;
  PUBLISH[v.name] = path.join('src', v.name);
  DESKTOP_CONCAT.src.push(path.join('production/js', v.name, v.version, v.name + '.js'));
});

DESKTOP_OTHERS.forEach(function (v) {
  var p = path.join('src', v, 'lib', v + '.js');
  JSHINT.desktop.push(p);
  JSHINT[v + '_'] = p;
  PUBLISH[v] = path.join('src', v);
});

MOBILE_META.forEach(function (v) {
  var p = path.join('src', v.name, 'lib', v.name + '.js');
  JSHINT.mobile.push(p);
  JSHINT[v.name + '_'] = p;
  PUBLISH[v.name] = path.join('src', v.name);
  MOBILE_CONCAT.src.push(path.join('production/js', v.name, v.version, v.name + '.js'));
});

JSHINT.DESKTOP = path.join('production/js', 'all-' + PKG.desktop.version + '.js');
JSHINT.DESKTOP_MIN = path.join('production/js', 'all-' + PKG.desktop.version + '.min.js');
JSHINT.MOBILE = path.join('production/js', 'mobile-all-' + PKG.mobile.version + '.js');
JSHINT.MOBILE_MIN = path.join('production/js', 'mobile-all-' + PKG.mobile.version + '.min.js');
// }}}

module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: PKG,
    dirs: {
      dist: 'production/js',
      desktop: 'all-<%= pkg.desktop.version %>.js',
      desktop_min: 'all-<%= pkg.desktop.version %>.min.js',
      mobile: 'mobile-all-<%= pkg.mobile.version %>.js',
      mobile_min: 'mobile-all-<%= pkg.mobile.version %>.min.js',
      deploy: '/exfe/exfelight'
    },

    jshint: JSHINT,

    publish: PUBLISH,

    concat: {
      options: {
        separator: "\n"
      },
      desktop: DESKTOP_CONCAT,
      mobile: MOBILE_CONCAT
    },

    uglify: {
      options: {
        //report : 'gzip',
        compress: {
          global_defs: {
            "DEBUG": false
          },
          dead_code: true
        },
        //beautify: true,
        //width: 80,
        banner: '/*! EXFE.COM <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      desktop: {
        files: {
          '<%= dirs.dist %>/<%= dirs.desktop_min %>': ['<%= dirs.dist %>/<%= dirs.desktop %>']
        }
      },
      desktop_beautify: {
        options: {
          beautify: true,
          width: 80,
          banner: '/*! EXFE.COM all@<%= pkg.desktop.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
        },
        files: {
          '<%= dirs.dist %>/<%= dirs.desktop %>': ['<%= dirs.dist %>/<%= dirs.desktop %>']
        }
      },
      mobile: {
        files: {
          '<%= dirs.dist %>/<%= dirs.mobile_min %>': ['<%= dirs.dist %>/<%= dirs.mobile %>']
        }
      },
      mobile_beautify: {
        options: {
          beautify: true,
          width: 80,
          banner: '/*! EXFE.COM mobile-all@<%= pkg.mobile.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
        },
            files: {
          '<%= dirs.dist %>/<%= dirs.mobile %>': ['<%= dirs.dist %>/<%= dirs.mobile %>']
        }
      }
    },

    copy: {
      deploy: {
        expand: true,
        cwd: 'production',
        src: ['**'],
        dest: '<%= dirs.deploy %>'
      },
      deploy_meta: {
        expand: true,
        src: ['package.json'],
        dest: 'production'
      },
      deploy_js: {
        expand: true,
        cwd: '<%= dirs.dist %>',
        src: ['**'],
        dest: 'production/js/'
      },
      deploy_css: {
        expand: true,
        cwd: 'production/css',
        src: ['**'],
        dest: '<%= dirs.deploy %>/css/'
      },
      deploy_img: {
        expand: true,
        cwd: 'production/img',
        src: ['**'],
        dest: '<%= dirs.deploy %>/img/'
      },
      deploy_font: {
        expand: true,
        cwd: 'production/font',
        src: ['**'],
        dest: '<%= dirs.deploy %>/font/'
      },
      deploy_views: {
        expand: true,
        cwd: 'production/views',
        src: ['**'],
        dest: '<%= dirs.deploy %>/views/'
      }
    },

    shell: {
      git: {
        command: [
          'cd <%= dirs.deploy %>',
          'git add .',
          'git commit -am "<%= git.tag %>" || echo "";'
        ].join('&&')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);

  // display full modules
  grunt.registerTask('list', 'Display full modules.', function () {
    var TABS = '    ';
    grunt.log.writeln(TABS + 'Desktop Modules');
    DESKTOP_META.forEach(function (v) {
      var pkg = JSON.parse(fs.readFileSync(path.join('src', v.name, 'package.json')));
      grunt.log.writeln(TABS + TABS, pkg.name, ' - ', pkg.description, 'v' + pkg.version);
    });

    grunt.log.writeln("\n" + TABS + 'Mobile Modules');
    MOBILE_META.forEach(function (v) {
      var pkg = JSON.parse(fs.readFileSync(path.join('src', v.name, 'package.json')));
      grunt.log.writeln(TABS + TABS, pkg.name, ' - ', pkg.description, 'v' + pkg.version);
    });
  });

  grunt.registerTask('publish', 'Publish a module.', function (name) {
    if (!name) {
      grunt.log.error('Not Found A Module.');
      return;
    }

    if (name === 'all') {
      DESKTOP_META.forEach(function (v) {
        if (IGNORE.indexOf(v.name) === -1) {
          grunt.task.run('publish:' + v.name);
        }
      });
      MOBILE_META.forEach(function (v) {
        if (IGNORE.indexOf(v.name) === -1) {
          grunt.task.run('publish:' + v.name);
        }
      });
    } else if (name in grunt.config.get('publish')) {
      var p = path.join('src', name);
      var pkg = JSON.parse(fs.readFileSync(path.join(p, 'package.json')));
      var dp = path.join('production/js', name);
      grunt.log.writeln(name);
      grunt.task.run('jshint:' + name + '_');
      if (!grunt.file.exists(dp)) {
        grunt.file.mkdir(dp);
      }
      var vdp = path.join(dp, pkg.version);
      if (!grunt.file.exists(vdp)) {
        grunt.file.mkdir(vdp);
      }
      grunt.file.copy(path.join(p, 'lib', name + '.js'), path.join(vdp, name + '.js'));
    } else {
      grunt.log.error('Not Found A Module.');
    }
  });

  grunt.registerTask('deploy', 'Deploy Static Files.', function (name, tp, tag) {
    var len = arguments.length;
    if (0 === len) {
    } else {
      switch (name) {
      case 'js':
        grunt.task.run('copy:deploy_js');
        //var dist = grunt.config.get('dirs.dist') + '/';
        //grunt.file.copy(dist + grunt.config.get('dirs.desktop'), jsdir + '/' + grunt.config.get('dirs.desktop'));
        //grunt.file.copy(dist + grunt.config.get('dirs.desktop_min'), jsdir + '/' + grunt.config.get('dirs.desktop_min'));
        //grunt.file.copy(dist + grunt.config.get('dirs.mobile'), jsdir + '/' + grunt.config.get('dirs.mobile'));
        //grunt.file.copy(dist + grunt.config.get('dirs.mobile_min'), jsdir + '/' + grunt.config.get('dirs.mobile_min'));
        break;

      case 'css':
        grunt.task.run('copy:deploy_css');
        break;

      case 'img':
        grunt.task.run('copy:deploy_img');
        break;

      case 'font':
        grunt.task.run('copy:deploy_font');
        break;

      case 'views':
        grunt.task.run('copy:deploy_views');
        break;

      case 'meta':
        grunt.task.run('copy:deploy_meta');
        break;

      case 'build':
        var dir = tp || '/exfe/exfelight', jsdir, cssdir, imgdir, fontdir, viewsdir;
        grunt.config.set('dirs.deploy', dir);
        if (!grunt.file.exists(dir)) { grunt.file.mkdir(dir); }
        if (!grunt.file.exists(jsdir = dir + '/js')) { grunt.file.mkdir(jsdir); }
        if (!grunt.file.exists(cssdir = dir + '/css')) { grunt.file.mkdir(cssdir); }
        if (!grunt.file.exists(imgdir = dir + '/img')) { grunt.file.mkdir(imgdir); }
        if (!grunt.file.exists(fontdir = dir + '/font')) { grunt.file.mkdir(fontdir); }
        if (!grunt.file.exists(viewsdir = dir + '/views')) { grunt.file.mkdir(viewsdir); }

        grunt.task.run('copy:deploy');
        grunt.config.set('git.tag', tag);
        grunt.task.run('shell:git');
        break;
      }
    }
  });

  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

};
