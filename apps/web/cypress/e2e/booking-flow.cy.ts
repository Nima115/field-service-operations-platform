/// <reference types="cypress" />

describe("booking flow", () => {
  it("logs in and creates a booking through the API-backed form", () => {
    cy.visit("/login");
    cy.contains("Login").click();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/admin");

    cy.visit("/booking");
    cy.contains("Create service booking");
    cy.get('input[type="date"]').type("2026-06-15");
    cy.get('input[type="time"]').type("09:30");
    cy.get("textarea").type("E2E booking workflow verification");
    cy.contains("Confirm booking").click();
    cy.contains("Booking created and sent to operations.", { timeout: 10000 });
  });
});
