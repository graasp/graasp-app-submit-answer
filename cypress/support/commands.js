import { DEFAULT_MODE } from '../../src/config/settings';
import { inputTextField } from '../constants/selectors';
import { AUTO_SAVE_PAUSE, LOAD_PAGE_PAUSE } from '../constants/constants';

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
Cypress.Commands.add('offlineVisit', (mode = DEFAULT_MODE) => {
  cy.visit('/', {
    qs: {
      offline: true,
      spaceId: '5b56e70ab253020033364411',
      appInstanceId: '6156e70ab253020033364411',
      mode,
      userId: '5b56e70ab253020033364416',
    },
  });
  cy.wait(LOAD_PAGE_PAUSE);
});
Cypress.Commands.add('onlineVisit', (mode = DEFAULT_MODE) => {
  cy.visit('/', {
    qs: {
      spaceId: '5b56e70ab253020033364411',
      appInstanceId: '6156e70ab253020033364411',
      mode,
      userId: '5b56e70ab253020033364416',
      dev: true,
    },
  });
  cy.wait(LOAD_PAGE_PAUSE);
});

Cypress.Commands.add(
  'enterStudentResponse',
  (text, loadPage = true, online = true) => {
    if (loadPage) {
      if (online) {
        cy.onlineVisit();
      } else {
        cy.offlineVisit();
      }
    }

    const input = cy.get(inputTextField);
    if (!text || text === '') {
      input.clear().should('be.empty');
    } else {
      input.type(text).contains(text);
    }

    // wait is necessary to let the data be sent to the api
    if (online) {
      cy.wait(AUTO_SAVE_PAUSE);
    }
  }
);

Cypress.Commands.add(
  'clearStudentResponse',
  (loadPage = true, online = true) => {
    cy.enterStudentResponse('', loadPage, online);
  }
);
