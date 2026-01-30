/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type FieldValues } from "react-hook-form";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../redux/features/auth/authApi";
import { useAppSelector } from "../redux/hooks/hooks";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { otpEmail, otp } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res: any = await resetPassword({
        password: data.password,
        email: otpEmail,
        otp,
      });

      // Error
      if (res?.error) {
        return toast.error(res.error.data?.message || "Resend failed");
      }

      // Success
      if (res.data?.status === "success") {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <h2 className="text-2xl font-semibold text-sky-900">
          Set new password
        </h2>

        <p className="text-sm text-gray-500">
          Your new password must be different to previously used passwords.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-left">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-sky-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm text-left">
                {typeof errors.password.message === "string"
                  ? errors.password.message
                  : ""}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-lg"
          >
            {isLoading ? "loading..." : "Reset password"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 mx-auto"
        >
          <ArrowLeft size={16} />
          Back to login
        </button>
      </div>
    </div>
  );
}
