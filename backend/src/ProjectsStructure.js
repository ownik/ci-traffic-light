class ProjectStructure {
  constructor() {
    this._projects = {};
    this._idToNames = {};
    this._projectBuildTypes = {};
  }

  addProject(projectId, projectName, parentId) {
    this._addProjectOrBuild(projectId, projectName, parentId, this._projects);
    return this;
  }

  addBuild(buildId, buildName, parentId) {
    this._addProjectOrBuild(
      buildId,
      buildName,
      parentId,
      this._projectBuildTypes
    );
    return this;
  }

  _addProjectOrBuild(id, name, parentId, dict) {
    if (!(parentId in dict)) {
      dict[parentId] = [];
    }
    dict[parentId].push(id);
    this._idToNames[id] = name;
  }

  getName(id) {
    if (id in this._idToNames) {
      return this._idToNames[id];
    }
    return id;
  }

  toString() {
    return this.toStringParent(null, 0);
  }

  toStringParent(parent, indent) {
    let res = `${' '.repeat(indent)}${parent} - ${this.getName(parent)}\n`;
    if (parent in this._projects) {
      for (let project of this._projects[parent]) {
        res += this.toStringParent(project, indent + 2);
      }
    }
    if (parent in this._projectBuildTypes) {
      for (let build of this._projectBuildTypes[parent]) {
        res += `${' '.repeat(indent + 2)}${build} - ${this.getName(build)}\n`;
      }
    }
    return res;
  }
}

module.exports = ProjectStructure;
