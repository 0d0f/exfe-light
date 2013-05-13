var fs = require('fs');
var path = require('path');

var PKG = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8').replace(/\/{2}[^\n]+\n/g, ''));

// desktop (桌面)
var DESKTOP_META = PKG.desktop.dependencies;

var DESKTOP_CONCAT = {
  src: [],
  dest: 'dist/all-<%= pkg.desktop.version %>.js'
};

var MOBILE_CONCAT = {
  src: [],
  dest: 'dist/mobile-all-<%= pkg.mobile.version %>.js'
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

DESKTOP_META.forEach(function (v) {
  var p = path.join('src', v.name, 'lib', v.name + '.js');
  JSHINT.desktop.push(p);
  JSHINT[v.name + '_'] = p;
  PUBLISH[v.name] = path.join('src', v.name);
  DESKTOP_CONCAT.src.push(path.join('dist', v.name, v.version, v.name + '.js'));
});

MOBILE_META.forEach(function (v) {
  var p = path.join('src', v.name, 'lib', v.name + '.js');
  JSHINT.mobile.push(p);
  JSHINT[v.name + '_'] = p;
  PUBLISH[v.name] = path.join('src', v.name);
  MOBILE_CONCAT.src.push(path.join('dist', v.name, v.version, v.name + '.js'));
});
// }}}

module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: PKG,
    dirs: {},

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
          'dist/all-<%= pkg.desktop.version %>.min.js': ['dist/all-<%= pkg.desktop.version %>.js']
        }
      },
      mobile: {
        files: {
          'dist/mobile-all-<%= pkg.mobile.version %>.min.js': ['dist/mobile-all-<%= pkg.mobile.version %>.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

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
      var dp = path.join('dist', name);
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

  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

};
