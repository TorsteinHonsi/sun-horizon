import { CacheData } from './types';
const folderSize = require('folder-size');
const findRemoveSync = require('find-remove')

const DATA_PATH = 'data/';

export function getCacheData(path: string = DATA_PATH): Promise<CacheData> {
  return new Promise((resole, reject) => {
    folderSize(DATA_PATH, { ignoreHidden: true }, function(err: any, data: any) {
      if (err) reject(err);
      resole(data.hgt || {files: 0, bytes: 0});
    });
  });
}

export async function cleanCache(path: string = DATA_PATH): Promise<number> {
  const files = (await getCacheData(path)).files;
  if (files <= 0) return 0;
  return Object.keys(findRemoveSync(path, {extensions: ['.hgt']})).length;
}