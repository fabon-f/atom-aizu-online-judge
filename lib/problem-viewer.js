'use babel';

import { Emitter } from 'atom';
const getAOJProblemInfo = require('aoj-problem');

export default class ProblemViewer {
  constructor(problemID) {
    if (typeof problemID !== 'string') { throw new Error('problemID must be string'); }

    this.title = problemID;
    this.description = null;
    this.emitter = new Emitter();

    getAOJProblemInfo(problemID, 'ja').then(data => {
      this.title = data.title;
      this.description = data.description;
      this.emitter.emit('did-change-title');
      this.emitter.emit('did-change-description', this.description);
    }).catch(error => {
      console.error(error); // eslint-disable-line no-console
    });
  }
  getTitle() {
    return this.title;
  }
  onDidChangeTitle(callback) {
    if (typeof callback !== 'function') { throw new Error('callback must be function'); }
    return this.emitter.on('did-change-title', callback);
  }
  onDidChangeDescription(callback) {
    if (typeof callback !== 'function') { throw new Error('callback must be function'); }
    return this.emitter.on('did-change-description', callback);
  }
}
