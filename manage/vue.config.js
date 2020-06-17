module.exports = {
  devServer: {
    proxy: 'http://127.0.0.1:8002'
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8002',
    //     ws: true, //是否代理websockets
    //     changeOrigin: true
    //   }

    // }
  }
}