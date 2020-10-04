const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        vendor: ["react", "react-dom"],
        app: "./src/index.tsx"
    },

    output: {
        path: path.resolve("dist"),
        publicPath: "/",
        filename: `[name].[hash].${Date.now()}.js`,
        chunkFilename: `[id].[hash].${Date.now()}.chunk.js`
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "WebRTC Call",
            filename: "index.html",
            template: "./src/index.html",
            chunks: ["app", "vendor"]
        })
    ]
};
