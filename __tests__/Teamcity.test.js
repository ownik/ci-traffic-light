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
          data: makeBuildsJson('SomeBuildTypeId', ['SUCCESS']),
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
      state                     | expected
      ${[]}                     | ${false}
      ${['SUCCESS']}            | ${false}
      ${['success']}            | ${false}
      ${['suCCeSS']}            | ${false}
      ${['UNKNOWN']}            | ${false}
      ${['unknown']}            | ${false}
      ${['unKnOWN']}            | ${false}
      ${['FAILURE']}            | ${true}
      ${['failure']}            | ${true}
      ${['faIlUrE']}            | ${true}
      ${['other']}              | ${true}
      ${['SUCCESS', 'FAILURE']} | ${false}
      ${['FAILURE', 'SUCCESS']} | ${true}
    `('$expected when states is $state', async ({ state, expected }) => {
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
          data: makeRunningBuildsJson('SomeBuildTypeId', ['SUCCESS']),
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

    test('null when no running builds', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', []),
        })
      );
      expect(
        await teamcity.isRunningBuildSuccess('SomeBuildTypeId')
      ).toBeNull();
    });

    test('false when SUCCESS state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', ['SUCCESS']),
        })
      );
      expect(
        await teamcity.isRunningBuildSuccess('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('false when success state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', ['success']),
        })
      );
      expect(
        await teamcity.isRunningBuildSuccess('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('false when suCCeSS state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', ['suCCeSS']),
        })
      );
      expect(
        await teamcity.isRunningBuildSuccess('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('false when FAILURE state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', ['FAILURE']),
        })
      );
      expect(
        await teamcity.isRunningBuildSuccess('SomeBuildTypeId')
      ).toBeFalsy();
    });

    test('false when UNKNOWN state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson('SomeBuildTypeId', ['UNKNOWN']),
        })
      );
      expect(
        await teamcity.isRunningBuildSuccess('SomeBuildTypeId')
      ).toBeFalsy();
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
        expect(isFinishedBuildFailMock).toHaveBeenCalledTimes(
          buildTypes.length
        );
        expect(isRunningBuildSuccessMock).toHaveBeenCalledTimes(
          buildTypes.length
        );

        expect(fetchAllInvestigationMock).toHaveBeenCalledWith();
      }
    );
  });
});
