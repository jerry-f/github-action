

import jsonfile from 'jsonfile';

import { IUser } from '@src/models/User';

import fs from 'fs';


// **** Variables **** //

const DB_FILE_NAME = 'database.json';

// 判断文件是否存在【__dirname + '/' + DB_FILE_NAME】，如果没有则创建
fs.stat(__dirname + '/' + DB_FILE_NAME, (err) => {
  if (err) {
    fs.writeFileSync(__dirname + '/' + DB_FILE_NAME, JSON.stringify({ users: [] }));
  }
})
// **** Types **** //

interface IDb {
  users: IUser[];
}


// **** Functions **** //

/**
 * Fetch the json from the file.
 */
function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

/**
 * Update the file.
 */
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}


// **** Export default **** //

export default {
  openDb,
  saveDb,
} as const;
