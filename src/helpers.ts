import { promises as fs } from 'fs';
import { join } from 'path';

export function readDir(path: string): Promise<string[]> {
  return fs.readdir(path);
}

export function readFile(path: string): Promise<Buffer> {
  return fs.readFile(path);
}

export function generateKey(keyPrefix: string, key: string): string {
  return join(keyPrefix, key);
}
