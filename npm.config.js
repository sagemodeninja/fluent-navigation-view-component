const path = require('path');

module.exports = {
    target: 'web',
    entry: './src/index.ts',
    output: {
        filename: 'index.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'FluentNavigationViewComponent',
        libraryTarget: 'umd',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: "source-map",
}