const gulp = require('gulp');
const ts = require('gulp-typescript')
const replace = require('gulp-replace')
const tsProject = ts.createProject("tsconfig.json");
const watch = require('gulp-watch');
const shell = require('gulp-shell');
const path = require('path');
const fse = require('fs-extra');
const GulpZip = require('gulp-zip');
const terser = require('gulp-terser');
const gulpif = require('gulp-if');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const fs = require('fs');
let isProdEnv = false;

// const paths = ["source/**/*", "!source/**/*.ts", "source/**/*.d.ts"];
const paths = ["source/**/*", "!source/builder/resource", "!source/**/*.ts", "source/**/*.d.ts"];
const ext = ["i18n**/*.js", "package*.json", "upgrade.js"];
//电脑上的cocos的service目录
const cocosCreatorServicePathMac = "/Users/hsf/.CocosCreator/.service";
const cocosCreatorServicePathWin = "C:/Users/a/.CocosCreator/.service";

const packageInfo = require("./package.json");

gulp.task('copy-res', () => {
    return gulp.src(paths)
        .pipe(gulpif((file) => file.path.endsWith(".css"), cleanCSS()))
        .pipe(gulp.dest('dist'))
});
// gulp.task('copy-sdk', (cb) => {
//     let dist = './dist/builder/resource';
//     if (fse.existsSync(dist)) fse.removeSync(dist);
//     fse.copySync("./source/builder/resource", dist);
//     cb();
// })
gulp.task('copy-ext', () => gulp.src(ext).pipe(replace(/\.\/dist/g, '.')).pipe(gulp.dest('dist')));
//代码混淆
gulp.task('complier', () => {
    return tsProject.src().pipe(tsProject())
        .js.pipe(gulpif(isProdEnv, terser()))
        .pipe(gulpif(isProdEnv, javascriptObfuscator()))
        .pipe(gulpif(isProdEnv, javascriptObfuscator()))
        .pipe(gulp.dest('dist'))
});
gulp.task('default', gulp.parallel('complier', 'copy-res', 'copy-ext'));
// gulp.task('default', gulp.parallel('complier', 'copy-res', 'copy-ext'));
gulp.task('watch', () => watch(paths.concat('source/**/*.ts'), gulp.parallel('default')));

// 以下是发布代码
gulp.task('modi-ver', (cb) => {
    fse.writeFileSync("./dist/package.json", JSON.stringify(Object.assign(require('./dist/package.json'), {
        version: '2.0.0'
    }), null, '\t'));
    cb();
})
gulp.task('exec-npmi', shell.task("npm i --production", {
    cwd: path.join(__dirname, 'dist')
}));
gulp.task('npmi', gulp.series('modi-ver', 'exec-npmi', 'copy-ext'));
gulp.task('rename', (cb) => {
    let pubDist = `./.publish/${packageInfo.name.substr(8)}`;
    if (fse.existsSync(pubDist)) fse.removeSync(pubDist);
    if (!fse.existsSync('./.publish')) fse.mkdirsSync("./.publish");
    fse.copySync("./dist", pubDist);
    cb();
});
gulp.task('zip', () => gulp.src(`./.publish/${packageInfo.name.substr(8)}**/**/*`)
    .pipe(GulpZip(`${packageInfo.version}.zip`))
    .pipe(gulp.dest("./.publish")));

gulp.task('zipx', (cb) => {
    let dir = `${__dirname}/.publish/${packageInfo.name.substr(8)}`;
    let dist = `${__dirname}/.publish/${packageInfo.version}.zip`;
    if (fse.existsSync(dist)) fse.unlinkSync(dist);
    compressing.zip.compressDir(dir, dist).then(() => cb());
});

// gulp.task('zips', shell.task(`rm -rf ${packageInfo.version}.zip;
// zip -qry ${packageInfo.version}.zip ${packageInfo.name.substr(8)}`, {
//     cwd: `${__dirname}/.publish`
// }))

