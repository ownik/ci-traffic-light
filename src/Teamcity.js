import axios from 'axios';

export const STATUSES = {
  Success: 'SUCCESS',
  Unknown: 'UNKNOWN',
  FAILURE: 'FAILURE',
};

export class Teamcity {
  constructor(serverUrl, branch) {
    this.serverUrl = serverUrl;
    this.branch = branch;
  }

  async isFinishedBuildFail(buildTypeId) {
    const goodStatuses = [STATUSES.Success, STATUSES.Unknown];
    const response = await axios.get(
      `${this.serverUrl}/app/rest/builds?locator=branch:${this.branch},failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    return response.data.build.length > 0
      ? !goodStatuses.includes(response.data.build[0].status.toUpperCase())
      : false;
  }
}
