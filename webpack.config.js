module.exports = {
  entry: './index.js', // 要輸出的檔案入口
  output: {
    filename: './bundle.min.js', //最終的目的檔案
    library: 'react-resize-box-wrapper',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015','stage-2']
        }
      }
    ]
  },
  plugins: [],
}