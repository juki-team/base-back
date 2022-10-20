import fs from 'fs';

export const readFile = (fileName: string) => fs.promises.readFile(fileName, 'utf8');

export const writeFile = (fileName: string, data: string) => fs.promises.writeFile(fileName, data);

export const getFiles = (dir: string, recursive: true, files__?: string[]) => {
  const files_: string[] = files__ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (recursive && fs.statSync(name).isDirectory()) {
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
