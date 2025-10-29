import React, { useState } from "react";
import { useKidsModeContext } from "../../context/KidsModeContext";

export const SignupForm: React.FC = () => {
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const { setKidsMode } = useKidsModeContext();
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAge = Number(age);

    // Basic signup request (you probably already have this)
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, age: numericAge }),
    });

    if (!res.ok) {
      setStatus("Signup failed");
      return;
    }

    if (numericAge < 13) {
      // mark Kids Mode locally and trigger COPPA parent-consent flow
      setKidsMode(true);
      // create a parental consent request on the backend
      await fetch("/api/coppa/request-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childEmail: email, childAge: numericAge }),
      });
      setStatus(
        "Parental consent is required. Ask a parent to follow the emailed link.",
      );
      return;
    }

    setStatus("Signup successful");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Age
        <input
          required
          type="number"
          min={1}
          value={age}
          onChange={(e) =>
            setAge(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </label>
      <button type="submit">Sign up</button>
      {status && <p>{status}</p>}
    </form>
  );
};