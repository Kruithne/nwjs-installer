# @kogs/nwjs
![tests status](https://github.com/Kruithne/kogs-nwjs/actions/workflows/github-actions-test.yml/badge.svg) [![license badge](https://img.shields.io/github/license/Kruithne/kogs-nwjs?color=blue)](LICENSE)

`@kogs/nwjs` is a command-line utility written in [Node.js](https://nodejs.org/) that streamlines the process of preparing a [nw.js](https://nwjs.io/) distribution.

This utility is intended for use in automated build pipelines or for development and testing purposes.

- Supports all platforms, architectures and versions.
- Supports both production and SDK builds.
- Caches builds to avoid unnecessary downloads.
- Minimal external dependencies: [tar](https://www.npmjs.com/package/tar) and [JSZip](https://www.npmjs.com/package/jszip).

## Installation
```bash
npm install @kogs/nwjs -g
```

## Usage
```bash
Usage: nwjs [options]

Options:
  --version             Specify a version to install (e.g 0.49.2)
  --sdk                 Install the SDK build instead of the production build.
  --no-cache            Disable caching of downloaded builds.
  --platform <string>   Override the platform to install for.
  --arch <string>       Override the architecture to install for.
```

## Documentation

- [Placeholder](#example-doc-section) - This is holding a place, it will be filled in soon.

### Example Doc Section

Coming really soon.

## What is `@kogs`?
`@kogs` is a collection of packages that I've written to consolidate the code I often reuse across my projects with the following goals in mind:

- Consistent API.
- Minimal dependencies.
- Full TypeScript definitions.
- Avoid feature creep.
- ES6+ syntax.

All of the packages in the `@kogs` collection can be found [on npm under the `@kogs` scope.](https://www.npmjs.com/settings/kogs/packages)

## Contributing / Feedback / Issues
Feedback, bug reports and contributions are welcome. Please use the [GitHub issue tracker](https://github.com/Kruithne/kogs-nwjs/issues) and follow the guidelines found in the [CONTRIBUTING](CONTRIBUTING.md) file.

## License
The code in this repository is licensed under the ISC license. See the [LICENSE](LICENSE) file for more information.