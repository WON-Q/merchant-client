import { useEffect, useState } from "react";
import { HookResponse } from "@/types/hook";
import { LoginResponseDto } from "@/app/api/auth/login/route";
import { ApiResponse } from "@/types/api";

/**
 * 인증 관련 기능을 처리하는 커스텀 훅
 *
 * @returns 인증 관련 기능과 상태를 포함하는 객체
 */
export function useAuth() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  /**
   * 로그인 시 토큰을 저장하는 함수
   *
   * @param token 저장할 액세스 토큰
   */
  const saveToken = (token: string): void => {
    try {
      // localStorage에 저장
      localStorage.setItem("token", token);

      // 쿠키에도 저장 (middleware에서 사용)
      document.cookie = `auth-token=${token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7일 유효

      setIsAuthenticated(true);

    } catch (error) {
      console.error("토큰 저장 중 오류 발생:", error);
    }
  };

  /**
   * 토큰을 제거하는 함수 (로그아웃 시 사용)
   */
  const removeToken = (): void => {
    try {
      // localStorage에서 토큰 제거
      localStorage.removeItem("token");

      // 쿠키에서도 토큰 제거
      document.cookie = "auth-token=; path=/; max-age=0"; // 즉시 만료

      setIsAuthenticated(false);

    } catch (error) {
      console.error("토큰 제거 중 오류 발생:", error);
    }
  };

  /**
   * 현재 저장된 토큰을 반환하는 함수
   *
   * @returns 저장된 토큰 또는 null
   */
  const getToken = (): string | null => {
    try {
      return localStorage.getItem("token");

    } catch (error) {
      console.error("토큰 조회 중 오류 발생:", error);
      return null;
    }
  };

  /**
   * 로그인 요청을 처리하는 함수
   *
   * @param accountId 아이디
   * @param password 비밀번호
   * @returns 로그인 결과를 포함하는 프로미스
   */
  const login = async (
    accountId: string,
    password: string
  ): Promise<HookResponse<LoginResponseDto>> => {
    // 이전 상태 초기화
    setIsLoggingIn(true);
    setAuthError(null);

    // 입력값 검증
    if (!accountId || !password) {
      const errorMessage = "아이디와 비밀번호를 모두 입력해주세요.";

      setAuthError(errorMessage);
      setIsLoggingIn(false);

      return {
        success: false,
        errorMessage,
      };
    }

    try {
      // API 호출 (로그인)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId, password }),
      });

      if (!response.ok) {
        // 401, 403, 404 등 인증 관련 에러는 일반적인 메시지로 처리
        if (response.status === 401 || response.status === 403 || response.status === 404) {
          const errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다.";
          setAuthError(errorMessage);
          setIsAuthenticated(false);

          return {
            success: false,
            errorMessage,
          };
        }

        // 그 외 서버 에러는 일반적인 오류 메시지로 처리
        const errorMessage = "로그인 처리 중 오류가 발생했습니다.";
        setAuthError(errorMessage);
        setIsAuthenticated(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<LoginResponseDto> = await response.json();

      // 로그인 정보가 없는 경우
      if (data.data == null) {
        const errorMessage = "로그인 정보를 받아올 수 없습니다.";

        setAuthError(errorMessage);
        setIsAuthenticated(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 로그인에 성공한 경우 토큰 저장
      if (data.data.accessToken) {
        saveToken(data.data.accessToken);
      }

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("로그인 오류:", error);

      const errorMessage = "로그인 처리 중 오류가 발생했습니다.";
      setAuthError(errorMessage);
      setIsAuthenticated(false);

      return {
        success: false,
        errorMessage,
      };

    } finally {
      setIsLoggingIn(false);
    }
  };

  /**
   * 로그아웃 처리 함수
   */
  const logout = (): void => {
    removeToken();
  };

  /**
   * 인증 상태 확인 함수
   *
   * @returns 인증 여부 (토큰 존재 여부)
   */
  const checkAuth = (): boolean => {
    const token = getToken();
    return !!token;
  };

  return {
    login,
    logout,
    isLoggingIn,
    isAuthenticated,
    authError,
    getToken,
    checkAuth,
  };
}
