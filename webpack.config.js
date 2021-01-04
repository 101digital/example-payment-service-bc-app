
const path = require('path');
const fs = require('fs');

const fileList =(dir) =>{
  return fs.readdirSync(dir).reduce(function(list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}


let htmlPageNames =
  fileList(path.resolve(__dirname, 'client', 'pages'))
      .filter (filename => filename.endsWith(".html"))
      .map(filename => path.basename(filename))
      .map(filename => filename.replace(".html", ""))


let entry  = {
  main: './client/index.js',
}

htmlPageNames.forEach (page => entry[page] = `./client/pages/${page}.js`)

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template:  path.resolve(__dirname, 'client', './index.html'),
  filename: 'index.html',
  inject: 'body',
  chunks: ['main']
})


let multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    template:  path.resolve(__dirname, 'client/pages', `./${name}.html`),
    filename: `${name}.html`,
    chunks: [`${name}`]
  })
});

const proxy = (env) => {
  switch(env) {
    case 'bc':
        return  {
          '/api':
           {
               target: 'http://localhost:4478',
               changeOrigin: true,
               pathRewrite: {'^/api' : ''}
           }
         }

    case 'sandbox':
      return  {
          '/api':
           {
               target: 'https://sandbox.101digital.io',
               secure: false,
               changeOrigin: true,
               pathRewrite: {'^/api' : 'payment-service-bc/1.0.0'}
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

  entry: entry,

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
