import mockAxios from 'axios';
import { Teamcity, Investigations } from '../src/Teamcity';
import {
  makeBuildsJson,
  makeRunningBuildsJson,
  makeInvestigationJson,
} from './teamcityTestUtils';

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
}));

describe('Teamcity', () => {
  const teamcity = new Teamcity(
    'some url',
    { username: 'root', password: '123456' },
    'some-branch'
  );

  afterEach(() => {
    mockAxios.get.mockClear();
  });

  describe('isFinishedBuildFail', () => {
    test('test axios arguments', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', 'SUCCESS'),
        })
      );
      await teamcity.isFinishedBuildFail('SomeBuildTypeId');
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/builds?locator=branch:some-branch,failedToStart:any,running:false,canceled:false,count:1,buildType:(SomeBuildTypeId)',
        {
          headers: { Accept: 'application/json' },
          auth: { username: 'root', password: '123456' },
        }
      );
    });

    test.each`
      state        | expected
      ${null}      | ${false}
      ${'SUCCESS'} | ${false}
      ${'success'} | ${false}
      ${'suCCeSS'} | ${false}
      ${'UNKNOWN'} | ${false}
      ${'unknown'} | ${false}
      ${'unKnOWN'} | ${false}
      ${'FAILURE'} | ${true}
      ${'failure'} | ${true}
      ${'faIlUrE'} | ${true}
      ${'other'}   | ${true}
    `('$expected when state is $state', async ({ state, expected }) => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', state),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
        expected
      );
    });
  });

  describe('isRunningBuildSuccess', () => {
    test('test axios arguments', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', 'SUCCESS'),
        })
      );
      await teamcity.isRunningBuildSuccess('SomeBuildTypeId');
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/builds?locator=branch:some-branch,failedToStart:any,running:true,canceled:false,count:1,buildType:(SomeBuildTypeId)',
        {
          headers: { Accept: 'application/json' },
          auth: { username: 'root', password: '123456' },
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
      expect(await teamcity.isRunningBuildSuccess('SomeBuildTypeId')).toEqual(
        expected
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
      await teamcity.fetchAllInvestigation();
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'some url/app/rest/investigations',
        {
          headers: { Accept: 'application/json' },
          auth: { username: 'root', password: '123456' },
        }
      );
    });

    test('empty array when no investigation', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeInvestigationJson([]),
        })
      );
      expect(await teamcity.fetchAllInvestigation()).toEqual(
        new Investigations()
      );
    });

    test('one investigation', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeInvestigationJson([
            { username: 'user1', buildTypes: ['Build 1'] },
          ]),
        })
      );
      expect(await teamcity.fetchAllInvestigation()).toEqual(
        new Investigations().addInvestigation('user1', ['Build 1'])
      );
    });

    test('two investigation one user', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeInvestigationJson([
            { username: 'user1', buildTypes: ['Build 1', 'Build 2'] },
          ]),
        })
      );
      expect(await teamcity.fetchAllInvestigation()).toEqual(
        new Investigations().addInvestigation('user1', ['Build 1', 'Build 2'])
      );
    });

    test('three investigation two user', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeInvestigationJson([
            { username: 'user1', buildTypes: ['Build 1', 'Build 2'] },
            { username: 'user2', buildTypes: ['Build 3'] },
          ]),
        })
      );
      expect(await teamcity.fetchAllInvestigation()).toEqual(
        new Investigations()
          .addInvestigation('user1', ['Build 1', 'Build 2'])
          .addInvestigation('user2', ['Build 3'])
      );
    });
  });

  describe('checkState', () => {
    let fetchAllInvestigationMock;
    let isFinishedBuildFailMock;
    let isRunningBuildSuccessMock;

    beforeEach(() => {
      fetchAllInvestigationMock = jest.spyOn(teamcity, 'fetchAllInvestigation');
      isFinishedBuildFailMock = jest.spyOn(teamcity, 'isFinishedBuildFail');
      isRunningBuildSuccessMock = jest.spyOn(teamcity, 'isRunningBuildSuccess');
    });

    afterEach(() => {
      fetchAllInvestigationMock.mockRestore();
      isFinishedBuildFailMock.mockRestore();
      isRunningBuildSuccessMock.mockRestore();
    });

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
        isFinishedBuildFailMock.mockImplementationOnce(() =>
          Promise.resolve(false)
        );
        isRunningBuildSuccessMock.mockImplementationOnce(() =>
          Promise.resolve(null)
        );

        await teamcity.checkState(buildTypes);

        expect(fetchAllInvestigationMock).toHaveBeenCalledTimes(1);
        expect(fetchAllInvestigationMock).toHaveBeenCalledWith();

        expect(isFinishedBuildFailMock).toHaveBeenCalledTimes(
          buildTypes.length
        );
        expect(isRunningBuildSuccessMock).toHaveBeenCalledTimes(
          buildTypes.length
        );

        for (const [i, buildType] of buildTypes.entries()) {
          expect(isFinishedBuildFailMock).toHaveBeenNthCalledWith(
            i + 1,
            buildType
          );
          expect(isRunningBuildSuccessMock).toHaveBeenNthCalledWith(
            i + 1,
            buildType
          );
        }
      }
    );
  });
});
