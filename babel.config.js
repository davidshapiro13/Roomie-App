module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        'babel-preset-expo', // Required for Expo projects
        '@babel/preset-env', // Transpile modern JavaScript
        '@babel/preset-react', // Transpile JSX (if using React)
        '@babel/preset-typescript', // Transpile TypeScript
      ],
      plugins: [
        '@babel/plugin-transform-runtime', // Optional: Handle async/await
        ['@babel/plugin-transform-private-methods', { "loose": true }]
      ]
    };
  };