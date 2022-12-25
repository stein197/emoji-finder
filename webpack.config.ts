import fs from "fs";
import path from "path";
import TSConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import * as file from "@stein197/util/file";

export default (...[, argv]) => ({
	entry: {
		index: path.resolve(__dirname, "index.ts"),
		...Object.fromEntries(fs.readdirSync(path.resolve(__dirname, "src/worker")).map(fileName => [
			`worker/${file.base(fileName)}`,
			path.resolve(__dirname, "src/worker", fileName)
		]))
	},
	output: {
		filename: "[name].js",
		path: __dirname
	},
	devtool: "source-map",
	resolve: {
		extensions: [
			".ts",
			".tsx",
			".js"
		],
		modules: [
			path.resolve(__dirname, "node_modules"),
			path.resolve(__dirname, "src")
		],
		plugins: [
			new TSConfigPathsWebpackPlugin()
		]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							configFile: path.resolve(__dirname, argv.mode === "development" ? "tsconfig.dev.json" : "tsconfig.json")
						}
					}
				],
				exclude: /node_modules/,
				resolve: {
					fullySpecified: false
				},
			}
		]
	}
});
