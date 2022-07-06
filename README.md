<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">PKU  Limitter</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-brightgreen)]()
[![GitHub Issues](https://img.shields.io/github/issues/pavelsima/pku-daily-limitter.svg)](https://github.com/pavelsima/pku-daily-limitter/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/pavelsima/pku-daily-limitter.svg)](https://github.com/pavelsima/pku-daily-limitter/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Opensource mobile app for counting PHE/protein for Phenylketonuria.
    <br>
</p>

## 📝 Table of Contents

- [About](#about)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting_started)
- [Tests](#tests)
- [TODO](#todo)
- [Build using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

My personal project, it is mostly for my need counting daily PHE/protein (protein for simlification). I am still working on this project, in close tim I want to release mobile apps to stores. You can see all planned features in [TODO section](#todo)
If you are interested in contributting, just create pull request with your change and I will get to that.

## 🔎 Prerequisites <a name = "prerequisites"></a>

Not nessesary minimum requirements, but I am using this versions

```
node => 16.9.1
yarn => 1.22.17
```

For mobile development you need install native development apps:

iOS: [Xcode](https://developer.apple.com/xcode/)
Android: [Android Studio](https://developer.android.com/studio)

## 🏁 Getting Started <a name = "getting_started"></a>

First you need to install all the dependencies

```
yarn
```

after all is installed, you can run local server

```
yarn start
```

For deveoplment on phone (emulator) please follow the instructions on ionicframework documentation: [iOS](https://ionicframework.com/docs/developing/ios), [Android](https://ionicframework.com/docs/developing/android).

## 🔧 Tests <a name = "tests"></a>

There are simple Cypress tests for basic functionality.
You can run them by command
```
yarn cypress:headless
```
And to modify and add new tests just run the following command
```
yarn cypress
```
I am planing to add cypress tests to github actions - for now it is in [TODO](#todo)
## 📋 TODO <a name = "todo"></a>

- PDF exports
- Week statistics
- Release Android Application
- Release iOS Application
- Finish implementing eslint
- Cypress Github actions
- ✅ ~~Cypress tests~~


## ⛏️ Built Using <a name = "built_using"></a>

- [Ionic Framework](https://ionicframework.com/) - For building native apps and UI
- [ReactJS](https://reactjs.org/) - Web Framework
- [Cypress](https://www.cypress.io/) - End to end testing framework (in development [TODO](#todo))

## ✍️ Authors <a name = "authors"></a>

- [@pavelsima](https://github.com/pavelsima) - Idea & Initial work

