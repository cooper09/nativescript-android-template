"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFileSystem = exports.PlatformFSPlugin = void 0;
const path_1 = require("path");
const minimatch = require("minimatch");
const internalPlatforms = ['ios', 'android'];
class PlatformFSPlugin {
    constructor({ platform, platforms, ignore }) {
        this.platform = platform || '';
        this.platforms = platforms || internalPlatforms;
        this.ignore = ignore || [];
    }
    apply(compiler) {
        this.context = compiler.context;
        compiler.inputFileSystem = mapFileSystem({
            platform: this.platform,
            platforms: this.platforms,
            ignore: this.ignore,
            context: this.context,
            compiler,
        });
    }
}
exports.PlatformFSPlugin = PlatformFSPlugin;
function mapFileSystem(args) {
    let { platform, platforms, ignore, context, compiler } = args;
    const fs = compiler.inputFileSystem;
    ignore = args.ignore || [];
    const isExternal = internalPlatforms.indexOf(platform) === -1;
    const minimatchFileFilters = ignore.map((pattern) => {
        const minimatchFilter = minimatch.filter(pattern);
        return (file) => minimatchFilter(path_1.relative(context, file), 0, []);
    });
    const isIgnored = (file) => minimatchFileFilters.some((filter) => filter(file));
    const alienPlatforms = platforms.filter((p) => p !== platform);
    const alienPlatformFilters = alienPlatforms.map((platform) => `.${platform}.`).map((contains) => (baseFileName) => baseFileName.indexOf(contains) !== -1);
    const isNotAlienPlatformFile = (file) => !alienPlatformFilters.some((filter) => filter(path_1.basename(file)));
    const currentPlatformExt = `.${platform}`;
    const trimPlatformSuffix = (file) => {
        const { dir, name, ext } = path_1.parse(file);
        if (name.endsWith(currentPlatformExt)) {
            return path_1.join(dir, name.substr(0, name.length - currentPlatformExt.length) + ext);
        }
        return file;
    };
    const isNotIgnored = (file) => !isIgnored(file);
    const mappedFS = {
        get _statStorage() {
            return fs._statStorage;
        },
        get _readFileStorage() {
            return fs._readFileStorage;
        },
        get _readdirStorage() {
            return fs._readdirStorage;
        },
    };
    ['readFile', 'provide', 'stat', 'readJson', 'readlink'].forEach(mapPath);
    ['readdir'].forEach(filterResultingFiles);
    function platformSpecificFile(file) {
        const { dir, name, ext } = path_1.parse(file);
        let platformFilePath = path_1.join(dir, `${name}.${platform}${ext}`);
        if (isExternal && dir.indexOf('/@nativescript/core/') !== -1) {
            let replacedPath;
            try {
                replacedPath = dir.replace(/node_modules(\/[^/]+)?\/@nativescript\/core/, `node_modules/nativescript-platform-${platform}`);
                platformFilePath = require.resolve(path_1.join(replacedPath, `${name}.${platform}${ext}`));
            }
            catch (e) {
                if (replacedPath) {
                    if (ext === '.d') {
                        platformFilePath = undefined;
                    }
                    else {
                        platformFilePath = path_1.join(replacedPath, `${name}${ext}`);
                    }
                }
            }
        }
        return platformFilePath;
    }
    function listWithPlatformSpecificFiles(files) {
        const mappedFiles = [];
        files.forEach((file) => {
            mappedFiles.push(file);
            mappedFiles.push(platformSpecificFile(file));
        });
        return mappedFiles;
    }
    /**
     * Maps and filters the input files.
     * Expects array with absolute paths.
     * Returns array with absolute paths.
     */
    function filterIgnoredFilesAlienFilesAndMap(files) {
        const mappedFiles = files.filter(isNotIgnored).filter(isNotAlienPlatformFile).map(trimPlatformSuffix);
        const uniqueMappedFiles = Array.from(new Set(mappedFiles));
        return uniqueMappedFiles;
    }
    const platformSuffix = '.' + platform + '.';
    const baseWatch = compiler.watchFileSystem.watch;
    compiler.watchFileSystem.watch = function (files, dirs, missing, startTime, watchOptions, callback, callbackUndelayed) {
        const mappedFiles = listWithPlatformSpecificFiles(files);
        const newCallback = function (err, filesModified, contextModified, missingModified, fileTimestamps, contextTimestamps) {
            const mappedFilesModified = filterIgnoredFilesAlienFilesAndMap(filesModified);
            const mappedTimestamps = new Map();
            const fileTimestampsAsArray = Array.from(fileTimestamps);
            for (const entry of fileTimestampsAsArray) {
                const file = entry[0];
                const timestamp = entry[1];
                mappedTimestamps.set(file, timestamp);
                const platformSuffixIndex = file.lastIndexOf(platformSuffix);
                if (platformSuffixIndex != -1) {
                    // file name without platform suffix
                    const mappedFile = file.substr(0, platformSuffixIndex) + file.substr(platformSuffixIndex + platformSuffix.length - 1);
                    if (!(mappedFile in fileTimestamps)) {
                        mappedTimestamps.set(mappedFile, timestamp);
                    }
                }
            }
            callback.call(this, err, mappedFilesModified, contextModified, missingModified, mappedTimestamps, contextTimestamps);
        };
        const newCallbackUndelayed = function (filename, timestamp) {
            compiler.watchFileSystem.inputFileSystem.purge(filename);
            callbackUndelayed(filename, timestamp);
        };
        baseWatch.apply(compiler.watchFileSystem.watch, [mappedFiles, dirs, missing, startTime, watchOptions, newCallback, newCallbackUndelayed]);
    };
    /**
     * For FS functions that get as first argument a file path,
     * this will map it to a platform specific file if such file exists or fallback to the default.
     * Also the last argument must be a function that handles results such as (err, files[]),
     * it will invoke err for files that are ignored.
     */
    function mapPath(fName) {
        const base = fs[fName];
        mappedFS[fName] = function () {
            const args = arguments;
            const originalFilePath = args[0];
            const callback = args[args.length - 1];
            if (isIgnored(originalFilePath)) {
                callback(new Error('File ' + originalFilePath + ' is ignored!'));
                return;
            }
            const platformFilePath = platformSpecificFile(originalFilePath);
            fs.stat(platformFilePath, (err, stat) => {
                if (!err && stat && stat.isFile()) {
                    args[0] = platformFilePath;
                }
                base.apply(fs, args);
            });
        };
    }
    /**
     * For FS functions that get as a last argument a function,
     * that handles results such as (err, files[]),
     * will filter and map the returned files[].
     */
    function filterResultingFiles(name) {
        const base = fs[name];
        mappedFS[name] = function () {
            const dir = arguments[0];
            const callback = arguments[arguments.length - 1];
            if (isIgnored(dir)) {
                // Return empty file list for filtered directories.
                callback(null, []);
                return;
            }
            arguments[arguments.length - 1] = function (err, files) {
                if (err) {
                    callback(err);
                }
                else {
                    // Create absolute paths for "ignored" testing, map platforms, and return back the base name.
                    const absoluteFilePaths = files.map((file) => path_1.join(dir, file));
                    const resultAbsolute = filterIgnoredFilesAlienFilesAndMap(absoluteFilePaths);
                    const resultFileNames = resultAbsolute.map((f) => path_1.basename(f));
                    callback(null, resultFileNames);
                }
            };
            base.apply(fs, arguments);
        };
    }
    return mappedFS;
}
exports.mapFileSystem = mapFileSystem;
//# sourceMappingURL=PlatformFSPlugin.js.map