// prettier-ignore
module.exports = {
  scripts: {
    "build:readme": "pkg-to-readme --template ./readmeTemplate.ejs --force && documentation readme src/** --markdown-toc=false --section API && doctoc README.md",
    "build:flow:copy-source": "flow-copy-source -v src",
    "build:flow": "nps 'build:flow:copy-source dist' 'build:flow:copy-source compat/cjs'",
    "build:src:bundle": "rollup -c ../../rollup.config.js",
    "build:src:clean": "rm -rfv dist compat",
    "build:src": "nps 'build:src:clean' 'build:src:bundle' 'build:src:flow'",
    "prepack": "nps 'build:src'",
    "version": "nps 'build:readme' && git add README.md",
  }
};
