const mockAxios = require('axios');
const { Teamcity } = require('../src/Teamcity');
const Investigations = require('../src/Investigations');
const ProjectsStructure = require('../src/ProjectsStructure');

const {
  makeBuildWebUrl,
  makeBuildsJson,
  makeRunningBuildsJson,
  makeInvestigationJson,
  makeAllProjectsJson,
  makeAllBuildTypesJson,
} = require('./teamcityTestUtils');

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
}));

describe('Teamcity', () => {
  afterEach(() => {
    mockAxios.get.mockClear();
  });

  test('buildTypeWebUrl', () => {
    const teamcity = new Teamcity({
      serverUrl: 'http://127.0.0.1:8111',
      auth: { username: 'root', password: '123456' },
      branch: 'some-branch',
    });
    expect(teamcity.buildTypeWebUrl('SomeBuildTypeId')).toEqual(
      'http://127.0.0.1:8111/viewType.html?buildTypeId=SomeBuildTypeId'
    );
  });

  describe('lastFinishedFailedBuildUrl', () => {
    test('test axios arguments http based auth', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', 'SUCCESS'),
        })
      );
      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { username: 'root', password: '123456' },
        branch: 'some-branch',
      });
      await teamcity.lastFinishedFailedBuildUrl('SomeBuildTypeId');
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/latest/builds?locator=branch:some-branch,failedToStart:any,running:false,canceled:false,count:1,buildType:(SomeBuildTypeId)',
        {
          headers: { Accept: 'application/json' },
          auth: { username: 'root', password: '123456' },
          withCredentials: true,
        }
      );
    });

    test('test axios arguments token based auth', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', 'SUCCESS'),
        })
      );
      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
        branch: 'some-branch',
      });
      await teamcity.lastFinishedFailedBuildUrl('SomeBuildTypeId');
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/latest/builds?locator=branch:some-branch,failedToStart:any,running:false,canceled:false,count:1,buildType:(SomeBuildTypeId)',
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer sometoken123123asdasdertscgsfgsdf',
          },
        }
      );
    });

    test.each`
      state        | expected
      ${null}      | ${null}
      ${'SUCCESS'} | ${null}
      ${'success'} | ${null}
      ${'suCCeSS'} | ${null}
      ${'UNKNOWN'} | ${null}
      ${'unknown'} | ${null}
      ${'unKnOWN'} | ${null}
      ${'FAILURE'} | ${makeBuildWebUrl('SomeBuildTypeId')}
      ${'failure'} | ${makeBuildWebUrl('SomeBuildTypeId')}
      ${'faIlUrE'} | ${makeBuildWebUrl('SomeBuildTypeId')}
      ${'other'}   | ${makeBuildWebUrl('SomeBuildTypeId')}
    `('$expected when state is $state', async ({ state, expected }) => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', state),
        })
      );
      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
        branch: 'some-branch',
      });
      expect(
        await teamcity.lastFinishedFailedBuildUrl('SomeBuildTypeId')
      ).toEqual(expected);
    });
  });

  describe('runningBuilds', () => {
    test('test axios arguments token based auth', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', 'SUCCESS'),
        })
      );
      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
        branch: 'some-branch',
      });
      await teamcity.runningBuilds('SomeBuildTypeId');
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/latest/builds?locator=branch:some-branch,failedToStart:any,running:true,canceled:false,buildType:(SomeBuildTypeId)',
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer sometoken123123asdasdertscgsfgsdf',
          },
        }
      );
    });

    test.each`
      state        | expected
      ${null}      | ${null}
      ${'SUCCESS'} | ${true}
      ${'success'} | ${true}
      ${'suCCeSS'} | ${true}
      ${'UNKNOWN'} | ${false}
      ${'unknown'} | ${false}
      ${'unKnOWN'} | ${false}
      ${'FAILURE'} | ${false}
      ${'failure'} | ${false}
      ${'faIlUrE'} | ${false}
      ${'other'}   | ${false}
    `('$expected when state is $state', async ({ state, expected }) => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', state),
        })
      );
      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
        branch: 'some-branch',
      });
      expect(await teamcity.runningBuilds('SomeBuildTypeId')).toEqual(
        expected != null
          ? [
              {
                href: makeBuildWebUrl('SomeBuildTypeId'),
                success: expected,
              },
            ]
          : []
      );
    });
  });

  describe('fetchAllInvestigation', () => {
    test('test axios arguments', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeInvestigationJson([]),
        })
      );
      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
        branch: 'some-branch',
      });
      await teamcity.fetchAllInvestigation();
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/latest/investigations',
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer sometoken123123asdasdertscgsfgsdf',
          },
        }
      );
    });

    const investigationTest = (text, json, expected) =>
      test(text, async () => {
        mockAxios.get.mockImplementationOnce(() =>
          Promise.resolve({
            data: makeInvestigationJson(json),
          })
        );
        const teamcity = new Teamcity({
          serverUrl: 'some url',
          auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
          branch: 'some-branch',
        });
        expect(await teamcity.fetchAllInvestigation()).toEqual(expected);
      });

    investigationTest(
      'empty array when no investigation',
      [],
      new Investigations()
    );

    investigationTest(
      'one investigation',
      [{ username: 'user1', buildTypes: ['Build 1'] }],
      new Investigations().addInvestigation('user1', ['Build 1'])
    );

    investigationTest(
      'two investigation one user',
      [{ username: 'user1', buildTypes: ['Build 1', 'Build 2'] }],
      new Investigations().addInvestigation('user1', ['Build 1', 'Build 2'])
    );

    investigationTest(
      'three investigation two user',
      [
        { username: 'user1', buildTypes: ['Build 1', 'Build 2'] },
        { username: 'user2', buildTypes: ['Build 3'] },
      ],
      new Investigations()
        .addInvestigation('user1', ['Build 1', 'Build 2'])
        .addInvestigation('user2', ['Build 3'])
    );
  });

  describe('fetchProjectStructure', () => {
    test('simple-structure', async () => {
      const expectedStructure = new ProjectsStructure()
        .addProject('Windows', 'Windows Project Name', null)
        .addProject('WindowsSubProject1', 'Windows SubProject Name', 'Windows')
        .addBuild('WindowsSubProject1Build1', 'Build 1', 'WindowsSubProject1')
        .addBuild('WindowsSubProject1Build2', 'Build 2', 'WindowsSubProject1')
        .addBuild('WindowsSubProject1Build3', 'Build 3', 'WindowsSubProject1')
        .addProject('Linux', 'Linux Project Name', null)
        .addBuild('LinuxBuild1', 'Build 1', 'Linux')
        .addBuild('LinuxBuild2', 'Build 2', 'Linux')
        .addBuild('LinuxBuild3', 'Build 3', 'Linux');

      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeAllProjectsJson([
            { id: 'Windows', name: 'Windows Project Name' },
            {
              id: 'WindowsSubProject1',
              name: 'Windows SubProject Name',
              parent: 'Windows',
            },
            { id: 'Linux', name: 'Linux Project Name' },
          ]),
        })
      );

      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeAllBuildTypesJson([
            {
              id: 'WindowsSubProject1Build1',
              name: 'Build 1',
              parent: 'WindowsSubProject1',
            },
            {
              id: 'WindowsSubProject1Build2',
              name: 'Build 2',
              parent: 'WindowsSubProject1',
            },
            {
              id: 'WindowsSubProject1Build3',
              name: 'Build 3',
              parent: 'WindowsSubProject1',
            },
            {
              id: 'LinuxBuild1',
              name: 'Build 1',
              parent: 'Linux',
            },
            {
              id: 'LinuxBuild2',
              name: 'Build 2',
              parent: 'Linux',
            },
            {
              id: 'LinuxBuild3',
              name: 'Build 3',
              parent: 'Linux',
            },
          ]),
        })
      );

      const teamcity = new Teamcity({
        serverUrl: 'some url',
        auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
        branch: 'some-branch',
      });

      expect(await teamcity.fetchProjectsStructure()).toEqual(
        expectedStructure
      );
    });
  });

  describe('checkState', () => {
    let fetchAllInvestigationMock;
    let lastFinishedFailedBuildUrlMock;
    let runningBuildsMock;
    let fetchProjectsStructureMock;

    const teamcity = new Teamcity({
      serverUrl: 'some url',
      auth: { token: 'sometoken123123asdasdertscgsfgsdf' },
      branch: 'some-branch',
    });

    beforeEach(() => {
      fetchAllInvestigationMock = jest.spyOn(teamcity, 'fetchAllInvestigation');
      lastFinishedFailedBuildUrlMock = jest.spyOn(
        teamcity,
        'lastFinishedFailedBuildUrl'
      );
      runningBuildsMock = jest.spyOn(teamcity, 'runningBuilds');
      fetchProjectsStructureMock = jest.spyOn(
        teamcity,
        'fetchProjectsStructure'
      );
    });

    afterEach(() => {
      fetchAllInvestigationMock.mockRestore();
      lastFinishedFailedBuildUrlMock.mockRestore();
      runningBuildsMock.mockRestore();
      fetchProjectsStructureMock.mockRestore();
    });

    const structure = new ProjectsStructure()
      .addBuild('Build 1', 'Build 1 Name', null)
      .addBuild('Build 2', 'Build 2 Name', null);

    test.each([
      {
        text: 'one build - no failed',
        buildTypes: ['Build 1'],
        investigations: new Investigations(),
        failedBuilds: [],
        runningBuilds: {},
        expected: { items: [], status: 'success' },
      },
      {
        text: 'one build - failed',
        buildTypes: ['Build 1'],
        investigations: new Investigations(),
        failedBuilds: ['Build 1'],
        runningBuilds: {},
        expected: {
          items: [
            {
              id: 'Build 1',
              displayName: 'Build 1 Name',
              href: 'http://localhost:8111/viewLog.html?buildId=1&buildTypeId=Build 1',
              investigators: [],
              running: false,
            },
          ],
          status: 'fail',
        },
      },
      {
        text: 'one build - running failed',
        buildTypes: ['Build 1'],
        investigations: new Investigations(),
        failedBuilds: [],
        runningBuilds: {
          'Build 1': [{ href: makeBuildWebUrl('Build 1'), success: false }],
        },
        expected: {
          items: [
            {
              id: 'Build 1',
              displayName: 'Build 1 Name',
              href: `${teamcity.buildTypeWebUrl('Build 1')}`,
              investigators: [],
              running: true,
            },
          ],
          status: 'fail',
        },
      },
      {
        text: 'one build - running success',
        buildTypes: ['Build 1'],
        investigations: new Investigations(),
        failedBuilds: [],
        runningBuilds: {
          'Build 1': [{ href: makeBuildWebUrl('Build 1'), success: true }],
        },
        expected: { items: [], status: 'success' },
      },
      {
        text: 'one build - failed running success',
        buildTypes: ['Build 1'],
        investigations: new Investigations(),
        failedBuilds: ['Build 1'],
        runningBuilds: {
          'Build 1': [{ href: makeBuildWebUrl('Build 1'), success: true }],
        },
        expected: {
          items: [
            {
              id: 'Build 1',
              displayName: 'Build 1 Name',
              href: 'http://localhost:8111/viewLog.html?buildId=1&buildTypeId=Build 1',
              investigators: [],
              running: true,
            },
          ],
          status: 'fail',
        },
      },
      {
        text: 'two build - failed',
        buildTypes: ['Build 1', 'Build 2'],
        investigations: new Investigations(),
        failedBuilds: ['Build 1', 'Build 2'],
        runningBuilds: {},
        expected: {
          items: [
            {
              id: 'Build 1',
              displayName: 'Build 1 Name',
              href: 'http://localhost:8111/viewLog.html?buildId=1&buildTypeId=Build 1',
              investigators: [],
              running: false,
            },
            {
              id: 'Build 2',
              displayName: 'Build 2 Name',
              href: 'http://localhost:8111/viewLog.html?buildId=1&buildTypeId=Build 2',
              investigators: [],
              running: false,
            },
          ],
          status: 'fail',
        },
      },
      {
        text: 'two build - failed one same investigator',
        buildTypes: ['Build 1', 'Build 2'],
        investigations: new Investigations().addInvestigation('user1', [
          'Build 1',
          'Build 2',
        ]),
        failedBuilds: ['Build 1', 'Build 2'],
        runningBuilds: {},
        expected: {
          items: [
            {
              id: 'Build 1',
              href: 'http://localhost:8111/viewLog.html?buildId=1&buildTypeId=Build 1',
              displayName: 'Build 1 Name',
              investigators: ['user1'],
              running: false,
            },
            {
              id: 'Build 2',
              displayName: 'Build 2 Name',
              href: 'http://localhost:8111/viewLog.html?buildId=1&buildTypeId=Build 2',
              investigators: ['user1'],
              running: false,
            },
          ],
          status: 'fail',
        },
      },
    ])(
      '$text',
      async ({
        buildTypes,
        investigations,
        failedBuilds,
        runningBuilds,
        expected,
      }) => {
        fetchAllInvestigationMock.mockImplementation(() =>
          Promise.resolve(investigations)
        );
        lastFinishedFailedBuildUrlMock.mockImplementation((buildTypeId) =>
          Promise.resolve(
            failedBuilds.includes(buildTypeId)
              ? makeBuildWebUrl(buildTypeId)
              : null
          )
        );
        runningBuildsMock.mockImplementation((buildTypeId) =>
          Promise.resolve(
            buildTypeId in runningBuilds ? runningBuilds[buildTypeId] : []
          )
        );
        fetchProjectsStructureMock.mockImplementation(() =>
          Promise.resolve(structure)
        );

        expect(await teamcity.checkState(buildTypes)).toEqual(expected);
      }
    );

    test.each`
      buildTypes
      ${['Build 1']}
      ${['Build 1', 'Build 2']}
    `(
      'check call and args for sub functions for $buildTypes.length build types',
      async ({ buildTypes }) => {
        fetchAllInvestigationMock.mockImplementationOnce(() =>
          Promise.resolve(new Investigations())
        );
        lastFinishedFailedBuildUrlMock.mockImplementationOnce((buildId) =>
          Promise.resolve(buildId)
        );
        runningBuildsMock.mockImplementationOnce(() => Promise.resolve([]));
        fetchProjectsStructureMock.mockImplementationOnce(() =>
          Promise.resolve(structure)
        );

        await teamcity.checkState(buildTypes);

        expect(fetchAllInvestigationMock).toHaveBeenCalledTimes(1);
        expect(fetchAllInvestigationMock).toHaveBeenCalledWith();

        expect(lastFinishedFailedBuildUrlMock).toHaveBeenCalledTimes(
          buildTypes.length
        );
        expect(runningBuildsMock).toHaveBeenCalledTimes(buildTypes.length);

        for (const [i, buildType] of buildTypes.entries()) {
          expect(lastFinishedFailedBuildUrlMock).toHaveBeenNthCalledWith(
            i + 1,
            buildType
          );
          expect(runningBuildsMock).toHaveBeenNthCalledWith(i + 1, buildType);
        }
        expect(fetchProjectsStructureMock).toHaveBeenCalledTimes(1);
        expect(fetchProjectsStructureMock).toHaveBeenCalledWith();
      }
    );
  });
});
