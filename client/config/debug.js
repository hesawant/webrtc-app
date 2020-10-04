const path = require("path");
const commonConfig = require("./common.js");
const { merge } = require("webpack-merge");
const webpack = require("webpack");

module.exports = merge(commonConfig, {
    mode: "development",

    devtool: "source-map",

    stats: "errors-only",

    plugins: [
        new webpack.DefinePlugin({
            WEBPACK_DEFINE_ENABLE_HMR: JSON.stringify(true)
        })
    ],

    devServer: {
        publicPath: "/",
        contentBase: path.resolve("dist"),
        hot: true,
        compress: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            "/api": "http://localhost:3001/"
        },
        port: 3000,
        historyApiFallback: {
            rewrites: [
                {
                    from: "/auth/slack/callback",
                    to: "./dialog.html"
                }
            ]
        },
        host: "0.0.0.0",
        disableHostCheck: true
    }
});
