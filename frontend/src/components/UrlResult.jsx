
import { useState } from "react";

function UrlResult({ shortUrl }) {
    const [copied, setCopied] = useState(false);

    // Always convert the received URL to the public Nginx URL
    const shortCode = shortUrl
        ? shortUrl.split("/").pop()
        : "";

    const publicShortUrl = shortCode
        ? `http://localhost/${shortCode}`
        : "";

    const handleCopy = async () => {
        if (!publicShortUrl) return;

        try {
            await navigator.clipboard.writeText(publicShortUrl);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy URL:", error);
        }
    };

    const handleOpen = () => {
        if (!publicShortUrl) return;

        window.open(
            publicShortUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">

            <p className="mb-3 text-sm font-medium text-gray-700">
                {publicShortUrl
                    ? copied
                        ? "URL copied successfully!"
                        : "URL shortened successfully!"
                    : "Your shortened URL will appear here"}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">

                <input
                    type="text"
                    value={publicShortUrl}
                    placeholder="Your shortened URL"
                    readOnly
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none"
                />

                <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!publicShortUrl}
                    className="rounded-lg bg-gray-800 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>

                <button
                    type="button"
                    onClick={handleOpen}
                    disabled={!publicShortUrl}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Open URL
                </button>

            </div>
        </div>
    );
}

export default UrlResult;