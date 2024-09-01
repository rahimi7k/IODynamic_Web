const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');


module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map', //Production - Recommended choice - builds with high quality SourceMaps..


	plugins: [
		new Dotenv({
			path: "./environment/production.env"
		}),

		new CompressionPlugin({
			//filename: '[path].gz[query]',
			//test: /\.(js|css|html|svg)$/,
			//threshold: 10240,
			algorithm: 'gzip',
			minRatio: 0.8,
		}),
		/* new CompressionPlugin({
			 filename: '[path].br[query]',
			 algorithm: 'brotliCompress',
			 test: /\.(js|css|html|svg)$/,
			 compressionOptions: { level: 11 },
			 threshold: 10240,
			 minRatio: 0.8,
			 deleteOriginalAssets: false,
		   }), */


		/*new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),*/

		new CopyPlugin({
			patterns: [
				//{ from: "./src/assets/images/shop", to: "assets/images/shop" },
				{ from: "./src/assets", to: "assets" },
			],
		}),





	],

});