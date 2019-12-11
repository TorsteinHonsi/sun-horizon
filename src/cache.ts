import { CacheData } from './types';
const folderSize = require('folder-size');
const findRemoveSync = require('find-remove');
const fs = require('fs');
const TileSet = require('node-hgt').TileSet;
const ImagicoElevationDownloader = require('node-hgt').ImagicoElevationDownloader;

let CACHE_DIRECTORY = 'sun-horizon-data/';
let tiles = {};

export function init(cacheDirectory?: string) {
  if (cacheDirectory) CACHE_DIRECTORY = cacheDirectory;
  createDataFolderIfNotExists();
  const tileDownloader = new ImagicoElevationDownloader(CACHE_DIRECTORY);
  tiles = new TileSet(CACHE_DIRECTORY, {downloader: tileDownloader});

}

export function getTiles(): any {
  return tiles;
}

export function getCacheData(): Promise<CacheData> {
  createDataFolderIfNotExists();
  return new Promise((resole, reject) => {
    folderSize(CACHE_DIRECTORY, { ignoreHidden: true }, function(err: any, data: any) {
      if (err) reject(err);
      resole(data.hgt || {files: 0, bytes: 0});
    });
  });
}

export async function cleanCache(): Promise<number> {
  createDataFolderIfNotExists();
  const files = (await getCacheData()).files;
  if (files <= 0) return 0;
  return Object.keys(findRemoveSync(CACHE_DIRECTORY, {extensions: ['.hgt']})).length;
}

export function createDataFolderIfNotExists() {
  if (!fs.existsSync(CACHE_DIRECTORY)) {
    fs.mkdirSync(CACHE_DIRECTORY);
    fs.writeFileSync(CACHE_DIRECTORY + '.gitignore', '*.hgt');
  }
}