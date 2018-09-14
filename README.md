# <center>ZipFile Webpack Plugin</center>


# Install

```npm i --save-dev zipFile-webpack-plugin```

# Quick Start
```
plugins: [
    new zipWebpackPlugin({
      exclude: [/\.map$/],
      filename: 'myZip', // default: dist.zip
      include: [/\.js$/],
      level: 1,  // default: 9
      pathPrefix: 'pathPrefix'
    }),
]
```