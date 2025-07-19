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
              {optionData ? 
              <div class="card shadow-sm">
                <div class="card-body">
                    <RecommendationFetcher {...optionData} />
                </div>
              </div>: null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContainer;