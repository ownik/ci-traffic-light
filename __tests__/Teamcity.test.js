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
  let teamcity;
  beforeEach(() => {
    teamcity = new Teamcity(
      'some url',
      { username: 'root', password: '123456' },
      'some-branch'
    );
  });

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

    test('false when no builds', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', []),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when SUCCESS state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['SUCCESS']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when success state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['success']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when suCCeSS state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['suCCeSS']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when UNKNOWN state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['UNKNOWN']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when unknown state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['unknown']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when unKnOWN state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['unKnOWN']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('true when FAILURE state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['FAILURE']),
        })
      );
      expect(
        await teamcity.isFinishedBuildFail('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('true when failure state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['failure']),
        })
      );
      expect(
        await teamcity.isFinishedBuildFail('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('true when faIlUrE state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson('SomeBuildTypeId', ['faIlUrE']),
        })
      );
      expect(
        await teamcity.isFinishedBuildFail('SomeBuildTypeId')
      ).toBeTruthy();
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
});
