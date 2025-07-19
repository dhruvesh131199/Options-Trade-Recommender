// MainContainer.js
import React, { useState } from "react";
import ExpiryStrikeFetcher from "./ExpiryStrikeFetcher";
import RecommendationFetcher from "./RecommendationFetcher";

function MainContainer() {
  const [optionData, setOptionData] = useState(null);

  return (
    <main>
      <div class="row py-lg-5">
        <div class="d-flex align-items-center justify-content-center">
          <h1 class="fw-light">Option Strategy Recommender</h1>
        </div>
      </div>
      <div class="album py-5 bg-body-tertiary">
        <div class="container">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div class="col">
              <div class="card shadow-sm">
                <div class="card-body">
                    <ExpiryStrikeFetcher onDataFetched={setOptionData} />
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <div class="card-body">
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
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContainer;