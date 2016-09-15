'use babel';

import ProblemViewer from '../lib/problem-viewer';

const getView = item => {
  if (item instanceof HTMLElement) { return item; }
  return atom.views.getView(item);
};

describe('AizuOnlineJudge', () => {
  describe('when the aizu-online-judge:show-problem event is triggered', () => {
    let activationPromise, workspaceElement;

    beforeEach(() => {
      activationPromise = atom.packages.activatePackage('aizu-online-judge');
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    it('opens the modal panel with text input', () => {
      expect(atom.workspace.getModalPanels()).toHaveLength(0);

      atom.commands.dispatch(workspaceElement, 'aizu-online-judge:show-problem');

      waitsForPromise(() => activationPromise);

      runs(() => {
        expect(atom.workspace.getModalPanels()).toHaveLength(1);

        const modalElement = getView(atom.workspace.getModalPanels()[0]).firstChild;
        expect(modalElement.childNodes[0].tagName).toBe('ATOM-TEXT-EDITOR');
        expect(modalElement.childNodes[0].getAttribute('mini')).not.toBe(null);
        expect(modalElement.childNodes[0]).toBe(document.activeElement);
        expect(modalElement.childNodes[1].tagName).toBe('DIV');
        expect(modalElement.childNodes[1].textContent).toBe('Enter problem ID');
      });
    });
  });

  describe('when the modal panel appears', () => {
    let workspaceElement, inputElement;

    beforeEach(() => {
      const activationPromise = atom.packages.activatePackage('aizu-online-judge');
      workspaceElement = atom.views.getView(atom.workspace);

      atom.commands.dispatch(workspaceElement, 'aizu-online-judge:show-problem');
      waitsForPromise(() => activationPromise);

      inputElement = getView(atom.workspace.getModalPanels()[0]).firstChild.firstChild;
      inputElement.getModel().setText('0300');
    });

    describe('and the core:confirm event is triggered', () => {
      it('opens the problem viewer pane', () => {
        expect(atom.workspace.getPaneItems()).toHaveLength(0);

        atom.commands.dispatch(inputElement, 'core:confirm');

        waitsFor(
          () => atom.workspace.getPaneItems().length === 1,
          'The problem view is opened', 2000
        );

        runs(() => {
          expect(atom.workspace.getActivePaneItem()).toBeInstanceOf(ProblemViewer);
          expect(atom.workspace.getActivePaneItem().getTitle()).toBe('0300');
          expect(getView(atom.workspace.getActivePaneItem()).classList.contains('aoj-problem-viewer')).toBe(true);
        });

        waitsFor(
          () => atom.workspace.getActivePaneItem().getTitle() === 'フロッピーキューブ',
          'The problem view is loaded', 2000
        );

        runs(() => {
          expect(atom.workspace.getActivePaneItem().getTitle()).toBe('フロッピーキューブ');
          const problemViewerElement = getView(atom.workspace.getActivePaneItem());
          expect(problemViewerElement.childNodes[0].tagName).toBe('IFRAME');
        });
      });
    });

    describe('and the core:cancel event is triggered', () => {
      it('hides the modal panel', () => {
        expect(atom.workspace.getModalPanels()).toHaveLength(1);

        atom.commands.dispatch(inputElement, 'core:cancel');

        expect(atom.workspace.getModalPanels()).toHaveLength(0);
      });
    });
  });
});
