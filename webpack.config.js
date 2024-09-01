const path = require("path");
const Dotenv = require('dotenv-webpack');



module.exports = env => ({

	mode: 'development',
	entry: "./src/main.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			/*{
				//test: /\.(js|ts|jsx|tsx)$/,
				test: /\.(js)$/,
				use: 'babel-loader',
				exclude: [/node_modules/]
			},*/
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				//test: /\.s[ac]ss$/i,
				test: /\.(sa|sc|c)ss$/,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},







		]
	}, resolve: {
		extensions: ['.ts', '.js'], //Attempt to resolve in order. If multiple files have the name but different extensions, webpack will resolve the first 
	},
	//These options change how modules are resolved. Webpack provides reasonable defaults, but it is possible to change the resolving in detail
	/*resolve: {
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules')
		]
	},*/
	output: {
		filename: "main.js",
		path: path.join(__dirname, "public"),
	},

	plugins: [
		new Dotenv({
			path: `./environment/${env.mode}.env`
		}),

		/* new HtmlWebpackPlugin({
			 title: 'IODynamic - Website',
			 description: 'IODynamic is a website.',
			 url: 'https://iodynamic.com/',
			 filename: 'index.html',
			 template: 'src/index.html',
			 inject: 'body', // true, 'head'
			 scriptLoading: 'blocking',
			 minify: devMode ? false : {
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
			 chunks: 'all',
			 excludeChunks: []
		 }),
		new ExtractTextPlugin('main.css')*/
	],


	devServer: {
		static: {
			directory: path.join(__dirname, 'public'),
		},
		compress: false,
		port: 4200,
		liveReload: true,
		watchFiles: ['src/**/*'],
		//historyApiFallback: true, or use below
		historyApiFallback: {
			index: 'index.html'
		}

	},



	devtool: 'eval-source-map', //Development - Recommended choice - builds with high quality SourceMaps.
	//devtool: 'source-map', //Production - Recommended choice - builds with high quality SourceMaps..
	//devtool: 'eval', //Development - builds with maximum performance - remove space and tabs
	//devtool: 'eval-cheap-module-source-map', //Development - original lines

	//watch: false,


});

