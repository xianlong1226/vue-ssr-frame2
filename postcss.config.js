module.exports = {
  ident: 'postcss',
  // parser: 'postcss-less',
  sourceMap: true,
  plugins: {
    'postcss-import': {}, // 必须，会处理@import
    // 'postcss-nesting': {}, // 和 postcss-preset-env 中使用 nesting-rules 等效
    'autoprefixer': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true
      }
    }
  }
}
