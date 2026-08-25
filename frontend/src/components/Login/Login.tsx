import React, { FormEvent, useState } from "react";
import apiClientAuth from "../../services/api-client_auth";
import { Link } from "react-router-dom";
import MessageAlert from "../Shared/MessageAlert";
import InputField from "../Shared/InputField";

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const res = await apiClientAuth.post("/login", {
        username: form.username,
        password: form.password,
      });

      setMessage(res.data.message);

      // پاک کردن فرم
      setForm({
        username: "",
        password: "",
      });

      // مهم: بعد از 1 ثانیه به صفحه اصلی هدایت کن
      setTimeout(() => {
        window.location.href = "/"; // رفرش کامل صفحه
      }, 1000);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Login Error");
    }
  };

  return (
    <div className="auth-page">
      <form
        onSubmit={handleSubmit}
        className="auth-card"
      >
        <div className="auth-card__brand">EbRahaStyle</div>
        <p className="auth-card__eyebrow">Welcome back</p>
        <h1>Sign in to your account</h1>
        <InputField
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required={true}
        />

        <InputField
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          required={true}
          type="password"
        />

        <button
          type="submit"
          className="auth-submit"
        >
          OK
        </button>

        <Link
          to="/register"
          className="auth-link"
        >
          New to EbRahaStyle? Create an account
        </Link>

        <Link
          to="/forgot-password"
          className="auth-link"
        >
          Forgotten your password? Recover it
        </Link>

        {message && <MessageAlert message={message} type="success" />}

        {error && <MessageAlert message={error} type="error" />}
      </form>
    </div>
  );
};

export default Login;
