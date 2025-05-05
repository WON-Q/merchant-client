// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// 커스텀 명령어 추가
Cypress.Commands.add("getByTestId", (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

// 기본 로그인 명령어 (필요할 때 사용)
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login");
  cy.get("input#accountId").type(username);
  cy.get("input#password").type(password);
  cy.contains("로그인").click();
});

// 테스트 실패 시 자동으로 스크린샷 캡처
Cypress.on("fail", (error, runnable) => {
  // 오류가 발생한 테스트에 대해 스크린샷을 저장합니다
  if (!runnable.title.includes("screenshot")) {
    const screenshotName = `${runnable.parent.title} -- ${runnable.title} (failed).png`;
    cy.screenshot(screenshotName);
  }
  throw error;
});

// 네트워크 요청 실패를 더 잘 처리하기 위한 설정
Cypress.on("uncaught:exception", (err) => {
  // API 요청 문제로 인한 오류는 테스트를 중단하지 않도록 처리
  if (err.message.includes("API request failed")) {
    return false;
  }
  return true;
});
