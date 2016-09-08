'use babel';

import { CompositeDisposable } from 'atom';
import ProblemViewer from './problem-viewer';

export default {

  subscriptions: null,
  modalPanel: null,

  activate(_state) {
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
        return new ProblemViewer(args[1]);
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  showProblem() {
    const previousFocusElement = document.activeElement;
    const wrapper = document.createElement('div');
    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = 'Enter problem ID';
    const textEditorElement = document.createElement('atom-text-editor');
    wrapper.appendChild(textEditorElement);
    wrapper.appendChild(descriptionElement);
    textEditorElement.setAttribute('mini', true);
    const disposable = atom.commands.add(textEditorElement, {
      'core:confirm': () => {
        disposable.dispose();
        this.modalPanel.destroy();
        this.modalPanel = null;
        this.openProblemViewer(textEditorElement.getModel().getText());
      },
      'core:cancel': () => {
        disposable.dispose();
        this.modalPanel.destroy();
        this.modalPanel = null;
        previousFocusElement.focus();
      }
    });
    textEditorElement.addEventListener('blur', () => {
      disposable.dispose();
      this.modalPanel.destroy();
      this.modalPanel = null;
      previousFocusElement.focus();
    });
    this.modalPanel = atom.workspace.addModalPanel({
      item: wrapper
    });
    textEditorElement.focus();
  },

  openProblemViewer(problemID) {
    atom.workspace.open(`aoj://show-problem/${problemID}`, {
      split: 'right'
    });
  }

};
