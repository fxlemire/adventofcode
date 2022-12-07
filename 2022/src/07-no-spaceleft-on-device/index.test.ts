import { Folder, getFolderStructure, noSpaceLeftOnDevicePart1, noSpaceLeftOnDevicePart2 } from '.';

describe('Day 7: No Space Left On Device', () => {
  describe('getFolderStructure', () => {
    it('should return the correct folder structure', async () => {
      const tree = await getFolderStructure('index.input.test.txt');
      const expected: Folder = {
        name: '/',
        size: 584 + 29116 + 2557 + 62596 + 14848514 + 8504156 + 4060174 + 8033020 + 5626152 + 7214296,
        children: {
          a: {
            name: 'a',
            size: 584 + 29116 + 2557 + 62596,
            children: {
              e: {
                name: 'e',
                size: 584,
                children: {
                  i: { name: 'i', size: 584 },
                },
              },
              f: { name: 'f', size: 29116 },
              g: { name: 'g', size: 2557 },
              'h.lst': {
                name: 'h.lst',
                size: 62596,
              },
            },
          },
          'b.txt': { name: 'b.txt', size: 14848514 },
          'c.dat': { name: 'c.dat', size: 8504156 },
          d: {
            name: 'd',
            size: 4060174 + 8033020 + 5626152 + 7214296,
            children: {
              j: { name: 'j', size: 4060174 },
              'd.log': { name: 'd.log', size: 8033020 },
              'd.ext': { name: 'd.ext', size: 5626152 },
              k: { name: 'k', size: 7214296 },
            },
          },
        },
      };

      expect(tree).toEqual(expected);
    });
  });

  describe('noSpaceLeftOnDevicePart1', () => {
    it('should return sum of directories with a total size of at most 100000', async () => {
      expect(noSpaceLeftOnDevicePart1(await getFolderStructure('index.input.test.txt'))).toBe(95437);
    });
  });

  describe('noSpaceLeftOnDevicePart2', () => {
    it('should return the size of the smallest folder that will free enough space', async () => {
      expect(noSpaceLeftOnDevicePart2(await getFolderStructure('index.input.test.txt'))).toBe(24933642);
    });
  });
});
