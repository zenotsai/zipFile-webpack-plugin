const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");
const DEFAULT_FIELDNAME = "dist";
const DEFAULT_LEVEL = 9
class zipWebpackPlugin {
  constructor(options) {
    this.options = options || {};
    this.options.filename = this.options.filename ? this.options.filename : DEFAULT_FIELDNAME;
    this.options.level = this.options.level ? this.options.level : DEFAULT_LEVEL;
    this.options.pathPrefix = this.options.pathPrefix ? this.options.pathPrefix :'';
    if (this.options.pathPrefix && path.isAbsolute(this.options.pathPrefix)) {
      throw new Error('pathPrefix must be a relative path');
    }
    this.archive = archiver("zip", {
      zlib: { level: this.options.level } 
    });
  }
  apply(compiler) {
    let options = this.options;
    compiler.plugin("after-emit", (compilation, callback)=> {
      let output = fs.createWriteStream(path.resolve(compiler.options.output.path, `${options.filename}.zip`));
      this.archive.pipe(output);

      let assets = compilation.getStats().toJson().assets;

      assets.forEach((itemAssets, index) => {
        let assetsPath = path.resolve(
          compiler.options.output.path,
          itemAssets.name
        );
        let targetPath = assetsPath.split(compiler.options.output.path);
        if (ModuleFilenameHelpers.matchObject({ include: options.include, exclude: options.exclude },assetsPath)) {
          this.archive.append(fs.createReadStream(assetsPath), {
            name: path.join(options.pathPrefix, targetPath[1])
          });
        }
      });

      if (assets.length > 0) this.archive.finalize();

      output.on("close", function() {
        callback && callback();
      });
    });
  }
}

module.exports = zipWebpackPlugin;
