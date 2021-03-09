import Qs from 'qs';
import _, { toInteger } from 'lodash';
import {
  DEFAULT_MODE,
  MAX_ATTEMPTS,
  TEACHER_MODE,
} from '../../src/config/settings';
import {
  buildConfirmDeleteDialogConfirmSelector,
  DELETE_RESPONSE_BUTTONS,
  SAVE_SETTINGS_BUTTON,
  HEADER_VISIBILITY_SWITCH,
  STUDENT_INPUT,
  SAVE_INPUT_BUTTON,
  SETTINGS_BUTTON,
  SETTINGS_MODAL,
  SHOW_AUTOMATIC_FEEDBACK_SWITCH,
  HINT_INPUT,
  NUM_ATTEMPTS_ALLOWED_INPUT,
} from '../../src/config/selectors';
import { LOAD_PAGE_PAUSE } from '../constants/constants';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add(
  'onlineVisit',
  ({
    mode = DEFAULT_MODE,
    spaceId = '5b56e70ab253020033364411',
    appInstanceId = '6156e70ab253020033364411',
    userId = '5b56e70ab253020033364416',
  } = {}) => {
    cy.visit('/', {
      qs: {
        spaceId,
        appInstanceId,
        mode,
        userId,
        dev: true,
      },
    });
    cy.wait(LOAD_PAGE_PAUSE);
  }
);

Cypress.Commands.add('enterStudentResponse', ({ text, save = false }) => {
  const input = cy.get(STUDENT_INPUT);
  if (!text || text === '') {
    input.clear().should('be.empty');
  } else {
    input.type(text).should('have.value', text);
  }

  if (save) {
    cy.saveAnswer();
  }
});

Cypress.Commands.add('clearStudentResponse', () => {
  cy.get(STUDENT_INPUT).clear();
});

const deleteAnswers = () => {
  // if delete buttons exist
  cy.get('body').then(($body) => {
    if ($body.find(DELETE_RESPONSE_BUTTONS).length) {
      cy.get(DELETE_RESPONSE_BUTTONS).each((btn) => {
        btn.click();
        // get corresponding dialog id
        const currentId = btn.data('id');
        cy.get(buildConfirmDeleteDialogConfirmSelector(currentId)).click();
        cy.wrap(btn).should('not.exist');
      });
    }
  });
};

// remove all saved data via the teacher mode dashboard
Cypress.Commands.add(
  'clearData',
  ({ appInstanceId = '6156e70ab253020033364411' } = {}) => {
    // to improve: reset json server
    cy.url().then((url) => {
      const { mode } = Qs.parse(url);
      if (mode !== TEACHER_MODE) {
        console.log('mode: ', mode);
        cy.onlineVisit({ mode: TEACHER_MODE, appInstanceId });
      }

      // delete answers for all attempts
      // because cypress cannot automatically detect the number of iteration
      // needed to remove all answers, we try to delete at most all possible attempts
      for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
        deleteAnswers();
      }
    });
  }
);

Cypress.Commands.add('saveAnswer', () => {
  cy.get(SAVE_INPUT_BUTTON).click();
});

Cypress.Commands.add(
  'editSettings',
  ({ headerVisibility, showAutomaticFeedback, hint, numAttemptsAllowed }) => {
    cy.get(SETTINGS_BUTTON).click();

    cy.get(SETTINGS_MODAL).should('be.visible');

    // change headerVisibility if set
    if (_.isBoolean(headerVisibility)) {
      cy.get(HEADER_VISIBILITY_SWITCH).then(($headerVisible) => {
        // header visible

        const isHeaderVisibilityChecked = $headerVisible.attr('checked');
        // turn on
        if (headerVisibility && isHeaderVisibilityChecked !== 'checked') {
          cy.get(HEADER_VISIBILITY_SWITCH).click();
        }
        // turn off
        else if (!headerVisibility && isHeaderVisibilityChecked === 'checked') {
          cy.get(HEADER_VISIBILITY_SWITCH).click();
        }
      });
    }

    // change showAutomaticFeedback if set
    if (_.isBoolean(showAutomaticFeedback)) {
      cy.get(SHOW_AUTOMATIC_FEEDBACK_SWITCH).then(($showAutomaticFeedback) => {
        // is automatic feedback set
        const showAutomaticFeedbackChecked = $showAutomaticFeedback.attr(
          'checked'
        );
        // turn on
        if (
          showAutomaticFeedback &&
          showAutomaticFeedbackChecked !== 'checked'
        ) {
          cy.get(SHOW_AUTOMATIC_FEEDBACK_SWITCH).click();
        }
        // turn off
        else if (
          !showAutomaticFeedback &&
          showAutomaticFeedbackChecked === 'checked'
        ) {
          cy.get(SHOW_AUTOMATIC_FEEDBACK_SWITCH).click();
        }
      });
    }

    // set hint
    if (_.isString(hint)) {
      cy.get(HINT_INPUT).clear();
      if (hint.length) {
        cy.get(HINT_INPUT).type(hint);
      }
    }

    // set attempts
    if (_.isNumber(numAttemptsAllowed)) {
      cy.get(NUM_ATTEMPTS_ALLOWED_INPUT).then((input) => {
        const value = toInteger(input.attr('value'));
        // console.log('value: ', value);
        // input.setAttribute('value', 20);
        const newValue = value - numAttemptsAllowed;
        if (newValue !== 0) {
          const valueToType = Array.from(
            { length: numAttemptsAllowed - 1 },
            () => '{uparrow}'
          ).join();

          cy.get(NUM_ATTEMPTS_ALLOWED_INPUT)
            .clear()
            .type(valueToType)
            .trigger('change');
        }
      });
    }
    // save
    // clicks without throwing an error even if the element is not clickable
    cy.get(SAVE_SETTINGS_BUTTON).click({ force: true });
  }
);
