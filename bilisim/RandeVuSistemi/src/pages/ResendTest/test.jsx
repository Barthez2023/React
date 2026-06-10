import React, { useState } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      // Grâce au proxy de Vite, ceci appellera en réalité http://localhost:3000/api/send
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Email envoyé avec succès !");
        setEmail("");
      } else {
        setStatus(`Erreur: ${result.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      setStatus("Erreur lors de la connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2>Envoyer un email</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Adresse email</label>
        <input
          id="email"
          type="email"
          placeholder="exemple@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          style={{ width: "100%", padding: "10px", marginTop: "8px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", backgroundColor: loading ? "#ccc" : "#0070f3", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "15px", fontSize: "14px", color: status.startsWith("Erreur") ? "#d32f2f" : "#2e7d32" }}>
          {status}
        </p>
      )}
    </div>
  );
}