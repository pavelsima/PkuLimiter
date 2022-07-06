import { isHomeVisible, isStatsVisible, isSettingsVisible } from '../helpers/checkVisibilityHelper'

describe('Navigation', () => {
  beforeEach(() => {
    cy.viewport('iphone-6+')
  })

  it('Home', () => {
    cy.visit('/settings')

    // go to home
    cy.get('#tab-button-home').click()

    // check visibility
    isHomeVisible()
  })

  it('Stats', () => {
    cy.visit('/home')

    // go to home
    cy.get('#tab-button-stats').click()

    // check visibility
    isStatsVisible()
  })

  it('Settings', () => {
    cy.visit('/stats')

    // go to home
    cy.get('#tab-button-settings').click()

    // check visibility
    isSettingsVisible()
  })
})