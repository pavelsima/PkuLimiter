
export const isHomeVisible = () => {
  // header
  cy.get('[data-cy="header-home"]').contains('Home')
  // graph
  cy.get('.pie_chart_block').should('be.visible')
  // buttons
  cy.get('[data-cy="add-breakfast-button"]').should('be.visible')
  cy.get('[data-cy="add-lunch-button"]').should('be.visible')
  cy.get('[data-cy="add-dinner-button"]').should('be.visible')
  cy.get('[data-cy="add-snacks-button"]').should('be.visible')
}

export const isStatsVisible = () => {
  // header
  cy.get('[data-cy="header-stats"]').contains('Stats')
  // segments visible
  cy.get('[data-cy="segment-buttons-day"]').should('be.visible')
  cy.get('[data-cy="segment-buttons-week"]').should('be.visible')
  // buttons
  cy.get('[data-cy="day-stats-empty"]').should('be.visible')
  cy.get('[data-cy="segment-buttons-week"]').click()
  cy.get('[data-cy="week-stats-non-existing"]').should('be.visible')
  cy.get('[data-cy="segment-buttons-day"]').click()
}

export const isSettingsVisible = () => {
  // header
  cy.get('[data-cy="header-settings"]').contains('Settings')
  // phe limit input visible
  cy.get('[data-cy="phe-limit-label"]').should('be.visible')
  cy.get('[data-cy="phe-limit-input"]').should('be.visible')
  cy.get('[data-cy="phe-limit-selected-amount"]').should('be.visible')
  // unit segement buttons visible
  cy.get('[data-cy="unit-segment-protein-button"]').should('be.visible')
  cy.get('[data-cy="unit-segment-phe-button"]').should('be.visible')
  // set segment to protein
  cy.get('[data-cy="unit-segment-protein-button"]').click()
  // phe multiplier input should be visible
  cy.get('[data-cy="phe-multiplier-label"]').should('be.visible')
  cy.get('[data-cy="phe-multiplier-input"]').should('be.visible')
  cy.get('[data-cy="phe-multiplier-selected-amount"]').should('be.visible')
}