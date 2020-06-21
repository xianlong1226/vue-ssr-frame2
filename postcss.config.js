module.exports = {
  sourceMap: true,
  plugins: {
    'autoprefixer': true,
    'postcss-preset-env': {
      features: {
        'nesting-rules': true
      }
    }
  }
}
