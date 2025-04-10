module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow imports outside of src directory
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    }
  }
};