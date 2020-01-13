# why-npm-i-so-long

<p align="center"><img src="https://user-images.githubusercontent.com/5817809/72022944-b5798a00-3282-11ea-8d15-d38b6bb9929e.png" width="500" alt="illustration of a person asking why npm install take so long?"></p>

Little utility to ease troubleshooting why installing npm dependencies takes too long.

## What is "publish size" vs "install size"?

The "publish size" is the size of the source code published to npm. This number is easy to detect and should be pretty small.

The "install size" is the size your hard drive will report after running npm install. This includes the package, all of the dependencies, and its dependency's dependencies...and so on.

## Use without installing

```sh
npx why-npm-i-so-long path/to/package.json
```

## Installation

```sh
npm install --global why-npm-i-so-long
```

## Usage

See install size of dependencies
```sh
why-npm-i-so-long path/to/package.json
```
See install size of devDependencies
```sh
why-npm-i-so-long path/to/package.json --dev
```

## Acknowledgments

- [packagephobia](https://github.com/styfle/packagephobia)
