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
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress-file-upload 라이브러리 임포트
import "cypress-file-upload";

// 폼 입력 필드에 텍스트 입력 명령어
Cypress.Commands.add("fillField", (selector, text) => {
  cy.get(selector).clear().type(text);
});

// 로컬 스토리지 확인 명령어
Cypress.Commands.add("checkLocalStorage", (key, expectedValue) => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem(key)).to.eq(expectedValue);
  });
});

// 특정 URL로 이동 후 로딩 대기 명령어
Cypress.Commands.add("visitAndWait", (url) => {
  cy.visit(url);
  cy.get("body").should("be.visible");
});

// 에러 메시지 확인 명령어
Cypress.Commands.add("checkErrorMessage", (selector, message) => {
  cy.get(selector).should("contain", message);
});

// 파일 업로드 헬퍼 명령어 추가
Cypress.Commands.add("uploadFile", (selector, fileName) => {
  cy.get(selector).selectFile(`cypress/fixtures/${fileName}`, {
    force: true,
    mimeType: fileName.endsWith(".pdf") ? "application/pdf" : "image/png",
  });
});
