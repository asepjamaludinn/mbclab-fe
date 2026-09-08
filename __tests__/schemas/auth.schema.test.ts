import { changePasswordSchema } from "@/features/auth/schemas/auth.schema";

describe("Auth Schema Validations", () => {
  describe("changePasswordSchema", () => {
    const validData = {
      oldPassword: "OldPassword123!",
      newPassword: "NewStrongPassword123!",
      confirmPassword: "NewStrongPassword123!",
    };

    it("harus lolos validasi jika password memenuhi semua syarat", () => {
      const result = changePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("harus gagal jika password baru tidak memiliki huruf besar", () => {
      const result = changePasswordSchema.safeParse({
        ...validData,
        newPassword: "weakpassword123!",
        confirmPassword: "weakpassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("huruf besar");
      }
    });

    it("harus gagal jika password baru tidak memiliki angka", () => {
      const result = changePasswordSchema.safeParse({
        ...validData,
        newPassword: "WeakPassword!",
        confirmPassword: "WeakPassword!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("angka");
      }
    });

    it("harus gagal jika password baru tidak memiliki simbol", () => {
      const result = changePasswordSchema.safeParse({
        ...validData,
        newPassword: "WeakPassword123",
        confirmPassword: "WeakPassword123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("simbol");
      }
    });

    it("harus gagal jika konfirmasi password tidak sama", () => {
      const result = changePasswordSchema.safeParse({
        ...validData,
        confirmPassword: "DifferentPassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("tidak sama");
      }
    });

    it("harus gagal jika password baru sama dengan password lama", () => {
      const result = changePasswordSchema.safeParse({
        oldPassword: "SamePassword123!",
        newPassword: "SamePassword123!",
        confirmPassword: "SamePassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("tidak boleh sama");
      }
    });
  });
});
