import LoggerOptions from './LoggerOptions';
import Logger from './Logger';
import webpack from 'webpack';
interface LoggerConfiguration {
    infrastructure: Logger;
    issues: Logger;
}
declare function createLoggerConfiguration(compiler: webpack.Compiler, options: LoggerOptions | undefined): LoggerConfiguration;
export { LoggerConfiguration, createLoggerConfiguration };
