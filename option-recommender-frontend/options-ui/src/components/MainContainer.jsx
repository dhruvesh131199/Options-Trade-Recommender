// MainContainer.js
import React, { useState } from "react";
import ExpiryStrikeFetcher from "./ExpiryStrikeFetcher";
import RecommendationFetcher from "./RecommendationFetcher";
import ChartFetcher from "./ChartFetcher";
import { ErrorBoundary } from "./ErrorBoundary";

function MainContainer() {
  const [optionData, setOptionData] = useState(null);

  return (
    <main>
      <div className="d-flex align-items-center justify-content-center">
        <h1 className="fw-light mt-3 mb-3">Option Strategy Recommender</h1>
      </div>
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                    <ExpiryStrikeFetcher onDataFetched={setOptionData} />
                </div>
              </div>
            </div>

            <div className="col">
              {optionData ? 
              <div className="card shadow-sm">
                <div className="card-body">
                    <RecommendationFetcher {...optionData} />
                </div>
              </div>: null}
            </div>
          </div>
        </div>
      </div>

      {/* <ErrorBoundary>
        {optionData ? 
              <ChartFetcher ticker={optionData.ticker} />: null}
      </ErrorBoundary> */}
    </main>
  );
}

export default MainContainer;