import path from "path";

export default (...[, argv]) => ({
	entry: path.resolve(__dirname, "index.ts"),
	output: {
		filename: "index.js",
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
