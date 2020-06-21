module.exports = {
  sourceMap: true,
  plugins: {
    'postcss-assets': {
      relative: true,
      loadPaths: ['pages/', 'assets/']
    },
    'postcss-pxtorem': {},
    'postcss-preset-env': {}
  }
}
