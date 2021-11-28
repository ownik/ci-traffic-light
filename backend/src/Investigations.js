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

module.exports = Investigations;
