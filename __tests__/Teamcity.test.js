import mockAxios from 'axios';
import { Teamcity } from '../src/Teamcity';

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
}));

const makeJson = (buildTypeId, statuses) => {
  let buildArr = statuses.map((status, index) => ({
    id: index,
    buildTypeId: buildTypeId,
    number: `${index}`,
    status: status,
    state: 'finished',
    href: `/app/rest/builds/id:${index}`,
    webUrl: `http://localhost:8111/viewLog.html?buildId=${index}&buildTypeId=${buildTypeId}`,
  }));

  return {
    count: buildArr.length,
    href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
    nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
    build: buildArr,
  };
};

const makeRunningBuildsJson = (buildTypeId, statuses) => {
  let buildArr = statuses.map((status, index) => ({
    id: index,
    buildTypeId: buildTypeId,
    number: `${index}`,
    status: status,
    state: 'running',
    percentageComplete: 34,
    href: `/app/rest/builds/id:${index}`,
    webUrl: `http://localhost:8111/viewLog.html?buildId=${index}&buildTypeId=${buildTypeId}`,
  }));

  return {
    count: buildArr.length,
    href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
    nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
    build: buildArr,
  };
};

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
          data: makeJson('SomeBuildTypeId', ['SUCCESS']),
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
          data: makeJson('SomeBuildTypeId', []),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when SUCCESS state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['SUCCESS']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when success state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['success']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when suCCeSS state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['suCCeSS']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when UNKNOWN state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['UNKNOWN']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when unknown state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['unknown']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('false when unKnOWN state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['unKnOWN']),
        })
      );
      expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toBeFalsy();
    });

    test('true when FAILURE state upper case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['FAILURE']),
        })
      );
      expect(
        await teamcity.isFinishedBuildFail('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('true when failure state lower case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['failure']),
        })
      );
      expect(
        await teamcity.isFinishedBuildFail('SomeBuildTypeId')
      ).toBeTruthy();
    });

    test('true when faIlUrE state different case', async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeJson('SomeBuildTypeId', ['faIlUrE']),
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
});
