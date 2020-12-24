
const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template:  path.resolve(__dirname, 'client', './index.html'),
  filename: 'index.html',
  inject: 'body',
  chunks: ['main']
})

let htmlPageNames = ['checkout']

let multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    template:  path.resolve(__dirname, 'client/pages', `./${name}.html`),
    filename: `${name}.html`,
    chunks: [`${name}`]
  })
});

const proxy = (env) => {
  switch(env) {
    case 'sandbox':
      return  {
          '/api':
           {
               target: 'https://sandbox.101digital.io',
               secure: false,
               changeOrigin: true,
               pathRewrite: {'^/api' : 'payment-service-bc/1.0.0-SNAPSHOT'}
           }
         }
      break;
      default:
          return  {
            '/api':
             {
                 target: 'http://localhost:4477',
                 changeOrigin: true,
                 pathRewrite: {'^/api' : ''}
             }
           }

  }
}

module.exports = (env) => {return {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 4000,
    proxy: proxy(env.ENV)
  },

  entry: {
    main: './client/index.js',
    checkout: './client/pages/checkout.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {test: /\.css$/,  use: [ 'style-loader', 'css-loader' ]}
     ]
  },

  mode: 'development',
  plugins: [HtmlWebpackPluginConfig].concat(multipleHtmlPlugins)
 }};
