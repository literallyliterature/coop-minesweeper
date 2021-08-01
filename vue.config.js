module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/coop-minesweeper/' : '/',
  transpileDependencies: [
    'vuetify',
  ],
};
