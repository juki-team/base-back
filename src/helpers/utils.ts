export const stringifyObject = function (obj: any, depth: number, indent = 0) {
  
  if (depth < 0) {
    return '';
  }
  
  if (typeof obj === 'function') {
    return obj.toString();
  } else if (typeof obj === 'object' && obj !== null) {
    const indentStr = ' '.repeat(indent);
    const entries: string = Object.getOwnPropertyNames(obj).map((key) => {
      const value = obj[key];
      if (typeof value === 'function') {
        return `${indentStr}    ${key}: ${value.toString()},`;
      } else if (typeof value === 'object' && value !== null) {
        return `${indentStr}    ${key}: ${stringifyObject(value, depth - 1, indent + 4)},`;
      }
      return `${indentStr}    ${key}: ${JSON.stringify(value)},`;
    }).join('\n');
    return `{\n${entries}\n${indentStr}}`;
  }
  
  return JSON.stringify(obj);
};
