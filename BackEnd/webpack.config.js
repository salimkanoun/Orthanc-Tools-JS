const path = require('path')

module.exports = {
  externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore'],
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'api.bundle.js'
  },
  target: 'node'
}
