module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', {
        targets: { electron: '3.0' }
      }],
      '@babel/preset-react',
      '@babel/preset-typescript',
      '@babel/preset-flow',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  };
};
