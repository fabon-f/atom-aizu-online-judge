'use babel';

import ProblemViewer from '../lib/problem-viewer';

describe('AizuOnlineJudge', () => {
  describe('when the aizu-online-judge:show-problem event is triggered', () => {
    let activationPromise, workspaceElement;

    beforeEach(() => {
      activationPromise = atom.packages.activatePackage('aizu-online-judge');
      workspaceElement = atom.views.getView(atom.workspace);
    });

    it('opens problem viewer pane', () => {
      expect(workspaceElement.querySelector('.aoj-problem-viewer')).not.toExist();
      for (const paneItem of atom.workspace.getPaneItems()) {
        expect(paneItem).not.toBeInstanceOf(ProblemViewer);
      }

      atom.commands.dispatch(workspaceElement, 'aizu-online-judge:show-problem');

      waitsForPromise(() => activationPromise);

      runs(() => {
        expect(workspaceElement.querySelector('.aoj-problem-viewer')).toExist();
        expect(atom.workspace.getActivePaneItem()).toBeInstanceOf(ProblemViewer);
      });
    });
  });
});