gulp.task('zips', () => {
    const publicFolder = path.join(__dirname, '.publish');
    const files = fs.readdirSync(publicFolder);
    files.forEach(file => {
        if (file.substr(-4) === '.zip') {
            console.log('delete file:', file);
            const zipFile = path.join(publicFolder, file);
            del.sync([zipFile]);
        }
    });
    const gulpSrc = path.join(`${publicFolder}/**`);
    return gulp.src(gulpSrc)
        .pipe(GulpZip(`${packageInfo.version}.zip`))
        .pipe(gulp.dest(publicFolder));

})

gulp.task('set-env', (cb) => {
    isProdEnv = true;
    cb();
})

//是否拷贝到了cocos creator的service目录下
let isCopyToCocosCreator = false;
//把插件覆盖到 .CocosCreator/.service/下
gulp.task('copy-to-cocos-creator', (cb) => {
    //重置标志位
    isCopyToCocosCreator = false;
    //电脑上的服务的文件夹
    let cocosCreatorServicePath = "";
    if (fs.existsSync(cocosCreatorServicePathWin)) {
        cocosCreatorServicePath = cocosCreatorServicePathWin;
    } else if (fs.existsSync(cocosCreatorServicePathMac)) {
        cocosCreatorServicePath = cocosCreatorServicePathMac;
    } else {
        console.warn("电脑cocosCreator的service目录为空, 需要手动拷贝");
        cb()
        return;
    }
    //插件目录
    let sdkDirName = packageInfo.name.substr(8);
    //电脑上cocos编辑器的service目录
    let sdkServiceDir = cocosCreatorServicePath + "/" + sdkDirName;
    let hasSdkServiceDir = fs.existsSync(sdkServiceDir);
    //删除旧的插件文件
    if (hasSdkServiceDir == true) {
        removeDirectoryAllFile(sdkServiceDir, false)
    }
    //插件构建出来的 源 sdk路径
    let resDir = `${__dirname}/.publish/${sdkDirName}`;
    //拷贝到cocos编辑器的 service 内
    fse.copySync(resDir, sdkServiceDir);
    console.log("注意：已经拷贝到了 cocosCreator 的service目录下 path:" + resDir);

    //设置标志位
    isCopyToCocosCreator = true;
    cb()
});


//删除构建后的 .publish 文件
gulp.task('remove-project-publish', (cb) => {
    //上面的任务未拷贝到了cocos creator的service目录下，不执行删除，还可以手动拷贝
    if (isCopyToCocosCreator == false) {
        cb();
        return;
    }
    let resDir = `${__dirname}/.publish/${packageInfo.name.substr(8)}`;
    let hasPath = fs.existsSync(resDir);
    if (hasPath == true) {
        removeDirectoryAllFile(resDir, true);
        console.log("注意：已经删除 path:" + resDir);
    }
    cb()
});

gulp.task('publish', gulp.series('set-env', 'default', 'npmi', 'rename', 'zips', 'copy-to-cocos-creator', 'remove-project-publish'));
// gulp.task('publish', gulp.series('set-env', 'default', 'npmi', 'rename', 'zips', 'copy-to-cocos-creator'));


/**
 * 删除文件夹中所有的文件，递归，不删除 tarPath
 * fromPath:跟路径
 */
function removeDirectoryAllFile(tarPath, removeRootDir) {
    //原始文件夹是否存在
    if (fs.existsSync(tarPath) == false) {
        console.error("removeDirectoryAllFile err tarPath == null");
        return;
    }
    // console.log("src:" + src + ", dest:" + dest);
    // 拷贝新的内容进去
    var dirs = fs.readdirSync(tarPath);
    dirs.forEach(function (item) {
        var item_path = path.join(tarPath, item);
        var temp = fs.statSync(item_path);
        //是文件
        if (temp.isFile()) {
            // console.log("Item Is File:" + item);
            fs.rmSync(item_path);
        }
        //是目录
        else if (temp.isDirectory()) {
            // console.log("Item Is Directory:" + item);
            removeDirectoryAllFile(item_path, true);
        }
    });

    //是否删除传入的根目录
    if (removeRootDir == true) {
        fs.rmdirSync(tarPath);
    }
}