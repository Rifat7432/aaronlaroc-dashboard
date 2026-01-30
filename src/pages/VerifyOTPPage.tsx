/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useVerifyOTPMutation } from "../redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { setOTP } from "../redux/features/auth/authSlice";


export default function OTPVerification() {
  const resendOtpEmail = useAppSelector((state) => state.auth.otpEmail);
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
 

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.match(/\d/g) || [];

    const newOtp = [...otp];
    digits.forEach((digit: string, index: number) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setMessage("Please enter complete OTP");
      return;
    }
    if (!resendOtpEmail) {
      toast.error("Something went wrong");
      navigate("/login");
      return;
    }
    try {
      const res: any = await verifyOTP({
        email: resendOtpEmail,
        otp: `${parseInt(otpValue)}`,
      });

      // Error
      if (res?.error) {
        return toast.error(res.error.data?.message || "Login failed");
      }

      // Success
      if (res.data?.status === "success") {
        toast.success(res.data.message);
        dispatch(setOTP(otpValue));
        navigate("/reset-password");
        setOtp(["", "", "", "", "", ""]);
   
      }
    } catch (_err) {
      toast.error("Something went wrong");
    }
  };


  const handleBackToLogin = () => {
    setMessage("Redirecting to login...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-3 text-sky-900">
          Check your email
        </h2>

        {/* Subtitle */}
        <p className="text-center text-sm text-gray-500 mb-10">
          We sent a verification link to
          <br />
          your contact email
        </p>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-3xl font-medium bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-800 focus:bg-white transition-all"
            />
          ))}
        </div>

        {/* Message Display */}
        {message && (
          <div className="text-center mb-4 text-sm text-gray-700">
            {message}
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-lg transition-colors duration-200 mb-4"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>



        {/* Back to Login Link */}
        <div className="text-center">
          <button
            onClick={handleBackToLogin}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to log in
          </button>
        </div>
      </div>
    </div>
  );
}
