// MainContainer.js
import React, { useState } from "react";
import ExpiryStrikeFetcher from "./ExpiryStrikeFetcher";
import RecommendationFetcher from "./RecommendationFetcher";

function MainContainer() {
  const [optionData, setOptionData] = useState(null);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* col-md-6 means 2 columns on medium+ screens, 12 means 1 column on small screens */}
        <div className="col-12 col-md-6 mb-4">
          <ExpiryStrikeFetcher onDataFetched={setOptionData} />
        </div>

        <div className="col-12 col-md-6">
          {optionData ? ( // Conditionally render the RecommendationFetcher
            <RecommendationFetcher {...optionData} />
          ) : (
            // This is the placeholder content for the RecommendationFetcher's column
            // when no data has been fetched yet.
            // We use the same card styling to keep a consistent look.
            <div className="card p-4 shadow" style={{ minHeight: '300px' }}>
              <h4>Step 2: Choose Expiry & Strike</h4>
              <div className="alert alert-warning mt-4 text-center">
                Please fetch expiries and strikes first.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainContainer;