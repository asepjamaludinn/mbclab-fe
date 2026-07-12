"use client";

import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { ChangePasswordFormData } from "../schemas/auth.schema";
import { api } from "@/shared/lib/api";
import { showToast } from "@/shared/lib/toast";

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

      const successMessage = "Password berhasil diganti.";
      setPasswordMessage(successMessage);

      showToast.success(
        "Password berhasil diganti",
        "Gunakan password baru Anda untuk login berikutnya.",
      );

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      let message = "Gagal mengganti password.";

      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        message = Array.isArray(serverMessage)
          ? serverMessage[0]
          : serverMessage || message;
      }

      setPasswordError(message);
      showToast.error("Gagal mengganti password", message);
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
