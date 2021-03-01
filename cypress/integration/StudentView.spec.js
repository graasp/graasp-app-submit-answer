import {
  ATTEMPT_INFORMATION_TEXT,
  CORRECT_ANSWER_FEEDBACK_ICON,
  INCORRECT_ANSWER_FEEDBACK_ICON,
  SHOW_HINT_BUTTON,
  HINT_ALERT,
  STUDENT_INPUT,
  SAVE_INPUT_BUTTON,
} from '../../src/config/selectors';

// use different appInstance to avoid data conflict
// and different settings
const APP_INSTANCE_ID_1 = 'studentview-app-instance-id-1';
const APP_INSTANCE_ID_2 = 'studentview-app-instance-id-2';

describe('<StudentView />', () => {
  beforeEach(() => {});

  it('default layout', () => {
    cy.onlineVisit({ appInstanceId: APP_INSTANCE_ID_1 });

    // input is empty
    cy.get(STUDENT_INPUT).should('be.empty');

    // no hint button
    cy.get(SHOW_HINT_BUTTON).should('not.exist');

    // cannot submit when empty
    cy.get(SAVE_INPUT_BUTTON).should('be.disabled');

    // 1 attempt remaining
    cy.get(ATTEMPT_INFORMATION_TEXT).contains('0/1');
  });

  describe('Attempts and feedback', () => {
    it('one and all attempts used, no feedback', () => {
      cy.onlineVisit({
        appInstanceId: APP_INSTANCE_ID_1,
      });
      const text = 'Some input text.';

      // type text
      cy.enterStudentResponse({ text, save: true });
      cy.reload();

      // text remains
      cy.get(STUDENT_INPUT).should('have.value', text);

      // cannot submit when all attempts are used
      cy.get(SAVE_INPUT_BUTTON).should('be.disabled');
      cy.get(ATTEMPT_INFORMATION_TEXT).contains('1/1');

      // no feedback
      cy.get(INCORRECT_ANSWER_FEEDBACK_ICON).should('not.exist');
      cy.get(CORRECT_ANSWER_FEEDBACK_ICON).should('not.exist');

      cy.clearData({
        appInstanceId: APP_INSTANCE_ID_1,
      });
    });

    it('three and all attempts used, with feedback', () => {
      cy.onlineVisit({
        appInstanceId: APP_INSTANCE_ID_2,
      });

      // type text 3 times
      cy.enterStudentResponse({ text: 'Some input text.', save: true });
      cy.get(ATTEMPT_INFORMATION_TEXT).contains('1/3');
      cy.get(INCORRECT_ANSWER_FEEDBACK_ICON).should('exist');
      cy.reload();
      cy.clearStudentResponse();
      cy.enterStudentResponse({ text: 'answer', save: true });
      cy.get(ATTEMPT_INFORMATION_TEXT).contains('2/3');
      cy.get(CORRECT_ANSWER_FEEDBACK_ICON).should('exist');
      cy.reload();
      cy.clearStudentResponse();
      cy.enterStudentResponse({ text: 'Some input text 3', save: true });
      cy.get(ATTEMPT_INFORMATION_TEXT).contains('3/3');
      cy.get(INCORRECT_ANSWER_FEEDBACK_ICON).should('exist');
      cy.reload();

      // text remains
      cy.get(STUDENT_INPUT).should('have.value', 'Some input text 3');

      // cannot submit when empty
      cy.get(SAVE_INPUT_BUTTON).should('be.disabled');

      cy.clearData({
        appInstanceId: APP_INSTANCE_ID_2,
      });
    });
  });

  describe('Show Hint', () => {
    it('hint is set', () => {
      cy.onlineVisit({
        appInstanceId: APP_INSTANCE_ID_2,
      });

      cy.get(SHOW_HINT_BUTTON).should('exist');
      cy.get(HINT_ALERT).should('not.exist');

      // show hint
      cy.get(SHOW_HINT_BUTTON).click();
      cy.get(SHOW_HINT_BUTTON).should('be.disabled');
      cy.get(HINT_ALERT).contains('hint');

      cy.clearData({
        appInstanceId: APP_INSTANCE_ID_2,
      });
    });
  });
});
