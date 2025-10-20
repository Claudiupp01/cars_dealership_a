// frontend/src/pages/RegisterPage.jsx - FIXED VERSION
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus, AlertCircle, CheckCircle, Info } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
    full_name: false,
  });

  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return "Invalid email format (e.g., user@example.com)";
    }
    if (value.length > 100) return "Email is too long";
    if (value.startsWith(".") || value.startsWith("-")) {
      return "Email cannot start with . or -";
    }
    return "";
  };

  const validateUsername = (value) => {
    if (!value) return "Username is required";
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) {
      if (value.length < 3) return "Username must be at least 3 characters";
      if (value.length > 20) return "Username must be at most 20 characters";
      return "Username can only contain letters, numbers, and underscore";
    }
    if (/^[0-9]/.test(value)) {
      return "Username cannot start with a number";
    }
    return "";
  };

  const validateFullName = (value) => {
    if (!value) return "";
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    if (!nameRegex.test(value)) {
      if (value.length < 2) return "Name must be at least 2 characters";
      if (value.length > 50) return "Name is too long";
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 3) {
      return "Password must be at least 3 characters";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== formData.password) {
      return "Passwords do not match";
    }
    return "";
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 4)
      return { strength, label: "Medium", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
      full_name: true,
    });

    const validationErrors = {
      email: validateEmail(formData.email),
      username: validateUsername(formData.username),
      full_name: validateFullName(formData.full_name),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    if (Object.values(validationErrors).some((err) => err !== "")) {
      setError("Please fix all errors before submitting");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name || null,
      });

      await login(formData.username, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Calculate errors
  const emailError = touched.email ? validateEmail(formData.email) : "";
  const usernameError = touched.username
    ? validateUsername(formData.username)
    : "";
  const fullNameError = touched.full_name
    ? validateFullName(formData.full_name)
    : "";
  const passwordError = touched.password
    ? validatePassword(formData.password)
    : "";
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(formData.confirmPassword)
    : "";

  const isFormValid =
    formData.email &&
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    !emailError &&
    !usernameError &&
    !passwordError &&
    !confirmPasswordError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Create Account
          </h2>
          <p className="text-center text-slate-600 mb-8">
            Join Elite Motors today
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("full_name")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition ${
                    fullNameError
                      ? "border-red-300 bg-red-50"
                      : touched.full_name &&
                        formData.full_name &&
                        !fullNameError
                      ? "border-green-300 bg-green-50"
                      : "border-slate-300"
                  }`}
                  placeholder="John Doe"
                />
                {touched.full_name && formData.full_name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {fullNameError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {!touched.full_name && (
                <p className="mt-1 text-xs text-slate-500 flex items-start">
                  <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Optional - Your display name</span>
                </p>
              )}
              {fullNameError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {fullNameError}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition ${
                    emailError
                      ? "border-red-300 bg-red-50"
                      : touched.email && formData.email && !emailError
                      ? "border-green-300 bg-green-50"
                      : "border-slate-300"
                  }`}
                  placeholder="john@example.com"
                />
                {touched.email && formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {emailError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {!touched.email && (
                <p className="mt-1 text-xs text-slate-500 flex items-start">
                  <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Format: user@example.com</span>
                </p>
              )}
              {emailError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => handleBlur("username")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition ${
                    usernameError
                      ? "border-red-300 bg-red-50"
                      : touched.username && formData.username && !usernameError
                      ? "border-green-300 bg-green-50"
                      : "border-slate-300"
                  }`}
                  placeholder="johndoe"
                />
                {touched.username && formData.username && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {usernameError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {!touched.username && (
                <p className="mt-1 text-xs text-slate-500 flex items-start">
                  <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    3-20 characters, letters, numbers, and underscore only
                  </span>
                </p>
              )}
              {usernameError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {usernameError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition ${
                    passwordError
                      ? "border-red-300 bg-red-50"
                      : touched.password && formData.password && !passwordError
                      ? "border-green-300 bg-green-50"
                      : "border-slate-300"
                  }`}
                  placeholder="••••••••"
                />
                {touched.password && formData.password && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {passwordError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Password Strength:
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength.label === "Weak"
                          ? "text-red-600"
                          : passwordStrength.label === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength / 6) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {!touched.password && (
                <p className="mt-1 text-xs text-slate-500 flex items-start">
                  <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Minimum 3 characters</span>
                </p>
              )}

              {passwordError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition ${
                    confirmPasswordError
                      ? "border-red-300 bg-red-50"
                      : touched.confirmPassword &&
                        formData.confirmPassword &&
                        !confirmPasswordError
                      ? "border-green-300 bg-green-50"
                      : "border-slate-300"
                  }`}
                  placeholder="••••••••"
                />
                {touched.confirmPassword && formData.confirmPassword && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {confirmPasswordError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {!touched.confirmPassword && (
                <p className="mt-1 text-xs text-slate-500 flex items-start">
                  <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Re-enter your password</span>
                </p>
              )}
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
