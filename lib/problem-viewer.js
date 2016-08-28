'use babel';

import { Emitter } from 'atom';
const getAOJProblemInfo = require('aoj-problem');

export default class ProblemViewer {
  constructor(problemID) {
    if (typeof problemID !== 'string') { throw new Error('problemID must be string'); }

    this.title = problemID;
    this.emitter = new Emitter();

    getAOJProblemInfo(problemID, 'ja').then(data => {
      this.title = data.title;
      this.emitter.emit('did-change-title');
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
}
