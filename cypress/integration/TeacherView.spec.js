import { TEACHER_MODE } from '../../src/config/settings';
import { LOAD_DASHBOARD_PAUSE } from '../constants/constants';
import {
  responsesTable,
  logo,
  appTitle,
  dashboardButton,
  refreshButton,
  defaultViewButton,
  fields,
} from '../constants/selectors';

describe('<TeacherView />', () => {
  beforeEach(() => {
    cy.onlineVisit(TEACHER_MODE);
  });

  it('toolbar displays logo, title, refresh and dashboard button', () => {
    // visible elements
    cy.get(logo).should('be.visible');
    cy.get(appTitle).should('be.visible');
    cy.get(dashboardButton).should('be.visible');
    cy.get(refreshButton).should('be.visible');
  });

  it('on dashboard view click, toolbar displays logo, title, refresh and default view button', () => {
    cy.get(dashboardButton).click();

    cy.wait(LOAD_DASHBOARD_PAUSE);

    // visible elements
    cy.get(logo).should('be.visible');
    cy.get(appTitle).should('be.visible');
    cy.get(refreshButton).should('be.visible');
    cy.get(defaultViewButton).should('be.visible');
  });

  it(`responses table contains ${fields.length} fields`, () => {
    cy.get(responsesTable).should('be.visible');
    fields.forEach(field => {
      cy.get(responsesTable).contains(field);
    });
  });

  it("responses table contains added student's response", () => {
    // write student input
    // use random string in case of unclear input
    const responseText = Math.random()
      .toString(36)
      .substring(7);
    cy.enterStudentResponse(responseText);

    // return to teacher view and check responses
    cy.onlineVisit(TEACHER_MODE);

    cy.get(`${responsesTable} tbody tr`).contains(responseText);

    // clear student input
    cy.clearStudentResponse();
  });
});
