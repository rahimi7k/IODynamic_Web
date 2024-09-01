const path = require("path");
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const keepAsset = require('./keepAsset');


module.exports = {

	module: {
		rules: [
			{
				//test: /\.tsx?$/,
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/i,
				loader: "html-loader",
				options: {
					sources: false, // Disables attributes processing
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					//"style-loader",// 3.Creates `style` nodes from JS strings
					MiniCssExtractPlugin.loader, // 3.spits a new file
					{
						loader: "css-loader", // 2.Translates CSS into CommonJS
						options: {
							url: false,// Disables parse any paths
						}
					},
					"sass-loader",// 1.Compiles Sass to CSS
				],
			},

			/*{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: {
					//filename: "[path][name].[hash][ext][query]", //Not userd, with [path] at first
					filename: "assets/fonts/[name].[hash][ext][query]", //It uses name.hash.ext
					//outputPath: "assets/fonts/"
				}
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/i,
				type: "asset/resource",
				generator: {
					filename: "assets/images/[name].[hash][ext][query]",
					//outputPath: "assets/images/"
				}
			},
			{
				test: /\.(svg)$/,
				type: "asset/resource",
				generator: {
					filename: "assets/svg/[name].[hash][ext][query]",
					//outputPath: "assets/svg/"
				}
			},
			{
				test: /\.(mp3|wav)$/,
				type: "asset/resource",
				generator: {
					filename: "assets/audio/[name].[hash][ext][query]",
				}
			},
			{
				test: /\.(ico)$/,
				type: "asset/resource"
			}*/

		]
	},
	//These options change how modules are resolved. Webpack provides reasonable defaults, but it is possible to change the resolving in detail
	/*resolve: {
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules')
		]
	},*/
	resolve: {
		extensions: ['.ts', '.js'], //Attempt to resolve in order. If multiple files have the name but different extensions, webpack will resolve the first 
	},

	entry: {
		//main: "./src/main.ts",
		main: {
			import: "./src/main.ts",
			dependOn: "ilanguage",
		},
		ilanguage: "./src/core/Language/ILanguage.ts",
		/*language_fa: {
			import: "./src/core/Language/Language_FA.ts",
			dependOn: 'ilanguage',
		},
		language_en: {
			import: "./src/core/Language/Language_EN.ts",
			dependOn: 'ilanguage',
		},*/
	},

	output: {
		//filename: "main.js",
		filename: "[name].[chunkhash].js",
		chunkFilename: '[name].[chunkhash].js',
		path: path.join(__dirname, "public"),
		publicPath: "/", //Very important(Microsoft solution), Add / in first of src, href in html
		//assetModuleFilename: 'assets',

		//clean: true
		/*clean: {
			keep: keepAsset
		}*/
	},

	/*stats: {
		chunkGroups: true,
	},*/

	optimization: {
		//minimize: true,

		//runtimeChunk: 'single',
		/*splitChunks: {
			chunks: 'all',
		},*/
	},

	plugins: [
		new HTMLWebpackPlugin({
			template: "./src/index.html",
			filename: "index.html",
			inject: "body", //https://stackoverflow.com/questions/68699655/why-is-webpack-html-plugin-adding-script-tag-in-head-instead-of-body-when-using
			scriptLoading: "module",
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			},

			/*"files": {
				"css": ["main.css"],
				"js": ["assets/head_bundle.js", "assets/main_bundle.js"],
				"chunks": {
					"head": {
						"entry": "assets/head_bundle.js",
						"css": ["main.css"]
					},
					"main": {
						"entry": "assets/main_bundle.js",
						"css": []
					},
				}
			}*/
		}),

		//https://stackoverflow.com/a/50394858/18064685
		new MiniCssExtractPlugin({
			filename: "[name].[chunkhash].css",
			chunkFilename: "[id].[chunkhash].css"
		}),

	],

};

