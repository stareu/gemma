import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
	entry: path.resolve('./js/index.js'),
	output: {
		path: path.resolve('./dist'),
		filename: '[name].bundle.js',
		clean: true
	},
	// module: {
	// 	rules: [{
	// 		test: /\.(js|mjs)$/,
	// 		enforce: "pre",
	// 		use: ["source-map-loader"],
	// 	}],
	// },
	devtool: 'source-map',
	mode: 'development',
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		})
	],
	devServer: {
		static: {
			directory: path.resolve('.'),
		},
		compress: true,
		port: 9000,
		devMiddleware: {
			writeToDisk: true,
		},
	},
}