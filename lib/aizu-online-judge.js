'use babel';

import AizuOnlineJudgeView from './aizu-online-judge-view';
import { CompositeDisposable } from 'atom';
import ProblemViewer from './problem-viewer';

export default {

  aizuOnlineJudgeView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.aizuOnlineJudgeView = new AizuOnlineJudgeView(state.aizuOnlineJudgeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.aizuOnlineJudgeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'aizu-online-judge:show-problem': () => this.showProblem()
    }));

    this.subscriptions.add(atom.views.addViewProvider(ProblemViewer, () => {
      const problemViewerElement = document.createElement('div');
      problemViewerElement.classList.add('aoj-problem-viewer');
      return problemViewerElement;
    }));

    this.subscriptions.add(atom.workspace.addOpener(uri => {
      const match = uri.match(/^aoj:\/\/(.+)$/);
      if (match === null) { return; }
      const args = match[1].split('/');
      if (args[0] === 'show-problem') {
        return new ProblemViewer();
      }
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.aizuOnlineJudgeView.destroy();
  },

  serialize() {
    return {
      aizuOnlineJudgeViewState: this.aizuOnlineJudgeView.serialize()
    };
  },

  showProblem() {
    atom.workspace.open(`aoj://show-problem`, {
      split: 'right'
    });
  }

};
