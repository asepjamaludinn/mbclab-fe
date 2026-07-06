"use client";

import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth";
import { ChangePasswordFormData } from "@/features/auth/schemas/auth.schema";
import { api } from "@/shared/lib/api";

export function useChangePassword() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const queryClient = useQueryClient();

  const handleChangePassword = async (
    data: ChangePasswordFormData,
    onSuccess?: () => void,
  ) => {
    setPasswordMessage("");
    setPasswordError("");

    try {
      setIsChangingPassword(true);

      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      try {
        await api.post("/auth/refresh");
      } catch {}

      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      setPasswordMessage("Password berhasil diganti.");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setPasswordError(
          error.response?.data?.message || "Gagal mengganti password.",
        );
      } else {
        setPasswordError("Gagal mengganti password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetMessages = () => {
    setPasswordMessage("");
    setPasswordError("");
  };

  return {
    isChangingPassword,
    passwordMessage,
    passwordError,
    handleChangePassword,
    resetMessages,
  };
}
