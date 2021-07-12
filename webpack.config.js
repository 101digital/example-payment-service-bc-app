const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const envConfig = dotenv.parsed;

for (const k in envConfig) {
  process.env[k] = JSON.stringify(envConfig[k]);
}

const fileList = (dir) => {
  return fs.readdirSync(dir).reduce(function (list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
};

const htmlPageNames = fileList(path.resolve(__dirname, 'src', 'pages'))
  .filter((filename) => filename.endsWith('.html'))
  .map((filename) => path.basename(filename))
  .map((filename) => filename.replace('.html', ''));

const entry = {};
htmlPageNames.forEach((page) => (entry[page] = `./src/pages/${page}.js`));

let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/pages', `./${name}.html`),
    filename: `${name}.html`,
    chunks: [`${name}`],
  });
});

const proxy = (env) => {
  switch (env) {
    default:
      return {
        '/payment-service-bc/1.0.0': {
          target: envConfig['REACT_APP_REMOTE_HOST'],
          secure: false,
          changeOrigin: true,
        },
      };
  }
};

module.exports = (env) => {
  return {
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      https: true,
      port: 4000,
      proxy: proxy(env.ENV),
      historyApiFallback: true,
    },

    entry: entry,

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      // publicPath: '/',
    },

    module: {
      rules: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.(gif|svg|jpg|png|jpeg)$/, use: ['file-loader'] },
      ],
    },

    mode: 'development',
    plugins: [new webpack.DefinePlugin({ 'process.env': process.env })].concat(multipleHtmlPlugins),
  };
};

//new webpack.DefinePlugin({"process.env": dotenv.parsed})
