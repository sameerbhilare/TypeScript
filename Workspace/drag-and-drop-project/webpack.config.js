const path = require('path');

module.exports = {
  entry: './src/app.ts', // root entry file of project
  output: {
    // single output file.
    // bundle.[contenthash].js => this will tell webpack to generate unique file per build. Helpful for browser cahing issue.
    filename: 'bundle.js',

    // this path should match tsconfig.json -> outDir. But here we need absoute path
    path: path.resolve(__dirname, 'dist'),
  },
};
