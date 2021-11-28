class ProjectStructure {
  constructor() {
    this._projects = {};
    this._idToNames = {};
    this._projectBuildTypes = {};
  }

  addProject(projectId, projectName, parentId) {
    if (!(parentId in this._projects)) {
      this._projects[parentId] = [];
    }
    this._projects[parentId].push(projectId);
    this._idToNames[projectId] = projectName;
    return this;
  }

  addBuild(buildId, buildName, parentId) {
    if (!(parentId in this._projectBuildTypes)) {
      this._projectBuildTypes[parentId] = [];
    }
    this._projectBuildTypes[parentId].push(buildId);
    this._idToNames[buildId] = buildName;
    return this;
  }

  getName(id) {
    if (id in this._idToNames) {
      return this._idToNames[id];
    }
    return id;
  }
}

module.exports = ProjectStructure;
