import React, { useState } from "react";

function UrlForm({ onShortened }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/urls/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalUrl: url.trim(),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to shorten URL."
        );
      }
      console.log("Shortened URL:", data);


      if (onShortened) {
        onShortened(data.data);
      }

      setUrl("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>URL LINKS</h3>

      <form
        onSubmit={handleSubmit}
        className="flex gap-3"
      >
        <div className="flex-1">
          <input
            type="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>
    </div>
  );
}

export default UrlForm;

