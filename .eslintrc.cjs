module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    // Error prevention
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
    'no-debugger': 'warn',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Import rules
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
    }],
    'import/no-unresolved': 'off', // Vite handles this
    
    // Style (handled by Prettier, but keep some)
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'no-trailing-spaces': 'error',
  },
  globals: {
    // Firebase globals
    firebase: 'readonly',
    // Browser APIs
    SpeechRecognition: 'readonly',
    webkitSpeechRecognition: 'readonly',
    SpeechSynthesisUtterance: 'readonly',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'functions/',
    '*.config.js',
    '*.config.cjs',
    // Legacy phase files (designed to be inline in index.html)
    'src/js/phase*.js',
    'src/js/progressTracking.js',
    'src/js/commonPhrasesEnhanced.js',
    'src/js/staticPhrasesEnhanced.js',
  ],
};
