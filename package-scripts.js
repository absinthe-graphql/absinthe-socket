// prettier-ignore
module.exports = {
  scripts: {
    "build:clean": "rm -rfv dist compat",
    "build:flow": "nps 'flow-copy-source dist' 'flow-copy-source compat/cjs'",
    "build:readme": "pkg-to-readme --template ./readmeTemplate.ejs --force && documentation readme src/** --markdown-toc=false --section API && doctoc README.md",
    "build:src": "rollup -c ../../rollup.config.js",
    "flow-copy-source": "flow-copy-source -v src",
    "lint": "eslint --rule 'flowtype-errors/show-errors: error'",
    "prepublish": "not-in-install && nps 'build:clean' 'build:src' 'build:flow'",
    "version": "nps 'build:readme' && git add README.md",
  }
};
