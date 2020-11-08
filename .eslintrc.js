module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/base',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          'extends',
          ['props', 'propsData'],
          'data',
          'model',
          'inheritAttrs',
          'mixins',
          [
            'components',
            'directives',
            'filters',
          ],
          'fetch',
          'asyncData',
          'computed',
          'methods',
          'LIFECYCLE_HOOKS',
          'head',
          'watch',
          ['template', 'render'],
          'renderError',
        ],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
};
