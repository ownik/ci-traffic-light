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

  test.each`
    id                            | expectedName
    ${'Windows'}                  | ${'Windows Project Name'}
    ${'WindowsSubProject1Build3'} | ${'Build 3'}
    ${'NotExistedId'}             | ${'NotExistedId'}
  `('$expected when state is $state', async ({ id, expectedName }) => {
    expect(structure.getName(id)).toEqual(expectedName);
  });
});
