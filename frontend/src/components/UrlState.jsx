
import React, { useEffect, useState } from "react";

function UrlStats({ urlData }) {
    const [stats, setStats] = useState(urlData);

    const shortUrl = stats?.shortCode
        ? `http://localhost/${stats.shortCode}`
        : "";

    useEffect(() => {
        if (!urlData?.shortCode) {
            return;
        }

        setStats(urlData);

        const fetchStats = async () => {
            try {
                const response = await fetch(
                    `/api/urls/stats/${urlData.shortCode}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch URL statistics");
                }

                const data = await response.json();

                setStats(data.data || data);
            } catch (error) {
                console.error(
                    "Failed to fetch URL statistics:",
                    error
                );
            }
        };

        fetchStats();

        const interval = setInterval(() => {
            fetchStats();
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [urlData]);

    return (
        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-semibold">
                URL Statistics
            </h2>

            <div className="space-y-4">

                {/* Original URL */}
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Original URL
                    </p>

                    <p className="break-all text-gray-800">
                        {stats?.originalUrl || "N/A"}
                    </p>
                </div>

                {/* Short URL */}
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Short URL
                    </p>

                    {shortUrl ? (
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-blue-600 hover:underline"
                        >
                            {shortUrl}
                        </a>
                    ) : (
                        <p className="text-gray-800">
                            N/A
                        </p>
                    )}
                </div>

                {/* Clicks */}
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Number of Clicks
                    </p>

                    <p className="text-2xl font-bold text-gray-800">
                        {stats?.clicks ?? 0}
                    </p>
                </div>

                {/* Created Date */}
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Created Date
                    </p>

                    <p className="text-gray-800">
                        {stats?.createdAt
                            ? new Date(
                                  stats.createdAt
                              ).toLocaleString()
                            : "N/A"}
                    </p>
                </div>

                {/* Expires */}
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Expires
                    </p>

                    <p className="text-gray-800">
                        {stats?.expiresAt
                            ? new Date(
                                  stats.expiresAt
                              ).toLocaleString()
                            : "Never"}
                    </p>
                </div>

            </div>
        </div>
    );
}

export default UrlStats;