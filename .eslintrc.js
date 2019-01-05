module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "extends": [
    "airbnb",
    "plugin:css-modules/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/standard"
  ],
  "plugins": [
    "css-modules",
    "prettier"
  ],
  "env": {
    "browser": true,
    "jest": true
  },
  "rules": {
    // temporary disable these rules to allow custom webpack config in
    // "resolve". TODO: use webpack resolver properly
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "react/require-default-props": 0,

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    "no-console": [
      "error",
      {
        "allow": ["warn", "error", "info"]
      }
    ],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    "prefer-destructuring": [
      "error",
      {
        "VariableDeclarator": {
          "array": false,
          "object": true
        },
        "AssignmentExpression": {
          "array": false,
          "object": false
        }
      },
      {
        "enforceForRenamedProperties": false
      }
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        "components": ["Link"],
        "specialLink": ["to"],
        "aspects": ["noHref", "invalidHref", "preferButton"]
      }
    ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    "react/prefer-stateless-function": "off",

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    "prettier/prettier": "error"
  },
  "globals": {
    "test": true,
    "expect": true,
    "it": true,
    "jest": true,
    "describe": true,
    "beforeEach": true,
    "afterEach": true,
    "beforeAll": true
  },
  "overrides": [
    {
      "files": [ "*.spec.js" ],
      "rules": {
        "react/jsx-filename-extension": 0
      }
    },
    {
      "files": [ "*.stories.jsx" ],
      "rules": {
        "react/prop-types": 0
      }
    }
  ],
}
