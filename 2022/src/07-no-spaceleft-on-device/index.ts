import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

export type File = { size: number; name: string };
export type Folder = { size: number; name: string; children: Record<string, Folder | File> };

function getSubFolders(folder: Folder): Array<Folder> {
  return Object.values(folder.children).filter((n) => !!(n as Folder).children) as Array<Folder>;
}

export async function getFolderStructure(filename: string): Promise<Folder> {
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, filename)),
  });

  const root: Folder = { size: 0, name: '/', children: {} };
  const folderStack: Array<Folder> = [];
  let currentFolder: Folder = root;

  const createFolderStructure = (line: string): void => {
    const isCommand = line.startsWith('$');
    const isDir = line.startsWith('dir');

    if (isCommand) {
      const [$, command, argument] = line.split(' ');

      switch (command) {
        case 'cd': {
          if (argument === '..') {
            folderStack.pop();

            currentFolder = folderStack.length === 0 ? root : folderStack[folderStack.length - 1];
          } else if (argument !== '/') {
            if (!currentFolder.children[argument]) {
              currentFolder.children[argument] = { name: argument, size: 0, children: {} };
            }

            currentFolder = currentFolder.children[argument] as Folder;
            folderStack.push(currentFolder);
          }
          break;
        }
        case 'ls': {
          break;
        }
      }
    } else if (isDir) {
      const [command, folder] = line.split(' ');

      if (!currentFolder.children[folder]) {
        currentFolder.children[folder] = { name: folder, size: 0, children: {} };
      }
    } else {
      // is file
      const [sizeStr, filename] = line.split(' ');
      const size = Number(sizeStr);

      currentFolder.children[filename] = { size, name: filename };
      currentFolder.size += size;
    }
  };

  rl.on('line', createFolderStructure);

  const updateFolderSizes = (folder: Folder) => {
    const folders: Array<Folder> = getSubFolders(folder);

    if (folders.length > 0) {
      folders.forEach(updateFolderSizes);
    }

    folder.size = Object.values(folder.children).reduce((acc, f) => acc + f.size, 0);
  };

  return new Promise((res) => {
    rl.on('close', () => {
      updateFolderSizes(root);
      res(root);
    });
  });
}

export function noSpaceLeftOnDevicePart1(root: Folder): number {
  const MAX_SIZE = 100000;

  const getSumOfSmallFolders = (folder: Folder): number => {
    const subFolders: Array<Folder> = getSubFolders(folder);

    if (subFolders.length <= 0) {
      return 0;
    }

    const sumOfSmallFoldersInCurrentFolder = subFolders.reduce(
      (acc, f) => (f.size <= MAX_SIZE ? acc + f.size : acc),
      0,
    );

    return subFolders.reduce(
      (acc, subFolder) => acc + getSumOfSmallFolders(subFolder),
      sumOfSmallFoldersInCurrentFolder,
    );
  };

  return getSumOfSmallFolders(root);
}

export function noSpaceLeftOnDevicePart2(root: Folder): number {
  const FILESYSTEM_SIZE = 70000000;
  const SPACE_NEEDED = 30000000;
  const unusedSpace = FILESYSTEM_SIZE - root.size;
  const spaceToFree = SPACE_NEEDED - unusedSpace;

  const getSmallestEnoughSizeToDelete = (folder: Folder, sizeToDelete: number = root.size): number => {
    const wouldFreeEnoughSpace = folder.size >= spaceToFree;
    const hasSmallerSize = folder.size < sizeToDelete;
    const newSizeToDelete = wouldFreeEnoughSpace && hasSmallerSize ? folder.size : sizeToDelete;
    const subFolders: Array<Folder> = getSubFolders(folder);

    if (subFolders.length <= 0) {
      return newSizeToDelete;
    }

    return Math.min(...subFolders.map((f) => getSmallestEnoughSizeToDelete(f, newSizeToDelete)));
  };

  return getSmallestEnoughSizeToDelete(root);
}

export async function runDaySeven() {
  return [
    noSpaceLeftOnDevicePart1(await getFolderStructure('index.input.txt')),
    noSpaceLeftOnDevicePart2(await getFolderStructure('index.input.txt')),
  ];
}
