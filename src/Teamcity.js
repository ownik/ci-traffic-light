import axios from 'axios';

export const STATUSES = {
  Success: 'SUCCESS',
  Unknown: 'UNKNOWN',
  FAILURE: 'FAILURE',
};

export class Investigations {
  constructor() {
    this.table = {};
  }

  addInvestigation(userName, buildTypes) {
    if (!(userName in this.table)) {
      this.table[userName] = buildTypes;
    } else {
      this.table[userName].concat(buildTypes);
    }
    return this;
  }
}

export class Teamcity {
  constructor(serverUrl, auth, branch) {
    this.serverUrl = serverUrl;
    this.auth = auth;
    this.branch = branch;
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
      `${this.serverUrl}/app/rest/investigations`
    );

    let investigations = new Investigations();
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

  async isFinishedBuildFail(buildTypeId) {
    const goodStatuses = [STATUSES.Success, STATUSES.Unknown];
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/builds?locator=branch:${this.branch},failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`
    );
    return response.data.build.length > 0
      ? !goodStatuses.includes(response.data.build[0].status.toUpperCase())
      : false;
  }

  async isRunningBuildSuccess(buildTypeId) {
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/builds?locator=branch:${this.branch},failedToStart:any,running:true,canceled:false,count:1,buildType:(${buildTypeId})`
    );
    return response.data.build.length > 0
      ? response.data.build[0].status.toUpperCase() == STATUSES.Success
      : null;
  }

  async checkState(buildTypes) {
    await this.fetchAllInvestigation();
    for (let buildType of buildTypes) {
      this.isFinishedBuildFail(buildType);
      this.isRunningBuildSuccess(buildType);
    }
  }
}
