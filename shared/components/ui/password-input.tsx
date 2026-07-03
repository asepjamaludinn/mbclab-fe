"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

type PasswordInputProps = {
  placeholder: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({
  placeholder,
  error,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const blockClipboard = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          onPaste={blockClipboard}
          onCopy={blockClipboard}
          onCut={blockClipboard}
          className={`rounded-[22px] bg-white/80 pr-12 text-grey-900 placeholder:text-grey-400 shadow-sm backdrop-blur-xl transition ${
            error
              ? "border-2 border-error focus:border-error focus:ring-2 focus:ring-error/20"
              : "border border-white/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${
            error ? "text-error" : "text-grey-500 hover:text-primary"
          }`}
          aria-label={
            showPassword ? "Sembunyikan password" : "Tampilkan password"
          }
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && (
        <span className="mt-2 block font-secondary text-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}
