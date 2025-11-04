module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-typescript',
      ['@babel/plugin-proposal-private-methods', { "loose": true }],
      ['@babel/plugin-proposal-class-properties', { "loose": true }]
    ]
  };
};