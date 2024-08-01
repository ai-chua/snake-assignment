'use strict'

module.exports = {
    spec: [
        "test/**/*.spec.ts"
    ],
    diff: true,
    exit: true,
    extension: ["js", "ts"],
    reporter: 'spec',
    recursive: true,
    'trace-warnings': true, // node flags ok
    ui: 'bdd',
}