describe("desktop page navigation", () => {
  it("passes", () => {
    cy.viewport("macbook-15");

    cy.visit("/");

    cy.get("nav").contains("Project").should("contain.attr", "href", "/");
    cy.get("nav").contains("Team").should("have.attr", "href").and(
      "include",
      "team",
    );
    cy.get("nav").contains("Research").should("have.attr", "href").and(
      "include",
      "research",
    );
    cy.get("nav").contains("Connecting Cultures").should("have.attr", "href").and(
      "include",
      "art",
    );

    cy.wait(500); // wait for goto to be imported
    cy.get("#playButton").contains("Play Chess!").click();
    cy.url().should("include", "/play");
  });
});

describe("desktop page navigation", () => {
  it("passes", () => {
    cy.viewport("iphone-x");

    cy.visit("/");

    cy.get("nav").should("not.be.visible", "Project");
    cy.get("nav").should("not.be.visible", "Team");
    cy.get("nav").should("not.be.visible", "Research");
    cy.get("nav").should("not.be.visible", "Connecting Cultures");

    cy.wait(500);
    cy.get("#menuButton").should("be.visible").click();

    cy.get("nav").contains("Project").should("contain.attr", "href", "/");
    cy.get("nav").contains("Team").should("have.attr", "href").and(
      "include",
      "team",
    );
    cy.get("nav").contains("Research").should("have.attr", "href").and(
      "include",
      "research",
    );
    cy.get("nav").contains("Connecting Cultures").should("have.attr", "href").and(
      "include",
      "art",
    );
  });
});
