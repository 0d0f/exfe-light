module.exports = function (grunt) {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var semver = require('semver');

  var crypto = require('crypto');
  // git sha1
  var sha1 = function (path, isLong) {
    var s = crypto.createHash('sha1')
      , c = grunt.file.read(path, { encoding: 'binary' })
      , ss = '';
    s.update('blob ' + c.length + '\0' + c, 'binary');
    ss = s.digest('hex');
    return isLong ? ss : ss.substr(0, 7);
  };

  var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
  var folderMount = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
  };

  var PKG = grunt.file.readJSON('package.json');
  PKG.desktop.sha1 = PKG.desktop.sha1 || PKG.desktop.version;
  PKG.mobile.sha1 = PKG.mobile.sha1 || PKG.mobile.version;
  PKG.css = PKG.css || {};

  // desktop (桌面)
  var DESKTOP_META = PKG.desktop.dependencies;

  var DESKTOP_CONCAT = {
    src: [],
    dest: 'production/js/exfe-<%= pkg.desktop.version %>.js'
  };

  var MOBILE_CONCAT = {
    src: [],
    dest: 'production/js/exfemobile-<%= pkg.mobile.version %>.js'
  };

  // mobile (移动)
  var MOBILE_META = PKG.mobile.dependencies;

  var JSHINT_IGNORE = 'zepto jquery jqmousewheel tween store marked handlebars countrycodes phonepanel mnemosyne filehtml5 uploader profile cross lightsaber live tween store';

  //title 40 40 30

  // publish {{{
  var PUBLISH = {};
  // }}}

  // UGLIFY {{{
  var UGLIFY = {
    options: {
      report : 'min',
      compress: {
        global_defs: {
          "DEBUG": false
        },
        dead_code: true
      }
    },
    DESKTOP: {
      options: {
        banner: '<%= meta.banner %>\n'
          + '/*\n'
          + '// desktop@<%= pkg.desktop.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %>\n'
          + '//# sourceMappingURL=exfe-<%= pkg.desktop.sha1 %>.min.map\n'
          + '*/\n',
        sourceMap: '<%= dirs.dist %>/exfe-<%= pkg.desktop.sha1 %>.min.map',
        sourceMappingURL: function (dest) {
          return dest.split('/')[2];
        },
        // See https://github.com/mozilla/source-map#sourcemapconsumer
        /*
        {
          version : 3,
          file: "out.js",
          sourceRoot : "",
          sources: ["foo.js", "bar.js"],
          names: ["src", "maps", "are", "fun"],
          mappings: "AA,AB;;ABCDE;"
        }
        */
        sourceMapOutCover: {
          file: '<%= dirs.desktop_min %>',
          sources: ['<%= dirs.desktop %>']
        }
      },
      files: {
        '<%= dirs.dist %>/<%= dirs.desktop_min %>': ['<%= dirs.dist %>/<%= dirs.desktop %>']
      }
    },
    DESKTOP_beautify: {
      options: {
        banner: '<%= meta.banner %>\n/*! desktop@<%= pkg.desktop.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n',
        beautify: {
          indent_level: 2,
          width: 80,
          beautify: true
        },
        // 不压缩变量
        mangle: false
      },
      files: {
        '<%= dirs.dist %>/<%= dirs.desktop %>': ['<%= dirs.dist %>/<%= dirs.desktop %>']
      }
    },
    MOBILE: {
      options: {
        banner: '<%= meta.banner %>\n'
          + '/*\n'
          + '// mobile@<%= pkg.mobile.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %>\n'
          + '//# sourceMappingURL=exfemobile-<%= pkg.mobile.sha1 %>.min.map\n'
          + '*/\n',
        sourceMap: '<%= dirs.dist %>/exfemobile-<%= pkg.mobile.sha1 %>.min.map',
        sourceMappingURL: function (dest) {
          return dest.split('/')[2];
        },
        sourceMapOutCover: {
          file: '<%= dirs.mobile_min %>',
          sources: ['<%= dirs.mobile %>']
        }
      },
      files: {
        '<%= dirs.dist %>/<%= dirs.mobile_min %>': ['<%= dirs.dist %>/<%= dirs.mobile %>']
      }
    },
    MOBILE_beautify: {
      options: {
        banner: '<%= meta.banner %>\n/*! mobile@<%= pkg.mobile.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n',
        beautify: {
          indent_level: 2,
          width: 80,
          beautify: true
        },
        mangle: false
      },
      files: {
        '<%= dirs.dist %>/<%= dirs.mobile %>': ['<%= dirs.dist %>/<%= dirs.mobile %>']
      }
    }
  };
  // }}}


  // JSHint {{{
  var JSHINT = {
    options: {
      jshintrc: '.jshintrc'
    },

    DESKTOP: [],
    MOBILE: []
  };

  var DESKTOP_OTHERS = ['home', 'newbieguide', 'newhome', 'mobiledirector', 'debugger'];

  var __DESKTOP__ = [];
  var __MOBILE__ = [];

  DESKTOP_META.forEach(function (v) {
    var p = path.join('src', v.name, 'lib', v.name + '.js');
    JSHINT.DESKTOP.push(p);
    __DESKTOP__.push(v.name);
    JSHINT[v.name] = p;
    PUBLISH[v.name] = path.join('src', v.name);
    DESKTOP_CONCAT.src.push(path.join('production/js', v.name, v.version, v.name + '.js'));
  });

  DESKTOP_OTHERS.forEach(function (v) {
    var p = path.join('src', v, 'lib', v + '.js');
    JSHINT.DESKTOP.push(p);
    __DESKTOP__.push(v.name);
    JSHINT[v] = p;
    PUBLISH[v] = path.join('src', v);
  });

  MOBILE_META.forEach(function (v) {
    var p = path.join('src', v.name, 'lib', v.name + '.js');
    JSHINT.MOBILE.push(p);
    JSHINT[v.name] = p;
    __MOBILE__.push(v.name);
    PUBLISH[v.name] = path.join('src', v.name);
    MOBILE_CONCAT.src.push(path.join('production/js', v.name, v.version, v.name + '.js'));
  });

  JSHINT.DESKTOP = path.join('production/js', 'all-' + PKG.desktop.version + '.js');
  JSHINT.DESKTOP_MIN = path.join('production/js', 'all-' + PKG.desktop.version + '.min.js');
  JSHINT.MOBILE = path.join('production/js', 'mobile-all-' + PKG.mobile.version + '.js');
  JSHINT.MOBILE_MIN = path.join('production/js', 'mobile-all-' + PKG.mobile.version + '.min.js');
  // }}}

  // Project configuration.
  grunt.initConfig({
    pkg: PKG,
    meta: {
      /*! EXFE.COM Awesome! We're hunting talents like you. Please drop us your CV to work@exfe.com. */
      banner: '/*! EXFE.COM QXdlc29tZSEgV2UncmUgaHVudGluZyB0YWxlbnRzIGxpa2UgeW91LiBQbGVhc2UgZHJvcCB1cyB5b3VyIENWIHRvIHdvcmtAZXhmZS5jb20uCg== */'
    },
    dirs: {
      dist: 'production/js',
      desktop: 'exfe-<%= pkg.desktop.sha1 %>.js',
      desktop_min: 'exfe-<%= pkg.desktop.sha1 %>.min.js',
      mobile: 'exfemobile-<%= pkg.mobile.sha1 %>.js',
      mobile_min: 'exfemobile-<%= pkg.mobile.sha1 %>.min.js',
      deploy: '/exfe/exfelight'
    },

    jshint: JSHINT,

    publish: PUBLISH,

    concat: {
      options: {
        separator: "\n"
      },
      DESKTOP: DESKTOP_CONCAT,
      MOBILE: MOBILE_CONCAT
    },

    uglify: UGLIFY,

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
        dest: 'production/'
      },
      deploy_js: {
        expand: true,
        cwd: 'production/js',
        src: ['**'],
        dest: '<%= dirs.deploy %>/js/'
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
    },

    livereload: {
      port: 35729 // Default livereload listening port.
    },

    watch: {
      options: {
        livereload: true,
        nospawn: true
      },
      less: {
        files: ['less/exfe/lib/**/*.less', 'less/mobile/lib/**/*.less'],
        tasks: ['less', 'buildcss:DESKTOP', 'buildcss:MOBILE', 'update:package', 'deploy:meta']
      },
      html: {
        files: ['templates/*.html']
      }
    },

    less: {
      DESKTOP_dev: {
        options: {
        },
        files: {
          './production/css/exfe.css': './less/exfe/lib/exfe.less',
        }
      },
      DESKTOP_prod: {
        options: {
          yuicompress: true,
          report: 'min'
        },
        files: {
          './production/css/exfe.min.css': './less/exfe/lib/exfe.less',
        }
      },
      MOBILE_dev: {
        options: {
        },
        files: {
          './production/css/exfemobile.css': './less/mobile/lib/mobile.less',
        }
      },
      MOBILE_prod: {
        options: {
          yuicompress: true,
          report: 'min'
        },
        files: {
          './production/css/exfemobile.min.css': './less/mobile/lib/mobile.less',
        }
      }
    },

    regarde: {
      fred: {
        files: ['less/exfe/lib/*.less', 'less/exfe/lib/pages/*.less', 'templates/*.html'],
        tasks: ['livereload']
      }
    },

    connect: {
      server: {
        options: {
          port: 8964,
          keepalive: true,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-livereload');
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
        //if (JSHINT_IGNORE.indexOf(v.name) === -1) {
          grunt.task.run('publish:' + v.name);
        //}
      });
      MOBILE_META.forEach(function (v) {
        //if (JSHINT_IGNORE.indexOf(v.name) === -1) {
          grunt.task.run('publish:' + v.name);
        //}
      });
    } else if (name === 'DESKTOP') {
      DESKTOP_META.forEach(function (v) {
        //if (JSHINT_IGNORE.indexOf(v.name) === -1) {
          grunt.task.run('publish:' + v.name);
        //}
      });
    } else if (name === 'MOBILE') {
      MOBILE_META.forEach(function (v) {
        //if (JSHINT_IGNORE.indexOf(v.name) === -1) {
          grunt.task.run('publish:' + v.name);
        //}
      });
    } else if (name in grunt.config.get('publish')) {
      var p = path.join('src', name);
      var pkg = JSON.parse(fs.readFileSync(path.join(p, 'package.json')));
      var dp = path.join('production/js', name);
      grunt.log.writeln(name);
      grunt.task.run('jshint:' + name);
      if (!grunt.file.exists(dp)) {
        grunt.file.mkdir(dp);
      }
      var vdp = path.join(dp, pkg.version);
      if (!grunt.file.exists(vdp)) {
        grunt.file.mkdir(vdp);
      }
      grunt.file.copy(path.join(p, 'lib', name + '.js'), path.join(vdp, name + '.js'));
    } else {
      grunt.log.error('Not Found ', name, ' Module.');
    }
  });

  grunt.registerTask('deploy', 'Deploy Static Files.', function (name, tp, tag) {
    var len = arguments.length;
    if (0 === len) {
    } else {
      switch (name) {
      case 'js':
        grunt.task.run('copy:deploy_js');
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

  grunt.registerTask('uglifymulti', 'Uglify multi files.', function (modules) {
    var len = modules.length;
    if (0 === len) {
      grunt.log.error('Input A Module.');
    } else {
      if (modules === 'DESKTOP') {
        grunt.task.run('uglifymulti:' + __DESKTOP__.join(' '));
        return;
      } else if (modules === 'MOBILE') {
        grunt.task.run('uglifymulti:' + __MOBILE__.join(' '));
        return;
      }
      modules = modules.split(/\s|,/);
      modules.forEach(function (v, i) {
        var m = v.split('@'),
            name = m[0].trim(),
            pattern = m[1];
        if (name && (!pattern || semver.valid(pattern))) {
          if (fs.existsSync(path.join('src', name))) {
            var pkg = grunt.file.readJSON(path.join('src', name, 'package.json'));
            pattern = pkg.version;
          } else {
            grunt.log.error('Not Found ', name, ' Module.');
            return;
          }
        }
        var mp = path.join('production/js', name);
        if (fs.existsSync(mp)) {
          var files = fs.readdirSync(mp);
          var status = false;
          files.forEach(function (dir, j) {
            if (grunt.file.isDir(path.join(mp, dir))) {
              if (semver.satisfies(dir, pattern)) {
                status = true;
                grunt.config.set('uglify.' + name + '.files.' + grunt.config.escape(path.join(mp, dir, name + '.min.js')), path.join(mp, dir, name + '.js'));
              }
            }
          });
          if (status) {
            grunt.task.run('uglify:' + name);
          }
        }
      });
    }
  });

  grunt.registerTask('server', [ 'livereload-start', 'connect', 'watch', 'regarde']);

  grunt.registerTask('gitsha1', function (arg) {
    if (arg === 'DESKTOP') {
      PKG.desktop.sha1 = PKG.desktop.version + '-' + sha1(grunt.config.get('concat.DESKTOP.dest'));
      grunt.file.copy('production/js/exfe-' + PKG.desktop.version + '.js', 'production/js/exfe-' + PKG.desktop.sha1 + '.js');
      grunt.file.delete('production/js/exfe-' + PKG.desktop.version + '.js');
    } else if (arg === 'MOBILE') {
      PKG.mobile.sha1 = PKG.mobile.version + '-' + sha1(grunt.config.get('concat.MOBILE.dest'));
      grunt.file.copy('production/js/exfemobile-' + PKG.mobile.version + '.js', 'production/js/exfemobile-' + PKG.mobile.sha1 + '.js');
      grunt.file.delete('production/js/exfemobile-' + PKG.mobile.version + '.js');
    }
  });

  grunt.registerTask('buildcss', 'Build CSS', function (arg) {
    if (arg === 'DESKTOP') {
      PKG.css.exfe    = 'exfe-' + sha1('production/css/exfe.css') + '.css';
      PKG.css.exfemin = 'exfe-' + sha1('production/css/exfe.min.css') + '.min.css';
      grunt.file.copy('production/css/exfe.css','production/css/' + PKG.css.exfe);
      grunt.file.delete('production/css/exfe.css');
      grunt.file.copy('production/css/exfe.min.css', 'production/css/' + PKG.css.exfemin);
      grunt.file.delete('production/css/exfe.min.css');
    } else if (arg === 'MOBILE') {
      PKG.css.exfemobile    = 'exfemobile-' + sha1('production/css/exfemobile.css') + '.css';
      PKG.css.exfemobilemin = 'exfemobile-' + sha1('production/css/exfemobile.min.css') + '.min.css';
      grunt.file.copy('production/css/exfemobile.css', 'production/css/' + PKG.css.exfemobile);
      grunt.file.delete('production/css/exfemobile.css');
      grunt.file.copy('production/css/exfemobile.min.css', 'production/css/' + PKG.css.exfemobilemin);
      grunt.file.delete('production/css/exfemobile.min.css');
    }
  });

  grunt.registerTask('update:package', 'Update package.json', function () {
    grunt.config.set('pkg', PKG);
    grunt.file.write('package.json', JSON.stringify(PKG, null, 2), 'utf8');
  });

  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

};
