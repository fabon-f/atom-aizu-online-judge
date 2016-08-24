'use babel';

import AizuOnlineJudgeView from './aizu-online-judge-view';
import { CompositeDisposable } from 'atom';

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
      'aizu-online-judge:toggle': () => this.toggle()
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

  toggle() {
    console.log('AizuOnlineJudge was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
