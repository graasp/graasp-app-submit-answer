import { TEACHER_MODE } from '../../src/config/settings';
import {
  TABLE_FIELDS,
  FEEDBACK_INPUT,
  saveFeedbackButton,
  studentFeedbackText,
  APP_TITLE_TEXT,
  REFRESH_BUTTON,
  LOGO_IMAGE,
  RESPONSES_TABLE,
  FEEDBACK_BUTTONS,
} from '../../src/config/selectors';

const APP_INSTANCE_ID = 'teacherview-app-instance-id';

describe('<TeacherView />', () => {
  beforeEach(() => {
    cy.onlineVisit({ mode: TEACHER_MODE, appInstanceId: APP_INSTANCE_ID });
  });

  describe('Layout', () => {
    it('toolbar displays logo, title, refresh and download csv button', () => {
      // visible elements
      cy.get(LOGO_IMAGE).should('be.visible');
      cy.get(APP_TITLE_TEXT).should('be.visible');
      cy.get(REFRESH_BUTTON).should('be.visible');
    });

    it(`responses table contains ${TABLE_FIELDS.length} fields`, () => {
      cy.get(RESPONSES_TABLE).should('be.visible');
      TABLE_FIELDS.forEach((field) => {
        cy.get(RESPONSES_TABLE).contains(field);
      });
    });
  });

  describe('Answers and Feedback', () => {
    // use random string in case of unclear input
    const responseText = Math.random().toString(36).substring(7);

    beforeEach(() => {
      // write student input
      cy.onlineVisit({ appInstanceId: APP_INSTANCE_ID });
      cy.enterStudentResponse({ text: responseText, save: true });
      cy.onlineVisit({ mode: TEACHER_MODE, appInstanceId: APP_INSTANCE_ID });
    });

    it("responses table contains added student's response", () => {
      // return to teacher view and check responses
      cy.get(`${RESPONSES_TABLE} tbody tr`).contains(responseText);
      cy.clearData();
    });

    it('show teacher feedback', () => {
      // give feedback
      const feedbackText = 'a feedback from a teacher';

      // assume exist only one button
      cy.get(FEEDBACK_BUTTONS)
        .click()
        .then((btn) => {
          // get corresponding dialog id
          const currentId = btn.data('id');
          cy.get(FEEDBACK_INPUT).type(feedbackText);
          cy.get(`#${currentId} ${saveFeedbackButton}`).click();
          cy.get(`${RESPONSES_TABLE} tbody tr`).contains(feedbackText);
        });

      // check student can see feedback
      cy.onlineVisit({ appInstanceId: APP_INSTANCE_ID });
      cy.get(studentFeedbackText).contains(feedbackText);
      cy.clearData();
    });
  });
});
