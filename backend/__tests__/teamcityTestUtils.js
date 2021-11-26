const makeBuildsJson = (buildTypeId, status) => {
  if (status === null) {
    return {
      href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
      nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
    };
  }

  return {
    count: 1,
    href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
    nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
    build: [
      {
        id: 1,
        buildTypeId: buildTypeId,
        number: '1',
        status: status,
        state: 'finished',
        href: `/app/rest/builds/id:1`,
        webUrl: `http://localhost:8111/viewLog.html?buildId=1&buildTypeId=${buildTypeId}`,
      },
    ],
  };
};

const makeRunningBuildsJson = (buildTypeId, status) => {
  if (status === null) {
    return {
      href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
      nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
    };
  }

  return {
    count: 1,
    href: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
    nextHref: `/app/rest/builds?locator=branch:(default:true),failedToStart:any,running:false,canceled:false,count:1,buildType:${buildTypeId},start:1`,
    build: [
      {
        id: 1,
        buildTypeId: buildTypeId,
        number: '1',
        status: status,
        state: 'running',
        percentageComplete: 34,
        href: `/app/rest/builds/id:1`,
        webUrl: `http://localhost:8111/viewLog.html?buildId=1&buildTypeId=${buildTypeId}`,
      },
    ],
  };
};

const makeInvestigationJson = (arr) => {
  if (arr.length === 0) {
    return {
      href: '/app/rest/investigations',
    };
  }

  let investigations = arr.map((item) => ({
    id: `buildType:(id:${item.buildType})`,
    state: 'TAKEN',
    href: `/app/rest/investigations/buildType:(id:${item.buildType})`,
    assignee: {
      username: item.username,
      id: 1,
      href: '/app/rest/users/id:1',
    },
    assignment: {
      timestamp: '20200616T172532+0300',
      user: {
        username: 'root',
        id: 1,
        href: '/app/rest/users/id:1',
      },
    },
    scope: {
      buildTypes: {
        count: 1,
        buildType: item.buildTypes.map((buildType) => ({
          id: buildType,
          name: 'Build 1',
          projectName: 'Main',
          projectId: 'Main',
          href: `/app/rest/buildTypes/id:${buildType}`,
          webUrl: `http://localhost:8111/viewType.html?buildTypeId=${buildType}`,
        })),
      },
    },
    target: {
      anyProblem: true,
    },
    resolution: {
      type: 'whenFixed',
    },
  }));

  return {
    count: 1,
    href: '/app/rest/investigations',
    investigation: investigations,
  };
};

module.exports = {
  makeBuildsJson,
  makeRunningBuildsJson,
  makeInvestigationJson,
};
