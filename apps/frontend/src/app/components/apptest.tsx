// src/components/ApiTest.jsx
import { useState } from "react";

export default function ApiTest() {
  const [paymentResult, setPaymentResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const callExpress = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }),
      });
      const data = await res.json();
      setPaymentResult(data);
    } catch (err) {
      console.error("Express error:", err);
    }
  };

  const callFastAPI = async () => {
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: [1, 2, 3, 4, 5] }),
      });
      const data = await res.json();
      setPredictionResult(data);
    } catch (err) {
      console.error("FastAPI error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test Backend APIs</h2>
      <button onClick={callExpress}>Test Express (Payment)</button>
      {paymentResult && <pre>{JSON.stringify(paymentResult, null, 2)}</pre>}

      <button onClick={callFastAPI}>Test FastAPI (Predict)</button>
      {predictionResult && (
        <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
      )}
    </div>
  );
}
