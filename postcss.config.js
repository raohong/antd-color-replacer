const options = {
  plugins: [require('autoprefixer')()],
};

if (process.env.NODE_ENV === 'development') {
  options.sourcemap = true;
}
module.exports = options;
