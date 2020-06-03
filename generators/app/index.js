const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')
const fs = require('fs')

const DEPENDENCIES = []

const DEV_DEPENDENCIES = [
  "@babel/core",
  "@babel/preset-env",
  "@babel/preset-typescript",
  "@commitlint/cli",
  "@commitlint/config-angular",
  "@rollup/plugin-alias",
  "@rollup/plugin-node-resolve",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "babel-plugin-transform-class-properties",
  "eslint",
  "husky",
  "lint-staged",
  "lodash.merge",
  "npm-run-all",
  "prettier",
  "rimraf",
  "rollup",
  "rollup-plugin-alias",
  "rollup-plugin-babel",
  "rollup-plugin-uglify",
  "typescript"
]

module.exports = class extends Generator {
  initianlizing() {}

  prompting() {
    this.log(
      yosay(`Welcome to the ace ${chalk.red('generator-ts-staging')} generator!`)
    )

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name?',
        validate: name => {
          if (!name) {
            return 'Project name cannot be empty'
          }

          if (!this.fs.exists(this.destinationPath(name))) {
            return true
          }

          if (fs.statSync(this.destinationPath(name)).isDirectory()) {
            return 'Project already exist'
          }

          return true
        }
      },
      {
        type: 'confirm',
        name: 'vscode',
        message: 'Use vscode preference?',
        default: true
      },
      {
        type: 'list',
        name: 'npmOrYarn',
        message: 'Which tool would you use for dependencies?',
        choices: ['npm', 'yarn']
      },
      {
        type: 'list',
        name: 'registry',
        message: 'Which registry would you use?',
        choices: [
          'https://registry.npm.taobao.org',
          'https://registry.npmjs.org'
        ]
      }
    ]

    return this.prompt(prompts).then(answers => {
      this.answer = {
        answers
      }

      return this.answer
    })
  }

  configuring() {
    this.destinationRoot(
      path.join(this.destinationRoot(), this.answer.answers.name)
    )
  }

  default() {}

  writing() {
    const { answers } = this.answer

    this.fs.copy(this.templatePath('examples'), this.destinationPath('examples'))
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'))

    if (answers.vscode) {
      this.fs.copy(this.templatePath('vscode'), this.destinationPath('.vscode'))
    }

    this.fs.copy(this.templatePath('babelrc'), this.destinationPath('.babelrc'))
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )
    this.fs.copy(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    )
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc.js')
    )
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('LICENSE.vm'),
      this.destinationPath('LICENSE')
    )
    this.fs.copyTpl(
      this.templatePath('package.json.vm'),
      this.destinationPath('package.json'),
      this.answer
    )
    this.fs.copy(
      this.templatePath('prettierrc'),
      this.destinationPath('.prettierrc')
    )
    this.fs.copyTpl(
      this.templatePath('README.md.vm'),
      this.destinationPath('README.md'),
      this.answer
    )
    this.fs.copy(
      this.templatePath('rollup.config.js.vm'),
      this.destinationPath('rollup.config.js')
    )
    this.fs.copy(
      this.templatePath('tsconfig.json.vm'),
      this.destinationPath('tsconfig.json')
    )
    this.fs.copy(
      this.templatePath('yarn.lock.vm'),
      this.destinationPath('yarn.lock')
    )
  }

  conflicts() {}

  install() {
    const { answers } = this.answer

    const depTool = answers.npmOrYarn === 'npm' ? 'npmInstall' : 'yarnInstall'

    this[depTool](DEPENDENCIES, {
      registry: answers.registry,
      save: true
    })
    this[depTool](DEV_DEPENDENCIES, {
      registry: answers.registry,
      'save-dev': true
    })
  }

  end() {
    const { answers } = this.answer

    if (answers.vscode) {
      this.log.info(
        'Make sure you have vscode extension https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode installed'
      )
    }

    this.log.ok(`Project ${answers.name} generated!!!`)
  }
}
