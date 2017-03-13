const path = require('path');

module.exports = {
    module: {
        loaders: [{
            loader: "babel-loader",
            include: [path.resolve(__dirname, "src")],
            test: /\.js?$/,
            query: {
                presets: ["es2015"],
                plugins: ["transform-object-rest-spread"]
            }
        }]
    },
    entry: {
        "product-manager": ["./src/product-manager.js"]
    },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/assets/",
        filename: "[name].bundle.js"
    },
    devServer: { inline: true },
    devtool: "source-map"
};
