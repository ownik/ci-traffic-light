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

const rootProject = {
  id: '_Root',
  name: '<Root project>',
  description: 'Contains all other projects',
  href: '/app/rest/projects/id:_Root',
  webUrl: 'http://127.0.0.1:8111/project.html?projectId=_Root',
};

const makeAllProjectsJson = (arr) => {
  const allProject = [rootProject].concat(arr).map((item) => ({
    id: item.id,
    name: item.name,
    parentProjectId: item.parent ? item.parent : rootProject.id,
    href: `/app/rest/projects/id:${item.id}`,
    webUrl: `http://127.0.0.1:8111/project.html?projectId=${item.id}`,
  }));

  return {
    count: allProject.length,
    href: '/app/rest/projects',
    project: allProject,
  };
};

const makeAllBuildTypesJson = (arr) => {
  const allBuildTypes = arr.map((item) => ({
    id: item.id,
    name: item.name,
    projectName: item.parent ? item.parent : rootProject.id,
    projectId: item.parent ? item.parent : rootProject,
    href: `/app/rest/buildTypes/id:${item.id}`,
    webUrl: `http://127.0.0.1:8111/viewType.html?buildTypeId=${item.id}`,
  }));

  return {
    count: allBuildTypes.length,
    href: '/app/rest/buildTypes',
    buildType: allBuildTypes,
  };
};

module.exports = {
  makeBuildsJson,
  makeRunningBuildsJson,
  makeInvestigationJson,
  makeAllProjectsJson,
  makeAllBuildTypesJson,
};
