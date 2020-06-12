import axios from 'axios';

export const STATUSES = {
  Success: 'SUCCESS',
  Unknown: 'UNKNOWN',
  FAILURE: 'FAILURE',
};

export const isFinishedBuildFail = async (serverUrl, branch, buildTypeId) => {
  const goodStatuses = [STATUSES.Success, STATUSES.Unknown];
  const response = await axios.get(
    `${serverUrl}/app/rest/builds?locator=branch:${branch},failedToStart:any,running:false,canceled:false,count:1,buildType:(${buildTypeId})`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );
  return !goodStatuses.includes(response.data.build[0].status.toUpperCase());
};
