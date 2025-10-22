"use client";

import { useState } from "react";

export default function EmailInput() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // for showing messages
  const [loading, setLoading] = useState(false);

  async function handleAddSubscriber() {
    if (!email.trim()) {
      setStatus("Please enter your email address.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("✅ Thanks for subscribing!");
        setEmail("");
      } else {
        setStatus("❌ Subscription failed, please try again.");
      }
    } catch (err) {
      console.error("Failed to add subscriber:", err.message);
      setStatus("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="sign-up"
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address..."
          disabled={loading}
        />

        <button
          onClick={handleAddSubscriber}
          className="button-card"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </div>

      {/* Inline feedback message */}
      {status && (
        <p
          style={{
            color: status.startsWith("✅")
              ? "green"
              : status.startsWith("❌")
              ? "red"
              : "orange",
            fontSize: "0.9rem",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
