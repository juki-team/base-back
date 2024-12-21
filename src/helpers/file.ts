import { LogLevel } from '@juki-team/commons';
import fs from 'fs';
import { log } from './log';

export const readFile = (fileName: string) => fs.promises.readFile(fileName, 'utf8');

export const writeFile = (fileName: string, data: string) => fs.promises.writeFile(fileName, data);

export const existsFolder = (folderPath: string) => {
  return fs.existsSync(folderPath);
};

export const getFiles = (dir: string, recursive: boolean, files__?: string[]) => {
  const files_: string[] = files__ || [];
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch (error) {
    files = [];
    log(LogLevel.ERROR)(`failed to read files from ${dir}`, error);
  }
  for (const i in files) {
    const name = dir + '/' + files[i];
    let validDir = false;
    try {
      validDir = recursive && fs.statSync(name).isDirectory();
    } catch (error) {
      validDir = false;
      log(LogLevel.ERROR)(`failed to execute "fs.statSync(${name}).isDirectory()"`, error);
    }
    if (validDir) {
      getFiles(name, true, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
};

export const removeFolder = (folderPath: string, options?: { recursive?: boolean, force?: boolean }) => {
  const { recursive = false, force = false } = options || {};
  return fs.promises.rm(folderPath, { recursive, force });
};
