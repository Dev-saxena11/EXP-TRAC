import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.js";

import { API_URL } from "../config.js";
const SignUp = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //to fetch profile
  const fetchProfile = async (token) => {
    if (!token) return null;
    const res = await axios.get(`${API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (token) storage.setItem("token", token);
      if (profile) storage.setItem("user", JSON.stringify(profile));
    } catch (error) {
      console.error("storage error:", error);
    }
  };

  // Google Sign-in Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await axios.post(
        `${API_URL}/api/user/google-login`,
        { token: idToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data || {};
      const token = data.token || null;
      const profile = data.user || null;

      persistAuth(profile, token);
      if (typeof onSignup === "function") {
        onSignup(profile, rememberMe, token);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setErrors({ google: err.response?.data?.message || err.message || "Google Sign-In failed" });
    } finally {
      setIsLoading(false);
    }
  };


  //to validate that all field are filled by user or not
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //to signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/user/register`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } },
      );
      const data = res.data || {};
      const token = data.token ?? null;
      let profile = data.user ?? null;
      if (!profile) {
        // check for any extra fields returned that could be user info
        const copy = { ...data };
        delete copy.token;
        delete copy.user;
        if (Object.keys(copy).length) profile = copy;
      }

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetchErr) {
          console.warn("Could not fetch profile after signup token:", fetchErr);
          profile = null;
        }
      }
      if (!profile) profile = { name, email };
      persistAuth(profile, token);
      if (typeof onSignup === "function") {
        try {
          onSignup(profile, rememberMe, token);
        } catch (callErr) {
          console.warn("onSignup threw:", callErr);
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      <div className={signupStyles.cardContainer}>
        <div className={signupStyles.header}>
          <button
            onClick={() => navigate(-1)}
            className={signupStyles.backButton}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className={signupStyles.avatar}>
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className={signupStyles.headerTitle}>Create Account</h1>
          <p className={signupStyles.headerSubtitle}>
            Join ExpenseTracker to manage your finances
          </p>
        </div>

        <div className={signupStyles.formContainer}>
          {errors.api && <p className={signupStyles.apiError}>{errors.api}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="name" className={signupStyles.label}>
                {" "}
                Full Name
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${signupStyles.input} ${errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                  placeholder="John Doe"
                />
              </div>

              {errors.name && (
                <p className={signupStyles.fieldError}>{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className={signupStyles.label}>
                {" "}
                Email Address
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${signupStyles.input} ${errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                  placeholder="your@example.com"
                />
              </div>

              {errors.email && (
                <p className={signupStyles.fieldError}>{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className={signupStyles.label}>
                Password
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${signupStyles.passwordInput} ${errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className={signupStyles.fieldError}>{errors.password}</p>
              )}
            </div>

            <div className={signupStyles.checkboxContainer}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={signupStyles.checkbox}
              />
              <label htmlFor="remember" className={signupStyles.checkboxLabel}>
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${signupStyles.button} ${isLoading ? signupStyles.buttonDisabled : ""}`}
            >
              {isLoading ? (
                <>
                  <svg className={signupStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2-647z"></path>
                  </svg>
                  Creating account...
                </>

              ) : (
                "Create Account"
              )}
            </button>

            {/* OR Separator */}
            <div className="flex items-center my-4">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2.5 border border-[#dadce0] bg-[#f8f9fa] py-2.5 rounded-full font-medium text-[#3c4043] hover:bg-[#f1f3f4] hover:border-[#d2d4d7] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-1.59-.66-3.41 0-5z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign up with Google
            </button>

          </form>

          <div className={signupStyles.signInContainer}>
            <div className={signupStyles.signInText}>
              Already have an account?{" "}
              <Link to="/login" className={signupStyles.signInLink}>
                Sign In</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
