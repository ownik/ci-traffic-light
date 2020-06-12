import mockAxios from 'axios';
import { isFinishedBuildFail } from '../src/Teamcity';

jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
}));

const makeJson = (buildTypeId, status) => ({
  count: 1,
  href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
  nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
  build: [
    {
      id: 2,
      buildTypeId: buildTypeId,
      number: '2',
      status: status,
      state: 'finished',
      href: '/app/rest/builds/id:2',
      webUrl: `http://localhost:8111/viewLog.html?buildId=2&buildTypeId=${buildTypeId}`,
    },
  ],
});
const isFinishedBuildFailWrapper = () =>
  isFinishedBuildFail('some url', 'some-branch', 'SomeBuildTypeId');

describe('Teamcity', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  test('isFinishedBuildFail test axios arguments', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'SUCCESS') })
    );
    await isFinishedBuildFail('some url', 'some-branch', 'SomeBuildTypeId');
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(
      mockAxios.get
    ).toHaveBeenCalledWith(
      'some url/app/rest/builds?locator=branch:some-branch,failedToStart:any,running:false,canceled:false,count:1,buildType:(SomeBuildTypeId)',
      { headers: { Accept: 'application/json' } }
    );
  });

  test('isFinishedBuildFail false when SUCCESS state upper case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'SUCCESS') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(false);
  });

  test('isFinishedBuildFail false when success state lower case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'success') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(false);
  });

  test('isFinishedBuildFail false when suCCeSS state different case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'suCCeSS') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(false);
  });

  test('isFinishedBuildFail false when UNKNOWN state upper case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'UNKNOWN') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(false);
  });

  test('isFinishedBuildFail false when unknown state lower case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'unknown') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(false);
  });

  test('isFinishedBuildFail false when unKnOWN state different case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'unKnOWN') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(false);
  });

  test('isFinishedBuildFail true when failure state upper case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'FAILURE') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(true);
  });

  test('isFinishedBuildFail true when failure state lower case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'failure') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(true);
  });

  test('isFinishedBuildFail true when faIlUrE state different case', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: makeJson('SomeBuildTypeId', 'faIlUrE') })
    );
    expect(await isFinishedBuildFailWrapper()).toEqual(true);
  });
});
