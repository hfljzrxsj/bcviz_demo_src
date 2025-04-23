#!/usr/bin/env node
//@ts-check
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. 获取基准路径
const __filename = fileURLToPath(import.meta.url);
const baseDir1 = path.dirname(path.dirname(__filename));
const baseDir2 = path.dirname(baseDir1);

// 2. 生成sourceList
const sourceList = fs.readdirSync(baseDir1)
  .filter(file => {
    const fullPath = path.join(baseDir1, file);
    return fs.statSync(fullPath).isFile() && path.extname(file) === '.txt';
  })
  .map(file => path.join(baseDir1, file));

// 3. 生成distList
const distList = fs.readdirSync(baseDir2)
  .filter(folder => {
    const fullPath = path.join(baseDir2, folder);
    return fs.statSync(fullPath).isDirectory() && /^v\d+$/.test(folder);
  })
  .map(folder => path.join(baseDir2, folder));

// 4. 处理datasets目录
for (const distPath of distList) {
  const datasetsPath = path.join(distPath, 'datasets');

  if (!fs.existsSync(datasetsPath)) {
    fs.mkdirSync(datasetsPath);
    console.log(`Created directory: ${datasetsPath}`);
  }

  // 5. 创建软链接
  for (const sourceFile of sourceList) {
    const filename = path.basename(sourceFile);
    const linkPath = path.join(datasetsPath, filename);

    if (!fs.existsSync(linkPath)) {
      try {
        fs.symlinkSync(sourceFile, linkPath);
        console.log(`Created symlink: ${linkPath} -> ${sourceFile}`);
      } catch (err) {
        console.error(`Error creating symlink ${linkPath}:`, err);
      }
    }
  }
}