beforeEach(() => {
  cy.viewport("macbook-15");
  cy.intercept("WebSocketConnection.ts").as("svelte");
  cy.visit("/play");
  cy.wait("@svelte");
});

// This test will be replaced once ChessBoard is refactored and testable as Component
describe("test", () => {
  it("passes", () => {
    cy.get("#input1").type("0259")
    cy.get("#input2").type("1234")
    cy.get("#connectButton").click();

    // Now on game page

    cy.url().should('contain', '/play/game');
    cy.get("chess-board").should("be.visible");

  });
});
