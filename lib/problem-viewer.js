'use babel';

import { Emitter } from 'atom';

export default class ProblemViewer {
  constructor() {
    this.emitter = new Emitter();
  }
  getTitle() {
    return 'AOJ';
  }
  onDidChangeTitle(callback) {
    if (typeof callback !== 'function') { throw new Error('callback must be function'); }
    return this.emitter.on('did-change-title', callback);
  }
}
