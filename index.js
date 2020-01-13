#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const kleur = require('kleur');
const {log} = console;

function program(...args) {
    const isDevIndex = args.indexOf('--dev');
    const isDev = isDevIndex !== -1;
    const pathToPkg = isDev ? args[isDevIndex === 0 ? 1 : 0] : args[0];
    const resolvedPath = path.resolve(pathToPkg);

    if (!fs.existsSync(resolvedPath)) return log('File does not exist');
    if (!resolvedPath.endsWith('.json'))
        return log('Provided file is not a json file');

    const pkg = require(resolvedPath);
    const {dependencies, devDependencies} = pkg;

    const depsToProcess = isDev ? devDependencies : dependencies;

    if (depsToProcess === undefined) {
        return log(`JSON does not have ${isDev ? 'devD' : 'd'}ependencies`);
    }

    Promise.all(
        Object.entries(depsToProcess).map(([name, version]) =>
            fetch(
                [
                    'https://packagephobia.now.sh/v2/api.json?p=',
                    name,
                    '@',
                    version.replace(/[^=<>~]/g, ''),
                ].join(''),
            ).then(res => res.json())
            .catch(() => ({name, install: {bytes: -1}, publish: {bytes: -1}})),
        ),
    )
        .then(sizes => {
            const title = `${pkg.name}'s ${isDev ? 'devD ' : 'd'}ependencies:\n`;
            log(kleur.bold(title));

            return sizes
                .sort((a, b) => a.install.bytes - b.install.bytes)
                .map(({name, version, install, publish}) => {
                    if (install.bytes === 0) {
                        return `${name} - unknown`;
                    }
                    if (install.bytes === -1) {
                        return `${name} - api failed`;
                    }
                    return `
${kleur.bold(name)} @ ${version}
\tinstall size\t${colorSize(install)}
\tpublish size\t${colorSize(publish)}
`.trim();
                })
                .join('\n\n');
        })
        .then(log);
}

function colorSize({bytes, pretty}) {
    return bytes > 1048576
        ? kleur.bold(kleur.red(pretty))
        : bytes > 307200
        ? kleur.yellow(pretty)
        : kleur.green(pretty);
}

program(...process.argv.slice(2));
