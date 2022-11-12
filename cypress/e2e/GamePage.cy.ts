beforeEach(() => {
  cy.viewport("macbook-15");
  cy.intercept("WebSocketConnection.ts").as("svelte");
  cy.visit("/play");
  cy.wait("@svelte");
});

// This test will be replaced once ChessBoard is refactored and testable as Component
describe("test", () => {
  it("passes", () => {
    cy.get("#input1").type("0438");
    cy.get("#input2").type("1234");
    cy.get("#connectButton").click();

    // Now on game page

    Cypress.on("uncaught:exception", (err, runnable) => {
      // we expect a 3rd party library error with message 'list not defined'
      // and don't want to fail the test so we return false
      if (err.message.includes("Cannot read properties of ")) {
        return false;
      }
      if (err.message.includes("search is not a function")) {
        return false;
      }
      // we still want to ensure there are no other unexpected
      // errors, so we let them fail the test
    });

    cy.url().should("contain", "/play/game");
    cy.get("chess-board").should("be.visible");

    // Visual test : Game Start
    cy.matchImage({ maxDiffThreshold: 0.0005 });

    // Use hidden accessibility text inputs to move a piece
    cy.getByLabel("Move from:").focus().type("b2");
    cy.getByLabel("Move to:").focus().type("b4");
    cy.contains("input", "Submit Move").focus().click();
    
    // Wait for automated opponent to make its move
    cy.wait(250);

    // Visual test: Move using text input
    cy.matchImage({ maxDiffThreshold: 0.0005 });

    
    // Move first white pawn
    cy.get("chess-board").shadow().find('[piece="wP"]').first().as("wp");
    cy.get("@wp").move({deltaX: 200, deltaY: 250, force: true});	
    
    // Visual test: Drag & Drop
    cy.matchImage({ maxDiffThreshold: 0.0005 });

    cy.contains("button", "Leave Game").click();
  });
});
