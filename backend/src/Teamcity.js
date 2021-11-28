const axios = require('axios');
const Investigations = require('./Investigations');
const ProjectStructure = require('./ProjectsStructure');
const ProjectsStructure = require('./ProjectsStructure');

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

  async isFinishedBuildFail(buildTypeId) {
    const goodStatuses = [STATUSES.Success, STATUSES.Unknown];
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/builds?locator=branch:${this.branch},failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`
    );
    return response.data.build && response.data.build.length > 0
      ? !goodStatuses.includes(response.data.build[0].status.toUpperCase())
      : false;
  }

  async isRunningBuildSuccess(buildTypeId) {
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/builds?locator=branch:${this.branch},failedToStart:any,running:true,canceled:false,count:1,buildType:(${buildTypeId})`
    );
    return response.data.build && response.data.build.length > 0
      ? response.data.build[0].status.toUpperCase() == STATUSES.Success
      : null;
  }

  async checkState(buildTypes) {
    const investigations = await this.fetchAllInvestigation();
    const projectsStructure = await this.fetchProjectsStructure();

    const items = (
      await Promise.all(
        buildTypes.map(async (buildType) => {
          const finishedFailed = await this.isFinishedBuildFail(buildType);
          const runningSuccess = await this.isRunningBuildSuccess(buildType);

          if (finishedFailed || (runningSuccess != null && !runningSuccess)) {
            return {
              id: buildType,
              displayName: projectsStructure.getName(buildType),
              investigators:
                investigations.fetchInvestigationUserForBuildType(buildType),
              running: runningSuccess != null,
            };
          }

          return null;
        })
      )
    ).filter((item) => item != null);

    let status = 'success';

    if (items.length > 0) {
      status = 'fail';
    }

    return { status, items };
  }
}

module.exports.Teamcity = Teamcity;
