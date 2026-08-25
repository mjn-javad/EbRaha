import React, { FormEvent, useState } from "react";
import apiClientAuth from "../../services/api-client_auth";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../Shared/InputField";
import MessageAlert from "../Shared/MessageAlert";

interface RegisterForm {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Send registration request
      const res = await apiClientAuth.post("/register", {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // Save email in localStorage for use in verification page
      localStorage.setItem("tempEmail", form.email);
      localStorage.setItem("tempName", form.name);

      setMessage(
        res.data.message ||
          "Registration successful. Sending verification code...",
      );

      // Redirect to verification page after 1 second
      setTimeout(() => {
        navigate("/verify", {
          state: {
            email: form.email,
            message: "Verification code has been sent to your email",
          },
        });
      }, 1500);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form
        onSubmit={handleSubmit}
        className="auth-card"
      >
        <div className="auth-card__brand">EbRahaStyle</div>
        <p className="auth-card__eyebrow">Private account</p>
        <h1>Create your account</h1>

        <InputField
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          required={true}
        />
        <InputField
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required={true}
        />
        <InputField
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          required={true}
          type="email"
        />
        <InputField
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          required={true}
          type="password"
        />
        <InputField
          name="confirmPassword"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required={true}
          type="password"
        />

        <button
          type="submit"
          disabled={loading}
          className="auth-submit"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <Link
          to="/loginlogout"
          className="auth-link"
        >
          Already have an account? Sign in
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

export default Register;
