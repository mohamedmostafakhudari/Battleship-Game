const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.config.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(commonConfig, {
	mode: "production",
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
		}),
	],
});
