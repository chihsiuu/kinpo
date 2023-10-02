const webpack = require('webpack')

module.exports = {
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "./src/assets/scss/style-v";`
            }
        }
    },
    // configureWebpack: {
    //     plugins: [
    //         new webpack.DefinePlugin({
    //             'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
    //         })
    //     ]
    // }
};