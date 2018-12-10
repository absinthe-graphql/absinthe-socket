// @flow
/* eslint-disable import/no-dynamic-require */

import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import globby from "globby";
import pascalCase from "pascal-case";
import resolve from "rollup-plugin-node-resolve";
import {terser} from "rollup-plugin-terser";

// $FlowFixMe
const pkg = require(`${process.cwd()}/package.json`);

const dirs = {
  input: "src",
  output: "dist",
  compat: "compat"
};

const plugins = {
  babel: babel({
    configFile: "../../.babelrc",
    exclude: ["node_modules/**", "../../node_modules/**"],
    runtimeHelpers: true
  }),
  commonjs: commonjs({
    namedExports: {
      // "apollo-utilities": [
      //   "addTypenameToDocument",
      //   "argumentsObjectFromField",
      //   "assign",
      //   "checkDocument",
      //   "cloneDeep",
      //   "createFragmentMap",
      //   "flattenSelections",
      //   "getDefaultValues",
      //   "getDirectiveInfoFromField",
      //   "getDirectiveNames",
      //   "getEnv",
      //   "getFragmentDefinition",
      //   "getFragmentDefinitions",
      //   "getFragmentQueryDocument",
      //   "getMainDefinition",
      //   "getMutationDefinition",
      //   "getOperationDefinition",
      //   "getOperationDefinitionOrDie",
      //   "getOperationName",
      //   "getQueryDefinition",
      //   "getStoreKeyName",
      //   "graphQLResultHasError",
      //   "hasDirectives",
      //   "isDevelopment",
      //   "isEnv",
      //   "isEqual",
      //   "isField",
      //   "isIdValue",
      //   "isInlineFragment",
      //   "isJsonValue",
      //   "isNumberValue",
      //   "isProduction",
      //   "isScalarValue",
      //   "isTest",
      //   "maybeDeepFreeze",
      //   "removeConnectionDirectiveFromDocument",
      //   "removeDirectivesFromDocument",
      //   "resultKeyNameFromField",
      //   "shouldInclude",
      //   "storeKeyNameFromField",
      //   "toIdValue",
      //   "tryFunctionOrLogError",
      //   "valueFromNode",
      //   "valueToObjectRepresentation",
      //   "variablesInOperation",
      //   "warnOnceInDevelopment"
      // ],
      phoenix: ["Ajax", "Channel", "LongPoll", "Presence", "Socket"]
    }
  }),
  resolve: resolve(),
  terser: terser()
};

const getEsConfig = fileName => ({
  input: `${dirs.input}/${fileName}`,
  output: {file: `${dirs.output}/${fileName}`, format: "es", sourcemap: true},
  plugins: [plugins.babel, plugins.terser]
});

const getCjsConfig = fileName => ({
  input: `${dirs.input}/${fileName}`,
  output: {
    file: `${dirs.compat}/cjs/${fileName}`,
    format: "cjs",
    sourcemap: true
  },
  plugins: [plugins.babel, plugins.terser]
});

const sources = globby.sync("**/*js", {cwd: dirs.input});

// eslint-disable-next-line no-unused-vars
const getUnscopedName = pkg => {
  const [scope, name] = pkg.name.split("/");

  return pascalCase(scope) + pascalCase(name);
};

export default [
  {
    input: `${dirs.input}/index.js`,
    output: {
      file: `${dirs.compat}/umd/index.js`,
      format: "umd",
      name: pascalCase(getUnscopedName(pkg)),
      sourcemap: true
    },
    plugins: [plugins.babel, plugins.resolve, plugins.commonjs, plugins.terser]
  },
  // TODO
  // Use multiple outputs once this gets merged:
  // https://github.com/TrySound/rollup-plugin-terser/pull/16
  ...sources.map(getCjsConfig),
  ...sources.map(getEsConfig)
];
