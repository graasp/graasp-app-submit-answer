import { inputTextField, saveButton } from '../constants/selectors';

describe('<StudentView />', () => {
  describe('when offline = true', () => {
    beforeEach(() => {
      cy.offlineVisit();
    });

    // when standalone and offline,
    // the input app cannot save data
    it('input contains typed text', () => {
      const text = 'Some input text.';

      // type content
      cy.enterStudentResponse(text, false, false);
      cy.reload();

      // content not saved
      cy.get(inputTextField).should('be.empty');
    });
  });

  describe('when online = true', () => {
    beforeEach(() => {
      cy.onlineVisit();
    });

    it('saves typed data', () => {
      const text = 'Some input text.';

      // no save button
      cy.get(saveButton).should('not.exist');

      // type text
      cy.enterStudentResponse(text, false, true);
      cy.reload();

      // text remains
      cy.get(inputTextField).contains(text);

      // clear
      cy.clearStudentResponse(false, true);
      cy.reload();

      // input is empty
      cy.get(inputTextField).should('be.empty');
    });
  });
});
