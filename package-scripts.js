// prettier-ignore
module.exports = {
  scripts: {
    "flow-copy-source": "flow-copy-source -v src",
    "build:clean": "rm -rfv dist compat",
    "build:flow": "nps 'flow-copy-source dist' 'flow-copy-source compat/cjs'",
    "build:index": "create-index --banner '// @flow' src/ && sed -f indexIgnore.sed -i src/index.js && nps 'lint --fix src/index.js'",
    "build:readme": "pkg-to-readme --template ./readmeTemplate.ejs --force && documentation readme src/** --section API && doctoc README.md",
    "build:src": "rollup -c ../../rollup.config.js",
    "dist": "nps 'build:clean' 'build:index' 'build:src' 'build:flow' 'build:readme'",
    "lint": "eslint --rule 'flowtype-errors/show-errors: error'"
  }
};
