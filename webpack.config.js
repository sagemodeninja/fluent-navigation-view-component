const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, argv) => {
    const isDev = argv.mode === 'development';

    return {
        target: 'web',
        entry: isDev ? './src/app.ts' : './src/index.ts',
        output: {
            filename: isDev ? 'bundle.js' : 'fluent-navigation-view-component.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'FluentNavigationViewComponent',
            libraryTarget: 'umd',
            clean: true,
        },
        plugins: isDev && [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'public/index.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'about.html',
                template: 'public/about.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'contact.html',
                template: 'public/contact.html'
            }),
            new MiniCssExtractPlugin(),
        ],
        module: {
            rules: [
                isDev
                    ? {
                          test: /\.css$/i,
                          use: [MiniCssExtractPlugin.loader, 'css-loader'],
                      }
                    : {},
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        devServer: isDev
            ? {
                  static: {
                      directory: path.join(__dirname, 'dist'),
                  },
                  compress: true,
                  https: false,
                  port: 3000,
              }
            : {},
        devtool: isDev ? 'inline-source-map' : 'source-map',
    }
};
