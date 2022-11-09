describe("desktop page navigation", () => {
  it("passes", () => {
    cy.viewport("macbook-15");

    cy.visit("/");

    cy.get("nav").contains("Project").click();
    cy.url().should("eq", "http://localhost:5173/");
    
    cy.get("nav").contains("Team").click();
    cy.url().should("include", "/team");
    
    cy.get("nav").contains("Research").click();
    cy.url().should("include", "/research");
    
    cy.get("nav").contains("Connecting Cultures").click();
    cy.url().should("include", "/art");
    
    cy.wait(100); // wait for goto to be imported
    cy.get("#playButton").contains("Play Chess!").click({ force: true });
    cy.url().should("include", "/play");
    

  });
});
