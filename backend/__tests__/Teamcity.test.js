const mockAxios = require("axios");
const { Teamcity, Investigations } = require("../src/Teamcity");
const {
  makeBuildsJson,
  makeRunningBuildsJson,
  makeInvestigationJson,
} = require("./teamcityTestUtils");

jest.mock("axios", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
}));

describe("Teamcity", () => {
  const teamcity = new Teamcity({
    serverUrl: "some url",
    auth: { username: "root", password: "123456" },
    branch: "some-branch",
  });

  afterEach(() => {
    mockAxios.get.mockClear();
  });

  describe("isFinishedBuildFail", () => {
    test("test axios arguments", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson("SomeBuildTypeId", "SUCCESS"),
        })
      );
      await teamcity.isFinishedBuildFail("SomeBuildTypeId");
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        "some url/app/rest/latest/builds?locator=branch:some-branch,failedToStart:any,running:false,canceled:false,count:1,buildType:(SomeBuildTypeId)",
        {
          headers: { Accept: "application/json" },
          auth: { username: "root", password: "123456" },
        }
      );
    });

    test.each`
      state        | expected
      ${null}      | ${false}
      ${"SUCCESS"} | ${false}
      ${"success"} | ${false}
      ${"suCCeSS"} | ${false}
      ${"UNKNOWN"} | ${false}
      ${"unknown"} | ${false}
      ${"unKnOWN"} | ${false}
      ${"FAILURE"} | ${true}
      ${"failure"} | ${true}
      ${"faIlUrE"} | ${true}
      ${"other"}   | ${true}
    `("$expected when state is $state", async ({ state, expected }) => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeBuildsJson("SomeBuildTypeId", state),
        })
      );
      expect(await teamcity.isFinishedBuildFail("SomeBuildTypeId")).toEqual(
        expected
      );
    });
  });

  describe("isRunningBuildSuccess", () => {
    test("test axios arguments", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson("SomeBuildTypeId", "SUCCESS"),
        })
      );
      await teamcity.isRunningBuildSuccess("SomeBuildTypeId");
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        "some url/app/rest/latest/builds?locator=branch:some-branch,failedToStart:any,running:true,canceled:false,count:1,buildType:(SomeBuildTypeId)",
        {
          headers: { Accept: "application/json" },
          auth: { username: "root", password: "123456" },
        }
      );
    });

    test.each`
      state        | expected
      ${null}      | ${null}
      ${"SUCCESS"} | ${true}
      ${"success"} | ${true}
      ${"suCCeSS"} | ${true}
      ${"UNKNOWN"} | ${false}
      ${"unknown"} | ${false}
      ${"unKnOWN"} | ${false}
      ${"FAILURE"} | ${false}
      ${"failure"} | ${false}
      ${"faIlUrE"} | ${false}
      ${"other"}   | ${false}
    `("$expected when state is $state", async ({ state, expected }) => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeRunningBuildsJson("SomeBuildTypeId", state),
        })
      );
      expect(await teamcity.isRunningBuildSuccess("SomeBuildTypeId")).toEqual(
        expected
      );
    });
  });

  describe("fetchAllInvestigation", () => {
    test("test axios arguments", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: makeInvestigationJson([]),
        })
      );
      await teamcity.fetchAllInvestigation();
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        "some url/app/rest/latest/investigations",
        {
          headers: { Accept: "application/json" },
          auth: { username: "root", password: "123456" },
        }
      );
    });

    const investigationTest = (text, json, expected) =>
      test(text, async () => {
        mockAxios.get.mockImplementationOnce(() =>
          Promise.resolve({
            data: makeInvestigationJson(json),
          })
        );
        expect(await teamcity.fetchAllInvestigation()).toEqual(expected);
      });

    investigationTest(
      "empty array when no investigation",
      [],
      new Investigations()
    );

    investigationTest(
      "one investigation",
      [{ username: "user1", buildTypes: ["Build 1"] }],
      new Investigations().addInvestigation("user1", ["Build 1"])
    );

    investigationTest(
      "two investigation one user",
      [{ username: "user1", buildTypes: ["Build 1", "Build 2"] }],
      new Investigations().addInvestigation("user1", ["Build 1", "Build 2"])
    );

    investigationTest(
      "three investigation two user",
      [
        { username: "user1", buildTypes: ["Build 1", "Build 2"] },
        { username: "user2", buildTypes: ["Build 3"] },
      ],
      new Investigations()
        .addInvestigation("user1", ["Build 1", "Build 2"])
        .addInvestigation("user2", ["Build 3"])
    );
  });

  describe("checkState", () => {
    let fetchAllInvestigationMock;
    let isFinishedBuildFailMock;
    let isRunningBuildSuccessMock;

    beforeEach(() => {
      fetchAllInvestigationMock = jest.spyOn(teamcity, "fetchAllInvestigation");
      isFinishedBuildFailMock = jest.spyOn(teamcity, "isFinishedBuildFail");
      isRunningBuildSuccessMock = jest.spyOn(teamcity, "isRunningBuildSuccess");
    });

    afterEach(() => {
      fetchAllInvestigationMock.mockRestore();
      isFinishedBuildFailMock.mockRestore();
      isRunningBuildSuccessMock.mockRestore();
    });

    const twoFailedBuildsExpected = {
      items: [
        {
          id: "Build 1",
          displayName: "Build 1",
          investigators: [],
          running: false,
        },
        {
          id: "Build 2",
          displayName: "Build 2",
          investigators: [],
          running: false,
        },
      ],
      status: "fail",
    };

    const twoFailedBuildsOneSameInvestigatorExpected = {
      items: [
        {
          id: "Build 1",
          displayName: "Build 1",
          investigators: ["user1"],
          running: false,
        },
        {
          id: "Build 2",
          displayName: "Build 2",
          investigators: ["user1"],
          running: false,
        },
      ],
      status: "fail",
    };

    test.each`
      text                                          | buildTypes                | investigations                                                            | failedBuilds              | runningSuccessBuilds    | expected
      ${"one build - no failed"}                    | ${["Build 1"]}            | ${new Investigations()}                                                   | ${[]}                     | ${{}}                   | ${{ items: [], status: "success" }}
      ${"one build - failed"}                       | ${["Build 1"]}            | ${new Investigations()}                                                   | ${["Build 1"]}            | ${{}}                   | ${{ items: [{ id: "Build 1", displayName: "Build 1", investigators: [], running: false }], status: "fail" }}
      ${"one build - running failed"}               | ${["Build 1"]}            | ${new Investigations()}                                                   | ${[]}                     | ${{ "Build 1": false }} | ${{ items: [{ id: "Build 1", displayName: "Build 1", investigators: [], running: true }], status: "fail" }}
      ${"one build - running success"}              | ${["Build 1"]}            | ${new Investigations()}                                                   | ${[]}                     | ${{ "Build 1": true }}  | ${{ items: [], status: "success" }}
      ${"one build - failed running success"}       | ${["Build 1"]}            | ${new Investigations()}                                                   | ${["Build 1"]}            | ${{ "Build 1": true }}  | ${{ items: [{ id: "Build 1", displayName: "Build 1", investigators: [], running: true }], status: "fail" }}
      ${"two build - failed"}                       | ${["Build 1", "Build 2"]} | ${new Investigations()}                                                   | ${["Build 1", "Build 2"]} | ${{}}                   | ${twoFailedBuildsExpected}
      ${"two build - failed one same investigator"} | ${["Build 1", "Build 2"]} | ${new Investigations().addInvestigation("user1", ["Build 1", "Build 2"])} | ${["Build 1", "Build 2"]} | ${{}}                   | ${twoFailedBuildsOneSameInvestigatorExpected}
    `(
      "$text",
      async ({
        buildTypes,
        investigations,
        failedBuilds,
        runningSuccessBuilds,
        expected,
      }) => {
        fetchAllInvestigationMock.mockImplementation(() =>
          Promise.resolve(investigations)
        );
        isFinishedBuildFailMock.mockImplementation((buildTypeId) =>
          Promise.resolve(failedBuilds.includes(buildTypeId))
        );
        isRunningBuildSuccessMock.mockImplementation((buildTypeId) =>
          Promise.resolve(
            buildTypeId in runningSuccessBuilds
              ? runningSuccessBuilds[buildTypeId]
              : null
          )
        );

        expect(await teamcity.checkState(buildTypes)).toEqual(expected);
      }
    );

    test.each`
      buildTypes
      ${["Build 1"]}
      ${["Build 1", "Build 2"]}
    `(
      "check call and args for sub functions for $buildTypes.length build types",
      async ({ buildTypes }) => {
        fetchAllInvestigationMock.mockImplementationOnce(() =>
          Promise.resolve(new Investigations())
        );
        isFinishedBuildFailMock.mockImplementationOnce(() =>
          Promise.resolve(false)
        );
        isRunningBuildSuccessMock.mockImplementationOnce(() =>
          Promise.resolve(null)
        );

        await teamcity.checkState(buildTypes);

        expect(fetchAllInvestigationMock).toHaveBeenCalledTimes(1);
        expect(fetchAllInvestigationMock).toHaveBeenCalledWith();

        expect(isFinishedBuildFailMock).toHaveBeenCalledTimes(
          buildTypes.length
        );
        expect(isRunningBuildSuccessMock).toHaveBeenCalledTimes(
          buildTypes.length
        );

        for (const [i, buildType] of buildTypes.entries()) {
          expect(isFinishedBuildFailMock).toHaveBeenNthCalledWith(
            i + 1,
            buildType
          );
          expect(isRunningBuildSuccessMock).toHaveBeenNthCalledWith(
            i + 1,
            buildType
          );
        }
      }
    );
  });
});
