const path = require('path');

module.exports = {
  mode: 'development',

  entry: './src/app.ts', // root entry file of project

  output: {
    // single output file.
    // bundle.[contenthash].js => this will tell webpack to generate unique file per build. Helpful for browser cahing issue.
    filename: 'bundle.js',

    // this path should match tsconfig.json -> outDir. But here we need absoute path
    path: path.resolve(__dirname, 'dist'),

    // This additional configuration is needed for the webpack dev server to really understand
    // where the output is written to and where it is relative to the index.html file
    // because by default, the webpack dev server serves an index.html file it finds in the same folder as you run npm script.
    publicPath: 'dist',
  },

  // to generate source map files (for debugging)
  // tells webpack that there will be generated source maps already which it should extract
  // and basically wire up correctly to the bundle it generates
  devtool: 'inline-source-map',

  // For any extra functionality like compiling your TS code, you have to configure webpack.
  module: {
    // you can add rules for different types of files
    // A webpack loader is simply a package to tell webpack how to deal with certain files. e.g. ts-loader
    rules: [
      // we tell webpack that any .ts file finds should be handled by the typescript loader,
      // which then in turn knows what to do with such a file.
      {
        // This describes a test, webpack will perform on any file it finds
        // to find out whether this rule here applies to that file or not.
        test: /\.ts$/,
        // what webpack should do with those files
        // ts-loader will automatically take into account the tsconfig.json file
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  // with this, we tell webpack which file extensions it should add to the 'imports' it finds.
  // by default it will look for .js files.
  resolve: {
    // now webpack will basically look for .ts and .js files and
    // then bundle all files that have these extensions which you are importing together in your source code.
    extensions: ['.ts', '.js'],
  },
};
