

import React, { useState } from "react";
import UrlForm from "../components/UrlForm";
import UrlResult from "../components/UrlResult";
import UrlState from "../components/UrlState";

function Home() {
  const [urlData, setUrlData] = useState(null);

  const handleShortened = (data) => {
    console.log("Data received in Home:", data);

    setUrlData(data);
  };

  const shortUrl = urlData?.shortCode
    ? `http://localhost:5000/${urlData.shortCode}`
    : "";

  return (
    <>
      <UrlForm onShortened={handleShortened} />

      <UrlResult shortUrl={shortUrl} />

      <UrlState urlData={urlData} />
    </>
  );
}

export default Home;
