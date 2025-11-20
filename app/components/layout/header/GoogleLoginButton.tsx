"use client";

import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { message } from "antd";

interface GoogleLoginButtonProps {
  onReceivedToken?: (token: string) => void;
}

export default function GoogleLoginButton({ onReceivedToken }: GoogleLoginButtonProps) {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      message.error("Không nhận được Google token");
      return;
    }
    sessionStorage.setItem("google_id_token", idToken);
    console.log("idToken", idToken);
    if (onReceivedToken) onReceivedToken(idToken);
  };

  const handleError = () => {
    message.error("Đăng nhập Google thất bại");
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap theme="outline" size="large" />
    </GoogleOAuthProvider>
  );
}
