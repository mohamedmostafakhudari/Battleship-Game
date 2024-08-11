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
		watchFiles: ["src/**/*"],
	},
	module: {
		rules: [],
	},
});
