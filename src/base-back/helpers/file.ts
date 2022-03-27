import fs from 'fs';

export const readFile = (fileName: string) => fs.readFileSync(fileName, 'utf8');

export const writeFile = (fileName: string, data: string) => fs.writeFileSync(fileName, data);

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

export const removeFolder = (folderPath: string, { recursive = true }: { recursive: boolean }) => fs.rmdirSync(folderPath, { recursive });
