const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    lintOnSave: false,
    devServer: {
        overlay: {
            warning: false,
            errors: false
        },
        /*// 关闭主机检查，使微应用可以被 fetch
        disableHostCheck: true,
        // 配置跨域请求头，解决开发环境的跨域问题
        headers: {
          "Access-Control-Allow-Origin": "*",
        }*/
    },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Workers', to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/ThirdParty', to: 'ThirdParty' }]),
      new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Assets', to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Widgets', to: 'Widgets' }])
    ]
  }
}
