// 从 js  文件提取 css
const getCssCode = (assets: string) => {
  const matcher = /push\(\[\w+\.\w+,\s*"(?=[\s\S]*?})([\s\S]+?)(?:\\.)?"\s*,\s*['"]['"]\]\)/g;
  const decl = /\w+\s*:\s*[^\s;]+?;/;

  const ret: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(assets))) {
    if (decl.test(match[1])) {
      ret.push(match[1].replace(/\\n/g, ''));
    }
  }

  return ret.join('\n');
};

export default getCssCode;
