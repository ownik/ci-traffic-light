const axios = require('axios');
const Investigations = require('./Investigations');
const ProjectStructure = require('./ProjectsStructure');

const STATUSES = {
  Success: 'SUCCESS',
  Unknown: 'UNKNOWN',
  FAILURE: 'FAILURE',
};

class Teamcity {
  constructor(settings) {
    this.serverUrl = settings.serverUrl;
    this.auth = settings.auth;
    this.branch = settings.branch;
  }

  httpGet(url) {
    return axios.get(url, {
      headers: {
        Accept: 'application/json',
      },
      auth: this.auth,
    });
  }

  async fetchAllInvestigation() {
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/investigations`
    );

    const investigations = new Investigations();
    if (response.data.investigation) {
      for (let i of response.data.investigation) {
        const buildTypes = i.scope.buildTypes.buildType.map(
          (buildType) => buildType.id
        );
        investigations.addInvestigation(i.assignee.username, buildTypes);
      }
    }
    return investigations;
  }

  async fetchProjectsStructure() {
    const projectStructure = new ProjectStructure();
    let response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/projects`
    );
    if (response.data.project) {
      for (let project of response.data.project) {
        if (project.id === '_Root') continue;
        projectStructure.addProject(
          project.id,
          project.name,
          project.parentProjectId === '_Root' ? null : project.parentProjectId
        );
      }
    }
    response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/buildTypes`
    );
    if (response.data.buildType) {
      for (let buildType of response.data.buildType) {
        projectStructure.addBuild(
          buildType.id,
          buildType.name,
          buildType.projectId
        );
      }
    }
    return projectStructure;
  }

  async lastFinishedFailedBuildUrl(buildTypeId) {
    const goodStatuses = [STATUSES.Success, STATUSES.Unknown];
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/builds?locator=branch:${this.branch},failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`
    );
    return response.data.build &&
      response.data.build.length > 0 &&
      !goodStatuses.includes(response.data.build[0].status.toUpperCase())
      ? response.data.build[0].webUrl
      : null;
  }

  async runningBuilds(buildTypeId) {
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/builds?locator=branch:${this.branch},failedToStart:any,running:true,canceled:false,buildType:(${buildTypeId})`
    );
    return response.data.build && response.data.build.length > 0
      ? response.data.build.map((item) => {
          return {
            href: item.webUrl,
            success: item.status.toUpperCase() == STATUSES.Success,
          };
        })
      : [];
  }

  buildTypeWebUrl(buildTypeId) {
    return `${this.serverUrl}/viewLog.html?buildTypeId=${buildTypeId}`;
  }

  async checkState(buildTypes) {
    const investigations = await this.fetchAllInvestigation();
    const projectsStructure = await this.fetchProjectsStructure();

    const items = (
      await Promise.all(
        buildTypes.map(async (buildType) => {
          const lastFinishedFailedBuildUrl =
            await this.lastFinishedFailedBuildUrl(buildType);
          const runningBuilds = await this.runningBuilds(buildType);

          const hasSomeRunningFailed = runningBuilds.some((i) => !i.success);

          const hasFailedFinishedOrRunningBuild =
            lastFinishedFailedBuildUrl ||
            (runningBuilds.length > 0 && hasSomeRunningFailed);

          if (hasFailedFinishedOrRunningBuild) {
            return {
              id: buildType,
              displayName: projectsStructure.getName(buildType),
              href: this.failedOrRunningBuildUrl(
                lastFinishedFailedBuildUrl,
                buildType
              ),
              investigators:
                investigations.fetchInvestigationUserForBuildType(buildType),
              running: runningBuilds.length > 0,
            };
          }

          return null;
        })
      )
    ).filter((item) => item != null);

    return { status: items.length > 0 ? 'fail' : 'success', items };
  }

  failedOrRunningBuildUrl(lastFinishedFailedBuildUrl, buildType) {
    if (lastFinishedFailedBuildUrl) return lastFinishedFailedBuildUrl;
    return this.buildTypeWebUrl(buildType);
  }
}

module.exports.Teamcity = Teamcity;
