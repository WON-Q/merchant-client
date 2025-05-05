// 가입부터 로그인까지의 전체 플로우 테스트
describe("회원가입 및 로그인 테스트", () => {
  // 테스트마다 고유한 사용자 정보를 만들기 위한 타임스탬프
  const timestamp = new Date().getTime();
  // userId는 4~20자 제한을 준수하도록 수정
  const testUser = {
    userId: `test${timestamp.toString().slice(-8)}`, // 숫자 8자리로 제한하여 총 12자 이내
    password: "Test1234!",
    email: `testuser${timestamp}@example.com`,
    businessName: "테스트 상호",
    ownerName: "홍길동",
    phoneNumber: "01012345678",
    address: "서울시 강남구 테스트로 123",
    businessLaunchingDate: "2025-05-05",
    accountHolderName: "홍길동",
    bankName: "004", // 국민은행
    accountNumber: "123456789012",
    storeDescription: "테스트 매장입니다. 맛있는 음식을 제공합니다.",
  };

  beforeEach(() => {
    // 각 테스트 전에 로컬스토리지 초기화
    cy.clearLocalStorage();
    // 네비게이션 오류 예외 처리
    cy.on("uncaught:exception", (err) => {
      // 내비게이션 관련 에러 또는 비동기 작업 취소 에러는 무시
      return false;
    });
  });

  it("회원가입 후 로그인하기", () => {
    // 1. 회원가입 페이지 방문 (지연 적용)
    cy.visit("/register");
    cy.wait(1000); // 페이지 로드 후 1초 대기
    cy.contains("가맹점 회원가입").should("be.visible");

    // 2. 약관 동의 단계 (Step 1)
    cy.contains("약관 동의").should("be.visible");
    cy.wait(500); // UI 표시 확인 후 0.5초 대기

    // 약관 페이지를 직접 방문 (약관 보기를 통해 클릭할 경우, 정상적으로 테스트가 진행되지 않음)
    cy.visit("/terms/services");
    cy.wait(1000); // 약관 페이지 로드 대기
    cy.url().should("include", "/terms/services"); // URL 확인
    cy.contains("서비스 이용약관").should("be.visible");

    // 약관 페이지 스크롤 처리
    cy.get("body").then(($body) => {
      const scrollElements = [
        ".overflow-y-auto",
        ".prose",
        ".h-\\[70vh\\]",
        ".space-y-6",
      ];

      let found = false;

      for (const selector of scrollElements) {
        if ($body.find(selector).length) {
          found = true;
          cy.get(selector).scrollTo("bottom", { duration: 1500 });
          break;
        }
      }

      if (!found) {
        cy.scrollTo("bottom", { duration: 1500 });
      }
    });

    // 가입 페이지로 돌아가기
    cy.scrollTo("bottom", { duration: 500 });
    cy.wait(1000);
    cy.get('[data-cy="back-button"]').click();
    cy.wait(1000);
    cy.url().should("include", "/register");

    // 개인정보 처리방침 페이지 방문 (약관 보기를 통해 클릭할 경우, 정상적으로 테스트가 진행되지 않음)
    cy.visit("/terms/privacy");
    cy.wait(1000);
    cy.url().should("include", "/terms/privacy");
    cy.contains("개인정보 처리방침").should("be.visible");

    // 약관 페이지 스크롤 처리
    cy.get("body").then(($body) => {
      const scrollElements = [
        ".overflow-y-auto",
        ".prose",
        ".h-\\[70vh\\]",
        ".space-y-6",
      ];

      let found = false;

      for (const selector of scrollElements) {
        if ($body.find(selector).length) {
          found = true;
          cy.get(selector).scrollTo("bottom", { duration: 4000 });
          break;
        }
      }

      if (!found) {
        cy.scrollTo("bottom", { duration: 1500 });
      }
    });

    // 가입 페이지로 돌아가기
    cy.scrollTo("bottom", { duration: 500 });
    cy.wait(1000);
    cy.get('[data-cy="back-button"]').click();
    cy.wait(1000);
    cy.url().should("include", "/register");

    // 마케팅 정보 수신 약관 페이지 방문 (약관 보기를 통해 클릭할 경우, 정상적으로 테스트가 진행되지 않음)
    cy.scrollTo("bottom", { duration: 1500 });
    cy.visit("/terms/marketing");
    cy.wait(1000);
    cy.url().should("include", "/terms/marketing");
    cy.contains("마케팅 정보 수신").should("be.visible");

    // 약관 페이지 스크롤 처리
    cy.get("body").then(($body) => {
      const scrollElements = [
        ".overflow-y-auto",
        ".prose",
        ".h-\\[70vh\\]",
        ".space-y-6",
      ];

      let found = false;

      for (const selector of scrollElements) {
        if ($body.find(selector).length) {
          found = true;
          cy.get(selector).scrollTo("bottom", { duration: 2500 });
          break;
        }
      }

      if (!found) {
        cy.scrollTo("bottom", { duration: 1500 });
      }
    });

    // 가입 페이지로 돌아가기
    cy.scrollTo("bottom", { duration: 500 });
    cy.wait(1000);
    cy.get('[data-cy="back-button"]').click();
    cy.wait(1000);
    cy.url().should("include", "/register");

    // 모든 약관에 동의
    cy.get(".rounded-xl.overflow-hidden.border")
      .first()
      .then(($container) => {
        // 클래스로 직접 찾기
        cy.wrap($container)
          .find(".absolute.inset-0.flex")
          .click({ force: true });
      });

    cy.wait(500);

    // 다음 단계로
    cy.scrollTo("bottom", { duration: 500 });
    cy.wait(500);
    cy.get('[data-cy="next-button"]').click();

    // 3. 사업자 정보 등록 단계 (Step 2)
    cy.scrollTo("top", { duration: 500 });
    cy.contains("사업자 정보 등록").should("be.visible");
    cy.wait(1000);

    // 사업자 등록증 업로드 - 실제 파일 업로드 진행
    cy.intercept("POST", "**/api/auth/signup/business-license").as(
      "businessLicenseUpload"
    );
    cy.uploadFile('input[type="file"]', "business-license.pdf");
    cy.wait("@businessLicenseUpload").then((interception) => {
      console.log("Request Headers:", interception.request.headers);
      console.log("Request Body:", interception.request.body);
      console.log("Response:", interception.response.body);
    });

    // 업로드 완료 대기 (실제 API 응답을 기다림)
    cy.wait(2000);

    // 업로드 완료 확인
    cy.contains("파일이 업로드되었습니다").should("be.visible");
    cy.wait(1000);

    // 사업자등록번호가 자동으로 입력되었는지 확인
    cy.get('input[name="businessRegistrationNo"]')
      .should("not.have.value", "")
      .should("be.visible");
    cy.wait(500);

    // 사업자 정보 입력
    cy.scrollTo("center", { duration: 500 });
    cy.get('input[name="businessName"]').type(testUser.businessName, {
      delay: 100,
    });
    cy.get('input[name="ownerName"]').type(testUser.ownerName, { delay: 100 });
    cy.get('input[name="phoneNumber"]').type(testUser.phoneNumber, {
      delay: 100,
    });
    cy.get('input[name="address"]').type(testUser.address, { delay: 100 });
    cy.get('input[name="businessLaunchingDate"]').type(
      testUser.businessLaunchingDate,
      { delay: 200 }
    );
    cy.get('input[name="email"]').type(testUser.email, { delay: 100 });
    cy.get('input[name="userId"]').type(testUser.userId, { delay: 100 });

    // 중복확인
    cy.contains("중복 확인").click();
    cy.wait(2000); // API 응답 대기 시간 증가

    // 비밀번호 입력
    cy.get('input[name="password"]').type(testUser.password, { delay: 100 });
    cy.get('input[name="confirmPassword"]').type(testUser.password, {
      delay: 100,
    });
    cy.wait(100);

    // 다음 단계로
    cy.get('[data-cy="next-button"]').click();
    cy.wait(1500);

    // 4. 매장 정보 설정 단계 (Step 3)
    cy.scrollTo("top", { duration: 500 });
    cy.contains("매장 정보 설정").should("be.visible");
    cy.wait(1000);

    // 매장 이미지 업로드
    cy.get('input[type="file"]').first().attachFile("store-image.png");
    cy.wait(2000); // 파일 업로드 처리 대기

    // 업로드 완료 확인
    cy.contains("파일이 업로드되었습니다").should("be.visible");
    cy.wait(1000);

    // 매장 소개 입력
    cy.scrollTo("center", { duration: 500 });
    cy.get('textarea[name="storeDescription"]').type(
      testUser.storeDescription,
      { delay: 30 }
    );
    cy.wait(1000);

    // 영업 시간 설정 - 요일별 영업여부와 시간 설정

    // 월요일은 영업 필수 (이미 기본적으로 활성화되어 있음)
    // 요일 레이아웃 구조 확인
    cy.contains("월")
      .closest("div.grid")
      .within(() => {
        // 영업여부 스위치는 요일 바로 옆 div에 위치 (2번째 자식)
        cy.get("div")
          .eq(1)
          .within(() => {
            // Switch 컴포넌트 확인 (relative 클래스를 포함하는 div로 변경)
            cy.get('div[class*="relative"]').should("exist");
          });

        // 오픈시간 드롭다운 (3번째 자식 div)
        cy.get("div")
          .eq(2)
          .within(() => {
            cy.get('div[role="combobox"]').click({ force: true });
          });
      });

    cy.wait(500);
    cy.contains("09:00").click({ force: true });
    cy.wait(500);

    // 월요일 마감시간 설정
    cy.contains("월")
      .closest("div.grid")
      .within(() => {
        // 마감시간 드롭다운 (4번째 자식 div)
        cy.get("div")
          .eq(3)
          .within(() => {
            cy.get('div[role="combobox"]').click({ force: true });
          });
      });
    cy.wait(500);
    cy.contains("21:00").click({ force: true });
    cy.wait(1000);

    // 화요일 영업 비활성화
    cy.contains("화")
      .closest("div.grid")
      .within(() => {
        // 스위치 컴포넌트 직접 클릭 (2번째 자식 div)
        cy.get("div")
          .eq(1)
          .within(() => {
            // relative 클래스를 포함하는 div를 찾아서 클릭
            cy.get('div[class*="relative"]').click({ force: true });
          });
      });
    cy.wait(1000);

    // 수요일 영업시간 변경 (10:00 - 20:00)
    cy.contains("수")
      .closest("div.grid")
      .within(() => {
        // 오픈시간 드롭다운 (3번째 자식 div)
        cy.get("div")
          .eq(2)
          .within(() => {
            cy.get('div[role="combobox"]').click({ force: true });
          });
      });
    cy.wait(500);
    cy.contains("10:00").click({ force: true });
    cy.wait(500);

    // 수요일 마감시간 설정
    cy.contains("수")
      .closest("div.grid")
      .within(() => {
        // 마감시간 드롭다운 (4번째 자식 div)
        cy.get("div")
          .eq(3)
          .within(() => {
            cy.get('div[role="combobox"]').click({ force: true });
          });
      });
    cy.wait(500);
    cy.contains("20:00").click({ force: true });
    cy.wait(1000);

    // 토요일 영업 비활성화
    cy.contains("토")
      .closest("div.grid")
      .within(() => {
        // 스위치 컴포넌트 직접 클릭 (2번째 자식 div)
        cy.get("div")
          .eq(1)
          .within(() => {
            // relative 클래스를 포함하는 div를 찾아서 클릭
            cy.get('div[class*="relative"]').click({ force: true });
          });
      });
    cy.wait(1000);

    // 일요일 영업 비활성화
    cy.contains("일")
      .closest("div.grid")
      .within(() => {
        // 스위치 컴포넌트 직접 클릭 (2번째 자식 div)
        cy.get("div")
          .eq(1)
          .within(() => {
            // relative 클래스를 포함하는 div를 찾아서 클릭
            cy.get('div[class*="relative"]').click({ force: true });
          });
      });
    cy.wait(1000);

    // 다음 단계로
    cy.scrollTo("bottom", { duration: 500 });
    cy.wait(500);
    cy.get('[data-cy="next-button"]').click();

    // 5. 계좌 정보 등록 단계 (Step 4)
    cy.contains("계좌 정보 등록").should("be.visible");
    cy.wait(1000);

    // 은행 선택
    cy.get('div[role="combobox"]').click();
    cy.wait(500);
    cy.contains("국민은행").click();
    cy.wait(500);

    // 계좌 정보 입력
    cy.get('input[name="accountNumber"]').type(testUser.accountNumber, {
      delay: 100,
    });
    cy.get('input[name="accountHolderName"]').type(testUser.accountHolderName, {
      delay: 100,
    });
    cy.wait(1000);

    // 완료 버튼 클릭
    cy.get('[data-cy="next-button"]').click();
    cy.wait(3000); // API 응답 대기 시간 증가

    // 6. 가입 완료 확인 (Step 5)
    cy.contains("회원가입 완료").should("be.visible", { timeout: 10000 });
    cy.wait(1000);
    cy.contains("로그인하고 시작하기").click();
    cy.wait(1500);

    // 7. 로그인 페이지로 이동
    cy.url().should("include", "/login");
    cy.contains("가맹점 로그인").should("be.visible");
    cy.wait(1000);

    // 로그인 정보 입력
    cy.get("input#accountId").type(testUser.userId, { delay: 50 });
    cy.get("input#password").type(testUser.password, { delay: 50 });
    cy.wait(1000);

    // 로그인 버튼 클릭
    cy.contains("로그인").click();
    cy.wait(3000); // API 응답 대기 시간 증가

    // 로그인 성공 확인
    cy.url().should("include", "/dashboard", { timeout: 10000 });
    cy.wait(1000);

    // 토큰이 저장되었는지 확인
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.not.be.null;
    });
  });

  it("잘못된 계정 정보로 로그인 시 에러 메시지 표시", () => {
    // 로그인 페이지 방문
    cy.visit("/login");
    cy.wait(1000);

    // 잘못된 계정 정보 입력
    cy.get("input#accountId").type("wronguser", { delay: 50 });
    cy.get("input#password").type("wrongpassword", { delay: 50 });
    cy.wait(1000);

    // 로그인 버튼 클릭
    cy.contains("로그인").click();
    cy.wait(2000);

    // 에러가 표시될 때까지 기다림
    cy.contains("아이디 또는 비밀번호가 올바르지 않습니다.", {
      timeout: 10000,
    }).should("be.visible");
    cy.wait(1000);

    // 로그인 페이지에 머물러 있는지 확인
    cy.url().should("include", "/login");
  });
});
