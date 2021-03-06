'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var util = require('util');
var path = require('path');

module.exports = Generator.extend({
  prompting: function () {
    // Base dir path
    this.moduleName = path.basename(process.cwd());

    // Have Yeoman greet the user.
    this.log(yosay(
      'YO! This is laudable ' + chalk.red('Drupal 7 module') + ' generator'
    ));

    var prompts = [
      {
        name: 'moduleNameHuman',
        message: 'Say me the name of your module:',
        default: this.moduleName
      }, {
        name: 'moduleDesc',
        message: 'Describe your module:',
        default: 'My custom module'
      }, {
        name: 'modulePackage',
        message: 'Set the package:',
        default: 'Custom'
      }, {
        name: 'moduleDependencies',
        message: 'Module dependencies ' + chalk.dim('(space separated)') + ':'
      }, {
        type: 'confirm',
        name: 'moduleFilesInstall',
        message: 'Do you need ' + chalk.blue(this.moduleName + '.install') + ' file?',
        default: false
      }, {
        type: 'confirm',
        name: 'moduleNeedHooks',
        message: 'Implement some hooks for you?',
        default: false
      }, {
        when: function (response) {
          return response.moduleNeedHooks | response.moduleFilesInstall;
        },
        type: 'checkbox',
        name: 'moduleHooks',
        message: 'Choose needle hooks:',
        choices: function (response) {
          var hooks = [];

          if (response.moduleNeedHooks) {
            hooks.unshift({
                name: 'hook_permission'
              },
              {
                name: 'hook_menu'
              });
          }
          if (response.moduleFilesInstall) {
            hooks.unshift({
                name: 'hook_install',
                checked: true
              },
              {
                name: 'hook_schema'
              });
          }
          return hooks;
        },
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one option!';
          }
          return true;
        }
      }, {
        type: 'confirm',
        name: 'moduleAssets',
        message: 'Do you need some assets' + chalk.dim('(js / css)') + '?',
        default: false
      }, {
        when: function (response) {
          return response.moduleAssets;
        },
        type: 'checkbox',
        name: 'moduleAssetsFiles',
        message: 'Choose assets types:',
        choices: [
          {
            name: 'js'
          },
          {
            name: 'css'
          }
        ],
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one option!';
          }
          return true;
        }
      }, {
        when: function (response) {
          return response.moduleAssetsFiles && response.moduleHooks.indexOf('hook_menu') != -1;
        },
        type: 'confirm',
        name: 'moduleAssetsAddToPage',
        message: 'Would you like attach assets to page?',
        default: true
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;

      this.hooks = {};
      this.assets = {};

      /**
       * Check hooks
       *
       * @returns {boolean}
       * @param item
       * @param props
       */
      function hasFeature(item, props) {
        return props.indexOf(item) !== -1;
      }

      /**
       * Convert string to camelCase
       *
       * @param str
       * @returns {XML|string}
       */
      function toCamelCase(str) {
        return str.replace(/_([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      }

      /**
       * Convert string to UPPER CASE
       *
       * @param str
       * @returns {XML|string}
       */
      function toUpperCase(str) {
        return str.toUpperCase();
      }

      this.moduleNameCamel = toCamelCase(this.moduleName);
      this.moduleNameUpper = toUpperCase(this.moduleName);
      this.modulePathConstant = this.moduleNameUpper + '_PATH';
      this.moduleNameHuman = props.moduleNameHuman;
      this.moduleDesc = props.moduleDesc;
      this.modulePackage = props.modulePackage;
      this.moduleDependencies = props.moduleDependencies.length !== 0 ? 'dependencies[] = ' + props.moduleDependencies.split(' ').join('\ndependencies[] = ') : '';
      this.moduleFilesInstall = props.moduleFilesInstall;
      this.moduleAssetsAddToPage = props.moduleAssetsAddToPage;

      if (props.moduleAssets) {
        this.assets.js = hasFeature('js', props.moduleAssetsFiles);
        this.assets.css = hasFeature('css', props.moduleAssetsFiles);
      }

      if (props.moduleHooks || props.moduleFilesInstall) {
        for (var i = 0, c = props.moduleHooks.length; i < c; i++) {
          var hook = props.moduleHooks[i];
          this.hooks[hook] = hasFeature(hook, props.moduleHooks);
        }
      }

    }.bind(this));
  },

  writing: function () {
    var mn = this.moduleName;

    /**
     * Create module.info
     */
    this.fs.copyTpl(
      this.templatePath('_template.info'),
      this.destinationPath(mn + '.info'),
      this
    );

    /**
     * Create module.module
     */
    this.fs.copyTpl(
      this.templatePath('_template.module'),
      this.destinationPath(mn + '.module'),
      this
    );

    /**
     * Create module.install
     */
    if (this.hooks.hook_install) {
      this.fs.copyTpl(
        this.templatePath('_template.install'),
        this.destinationPath(mn + '.install'),
        this
      );
    }

    /**
     * Create pages for hook_menu
     */
    if (this.hooks.hook_menu) {
      this.fs.copyTpl(
        this.templatePath('includes/_template.pages.inc'),
        this.destinationPath('includes/' + mn + '.pages.inc'),
        this
      );
    }

    /**
     * Create assets (js)
     */
    if (this.assets.js) {
      this.fs.copyTpl(
        this.templatePath('assets/js/_template.js'),
        this.destinationPath('assets/js/' + mn + '.js'),
        this
      );
    }

    /**
     * Create assets (css)
     */
    if (this.assets.css) {
      this.fs.copyTpl(
        this.templatePath('assets/css/_template.css'),
        this.destinationPath('assets/css/' + mn + '.css'),
        this
      );
    }
  }
});
