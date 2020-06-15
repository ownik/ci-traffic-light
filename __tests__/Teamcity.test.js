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

  test('isFinishedBuildFail test axios arguments', async () => {
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

  test('isFinishedBuildFail false when no builds', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', []),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail false when SUCCESS state upper case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['SUCCESS']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail false when success state lower case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['success']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail false when suCCeSS state different case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['suCCeSS']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail false when UNKNOWN state upper case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['UNKNOWN']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail false when unknown state lower case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['unknown']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail false when unKnOWN state different case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['unKnOWN']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(
      false
    );
  });

  test('isFinishedBuildFail true when FAILURE state upper case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['FAILURE']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(true);
  });

  test('isFinishedBuildFail true when failure state lower case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['failure']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(true);
  });

  test('isFinishedBuildFail true when faIlUrE state different case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: makeJson('SomeBuildTypeId', ['faIlUrE']),
      })
    );
    expect(await teamcity.isFinishedBuildFail('SomeBuildTypeId')).toEqual(true);
  });
});
