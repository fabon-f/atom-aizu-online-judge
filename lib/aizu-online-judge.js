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

    this.subscriptions.add(atom.views.addViewProvider(ProblemViewer, problemViewer => {
      const problemViewerElement = document.createElement('div');
      problemViewerElement.classList.add('aoj-problem-viewer');

      problemViewer.onDidChangeDescription(description => {
        const descriptionViewer = document.createElement('webview');
        // eslint-disable-next-line prefer-template
        const descriptionURI = 'data:text/html;charset=utf-8;base64,' + Buffer.from(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${problemViewer.getTitle()}</title>
<style>
body {
  color: ${getComputedStyle(problemViewerElement).color};
}
</style>
</head>
<body>
${description}
</body>
</html>`.trim(), 'utf8').toString('base64');
        descriptionViewer.src = descriptionURI;
        descriptionViewer.preload = `file://${__dirname}/webview-height.js`;
        descriptionViewer.classList.add('description');

        descriptionViewer.addEventListener('ipc-message', e => {
          if (e.channel !== 'content-height') { return; }
          const contentHeight = e.args[0];
          descriptionViewer.style.height = `${contentHeight}px`;
        });

        descriptionViewer.addEventListener('did-finish-load', () => {
          descriptionViewer.send('content-height');
        });

        problemViewerElement.appendChild(descriptionViewer);
      });

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
