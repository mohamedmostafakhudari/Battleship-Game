const { merge } = require("webpack-merge");
console.log(merge);
const commonConfig = require("./webpack.config.common.js");

module.exports = merge(commonConfig, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		static: {
			directory: "./dist",
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
		],
	},
});
