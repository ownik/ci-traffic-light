const axios = require("axios");

const STATUSES = {
  Success: "SUCCESS",
  Unknown: "UNKNOWN",
  FAILURE: "FAILURE",
};

class Investigations {
  constructor() {
    this.table = {};
  }

  addInvestigation(userName, buildTypes) {
    for (const buildType of buildTypes) {
      /*if (buildType in this.table) {
        this.table[buildType].concat([userName]);
      } else {*/
      this.table[buildType] = [userName];
      //}
    }
    return this;
  }

  fetchInvestigationUserForBuildType(buildType) {
    if (buildType in this.table) {
      return this.table[buildType];
    }
    return [];
  }
}

class Teamcity {
  constructor(serverUrl, auth, branch) {
    this.serverUrl = serverUrl;
    this.auth = auth;
    this.branch = branch;
  }

  httpGet(url) {
    return axios.get(url, {
      headers: {
        Accept: "application/json",
      },
      auth: this.auth,
    });
  }

  async fetchAllInvestigation() {
    const response = await this.httpGet(
      `${this.serverUrl}/app/rest/latest/investigations`
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

    const items = (
      await Promise.all(
        buildTypes.map(async (buildType) => {
          const finishedFailed = await this.isFinishedBuildFail(buildType);
          const runningSuccess = await this.isRunningBuildSuccess(buildType);

          if (finishedFailed || (runningSuccess != null && !runningSuccess)) {
            return {
              id: buildType,
              displayName: buildType,
              investigators: investigations.fetchInvestigationUserForBuildType(
                buildType
              ),
              running: runningSuccess != null,
            };
          }

          return null;
        })
      )
    ).filter((item) => item != null);

    let status = "success";

    if (items.length > 0) {
      status = "fail";
    }

    return { status, items };
  }
}

module.exports = {
  Investigations,
  Teamcity,
};
