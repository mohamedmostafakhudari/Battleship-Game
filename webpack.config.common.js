const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			title: "Battleship",
			inject: true,
			template: path.resolve(__dirname, "src", "index.html"),
		}),
	],
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
};
