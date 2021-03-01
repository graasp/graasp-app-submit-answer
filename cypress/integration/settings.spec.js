import {
  ATTEMPT_INFORMATION_TEXT,
  INCORRECT_ANSWER_FEEDBACK_ICON,
  SHOW_HINT_BUTTON,
} from '../../src/config/selectors';
import { TEACHER_MODE } from '../../src/config/settings';

// use different appInstance to avoid data conflict
const SETTINGS_APP_INSTANCE_ID_1 = 'settings-app-instance-id-1';
const SETTINGS_APP_INSTANCE_ID_2 = 'settings-app-instance-id-2';

describe('<Settings />', () => {
  it('headerVisible option hide/show header for students', () => {
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });

    cy.editSettings({ headerVisibility: true });

    // header should be visible
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });
    cy.get('header').should('be.visible');

    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });
    cy.editSettings({ headerVisibility: false });

    // header is disabled
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });
    cy.get('header').should('not.exist');
  });

  it('show feedback option', () => {
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });

    cy.editSettings({ showAutomaticFeedback: true });

    // write answer and feedback is visible
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });
    cy.enterStudentResponse({ text: 'some answer', save: true });
    cy.get(INCORRECT_ANSWER_FEEDBACK_ICON).should('exist');

    // turn off feedback
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });
    cy.editSettings({ showAutomaticFeedback: false });

    // header should be visible
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });
    cy.get(INCORRECT_ANSWER_FEEDBACK_ICON).should('not.exist');
  });

  it('set hint', () => {
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });

    cy.editSettings({ hint: 'some hint' });

    // write answer and feedback is visible
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });
    cy.get(SHOW_HINT_BUTTON).should('exist');

    // turn off feedback
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });
    cy.editSettings({ hint: '' });

    // header should be visible
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_1,
    });
    cy.get(SHOW_HINT_BUTTON).should('not.exist');
  });

  it('attempt option', () => {
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });

    cy.editSettings({ numAttemptsAllowed: 2 });

    // write answer and feedback is visible
    cy.onlineVisit({
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });
    cy.get(ATTEMPT_INFORMATION_TEXT).contains('2');

    // turn off feedback
    cy.onlineVisit({
      mode: TEACHER_MODE,
      appInstanceId: SETTINGS_APP_INSTANCE_ID_2,
    });
    cy.editSettings({ numAttemptsAllowed: 10 });
  });
});
