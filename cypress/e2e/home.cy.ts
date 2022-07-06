import { isHomeVisible } from '../helpers/checkVisibilityHelper'

describe('Are all UI visible', () => {
  context('iPhone 6+ resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-6+')
    })

    it('check if everithing is visible', () => {
      cy.visit('/')

      isHomeVisible()
    })
  })

  context('Samsung S10 resolution', () => {
    beforeEach(() => {
      cy.viewport('samsung-s10')
    })

    it('check if everithing is visible', () => {
      cy.visit('/')
      // graph
      cy.get('.pie_chart_block').should('be.visible')
      // buttons
      cy.get('[data-cy="add-breakfast-button"]').should('be.visible')
      cy.get('[data-cy="add-lunch-button"]').should('be.visible')
      cy.get('[data-cy="add-dinner-button"]').should('be.visible')
      cy.get('[data-cy="add-snacks-button"]').should('be.visible')
    })
  })
})

describe('Add new dish', () => {
  beforeEach(() => {
    cy.viewport('iphone-6+')
  })

  it('Add small breakfast', () => {
    cy.visit('/')
    // open modal
    cy.get('[data-cy="add-breakfast-button"]').click()
    // input name meal
    cy.get('[data-cy="meal-name-input"]').type('Small breakfast')
    // select small amount
    cy.get('[data-cy="meal-modal-radio-value-50"]').click()
    // submit meal
    cy.get('[data-cy="add-meal-submit-button"]').click()

    // check if amount Added
    cy.get('[data-cy="Breakfast-total-amount"]').contains("1.1 g")
    cy.get('[data-cy="remaining-main-stat"]').contains("10.0 g")
  })

  it('Add medium lunch', () => {
    cy.visit('/')
    // open modal
    cy.get('[data-cy="add-lunch-button"]').click()
    // input name meal
    cy.get('[data-cy="meal-name-input"]').type('Medium lunch')
    // select small amount
    cy.get('[data-cy="meal-modal-radio-value-150"]').click()
    // submit meal
    cy.get('[data-cy="add-meal-submit-button"]').click()

    // check if amount Added
    cy.get('[data-cy="Lunch-total-amount"]').contains("3.3 g")
    cy.get('[data-cy="remaining-main-stat"]').contains("7.8 g")
  })
  it('Add large dinner', () => {
    cy.visit('/')
    // open modal
    cy.get('[data-cy="add-dinner-button"]').click()
    // input name meal
    cy.get('[data-cy="meal-name-input"]').type('Large dinner')
    // select small amount
    cy.get('[data-cy="meal-modal-radio-value-187.5"]').click()
    // submit meal
    cy.get('[data-cy="add-meal-submit-button"]').click()

    // check if amount Added
    cy.get('[data-cy="Dinner-total-amount"]').contains("4.2 g")
    cy.get('[data-cy="remaining-main-stat"]').contains("6.9 g")
  })

  it('Add custom snack', () => {
    cy.visit('/')
    // open modal
    cy.get('[data-cy="add-snacks-button"]').click()
    // input name meal
    cy.get('[data-cy="meal-name-input"]').type('Custom snack')
    // select small amount
    cy.get('[data-cy="meal-modal-radio-value-custom"]').click()
    cy.wait(1000)
    cy.get('[opt-index="21"]').click()
    cy.get(':nth-child(2) > .picker-button').click()
    // submit meal
    cy.get('[data-cy="add-meal-submit-button"]').click()

    // check if amount Added
    cy.get('[data-cy="Snacks-total-amount"]').contains("2.3 g")
    cy.get('[data-cy="remaining-main-stat"]').contains("8.8 g")
    })
})