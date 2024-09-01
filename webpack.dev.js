const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const Dotenv = require('dotenv-webpack');



module.exports = merge(common, {
	mode: "development",
	devtool: "inline-source-map",
	//devtool: 'eval-source-map', //Development - Recommended choice - builds with high quality SourceMaps.
	//devtool: 'eval', //Development - builds with maximum performance - remove space and tabs
	//devtool: 'eval-cheap-module-source-map', //Development - original lines


	devServer: {
		static: {
			directory: path.join(__dirname, "src"),
		},
		port: 4200,
		compress: false,
		liveReload: true,
		watchFiles: ["./src/**/*"],
		hot: true,
		historyApiFallback: true,
		/*historyApiFallback: { //not work
			index: "./index.html"
		},*/
	},

	plugins: [
		new Dotenv({
			path: "./environment/development.env"
		})
	],
});