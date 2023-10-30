module.exports = {
  // parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  

  plugins: ['react', 'react-hooks'],
  rules: {
    'prettier/prettier': 0,
    "react/prop-types": 0
  },
}

// module.exports = {
//   root: true,
//   extends: '@react-native-community',
//   rules: {
//     'prettier/prettier': 0,
//   },
// };
