const ProjectsStructure = require('../src/ProjectsStructure');

describe('ProjectsStructure', () => {
  const structure = new ProjectsStructure()
    .addProject('Windows', 'Windows Project Name', null)
    .addProject('WindowsSubProject1', 'Windows SubProject Name', 'Windows')
    .addBuild('WindowsSubProject1Build1', 'Build 1', 'WindowsSubProject1')
    .addBuild('WindowsSubProject1Build2', 'Build 2', 'WindowsSubProject1')
    .addBuild('WindowsSubProject1Build3', 'Build 3', 'WindowsSubProject1')
    .addProject('Linux', 'Linux Project Name', null)
    .addBuild('LinuxBuild1', 'Build 1', 'Linux')
    .addBuild('LinuxBuild2', 'Build 2', 'Linux')
    .addBuild('LinuxBuild3', 'Build 3', 'Linux');

  console.log(JSON.stringify(structure._projects));

  test.each([
    { id: 'Windows', expectedName: 'Windows Project Name' },
    { id: 'WindowsSubProject1Build3', expectedName: 'Build 3' },
    { id: 'NotExistedId', expectedName: 'NotExistedId' },
  ])('$expected when state is $state', async ({ id, expectedName }) => {
    expect(structure.getName(id)).toEqual(expectedName);
  });

  test('toString', () => {
    expect(structure.toString()).toMatchSnapshot();
  });
});
