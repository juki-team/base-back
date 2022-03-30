import util from 'util';

export const logMessage = (message: any) => {
  const now = new Date();
  console.log(`[MSG] ${now}, ${message}`);
};

export const logInfo = (content: any, title?: string) => {
  const now = new Date();
  console.log(`[INFO] ${now}` + (title ? `, ${title}:` : ':'));
  console.log(util.inspect(content, { depth: 5, compact: false }));
  console.log(`------`);
};

export const logError = (content: any, title?: string) => {
  const now = new Date();
  console.log(`[ERROR] ${now}` + (title ? `, ${title}:` : ':'));
  console.log(util.inspect(content, { depth: 5, compact: false }));
  console.log(`_______`);
};