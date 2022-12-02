import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

interface Program {
  name: string;
  weight: number;
  weightTotal?: number;
  children: string[];
}

const getProgramsArray = async (file: string): Promise<Program[]> => {
  return new Promise<Program[]>((res) => {
    const programs: Program[] = [];
    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/07-recursive-circus/${file}.txt`)),
    } as any);

    rl.on('line', (line: string) => {
      const inputs = line.match(/\w+/g);
      const name = inputs.shift();
      const weight = parseInt(inputs.shift(), 10);

      programs.push({ name, weight, children: inputs });
    });
    rl.on('close', () => res(programs));
  });
};

const getBottomProgramName = async (file: string | Program[]): Promise<string> => {
  const programs = typeof file === 'string' ? await getProgramsArray(file) : [...file];
  const programsDict = programs.reduce(
    (dict, p) => {
      p.children.forEach(pp => dict[pp] = dict[pp] + 1 || 1);
      dict[p.name] = dict[p.name] + 1 || 1;
      return dict;
    },
    {} as {[key: string]: number});

  return Object.keys(programsDict).find(name => programsDict[name] === 1);
};

const getUnbalancedFix = async (file: string): Promise<number> => {
  const programsArray = await getProgramsArray(file);
  const rootProgramName = await getBottomProgramName(programsArray);
  const programs: {[name: string]: Program} = programsArray.reduce((dict, p) => ({ ...dict, [p.name]: p }), {});

  /**
   * Recursively computes a program's total weight (program's weight + children's total weight) and mutates programs.
   *
   * @param {string} programName
   * @returns {number}
   */
  const computeTotalWeights = (programName: string): number => {
    if (programs[programName].children.length === 0) {
      programs[programName].weightTotal = programs[programName].weight;

      return programs[programName].weightTotal;
    }

    programs[programName].weightTotal = programs[programName].children.reduce(
      (acc, child) => acc + computeTotalWeights(child),
      programs[programName].weight,
    );

    return programs[programName].weightTotal;
  };

  /**
   * Recursively finds the unique different weight among children.
   * Stops when there are no more children or when the children's weights are all the same.
   *
   * @param {string} [programName] Name of the program from where to start the analysis. Root if undefined.
   * @param {string} [parent] Parent's name of the currently analyzed program.
   * @returns {{parent: string, child: string}} `child` is the unbalanced program. `parent` is its parent.
   */
  const getFaultyChildProgram = (programName?: string, parent?: string): {parent: string, child: string} => {
    const name = programName || rootProgramName;

    if (programs[name].children.length === 0) {
      return { parent, child: programName };
    }

    const childrenAverageWeight = programs[name].children.reduce(
      (acc, child) => acc + programs[child].weightTotal / programs[name].children.length,
      0,
    );

    if (programs[programs[name].children[0]].weightTotal === childrenAverageWeight) {
      return { parent, child: name };
    }

    const childrenWeights = programs[name].children
      .map(child => (
        { name: programs[child].name, weight: programs[child].weightTotal }
      ))
      .sort((a, b) => a.weight <= b.weight ? 1 : -1);

    const faultyChild = childrenWeights[0].weight === childrenWeights[1].weight
      ? childrenWeights[childrenWeights.length - 1]
      : childrenWeights[0];

    return getFaultyChildProgram(faultyChild.name, name);
  };

  computeTotalWeights(rootProgramName);
  const { parent, child } = getFaultyChildProgram();

  const aSibling = programs[parent].children.find(
    c => programs[c].weightTotal !== programs[child].weightTotal,
  );
  const siblingWeight = programs[aSibling].weightTotal;
  const weightDifferenceWithSiblings = Math.abs(siblingWeight - programs[child].weightTotal);
  const adjustedWeight = programs[child].weight - weightDifferenceWithSiblings;

  return adjustedWeight;
};

(async function () {
  console.log(`Test should be 'tknk': ${await getBottomProgramName('test')}`);
  console.log(`Result: ${await getBottomProgramName('tower')}`);
  console.log(`Test should be 60: ${await getUnbalancedFix('test')}`);
  console.log(`Result: ${await getUnbalancedFix('tower')}`);
})();
