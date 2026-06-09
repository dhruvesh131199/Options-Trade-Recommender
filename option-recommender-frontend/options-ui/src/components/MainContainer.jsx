// MainContainer.js
import React, { useState, useRef, useCallback } from "react";
import ExpiryStrikeFetcher from "./ExpiryStrikeFetcher";
import RecommendationFetcher from "./RecommendationFetcher";
import ChartFetcher from "./ChartFetcher";
import Recommendation from "./Recommendation";
import OptionPayoffChart from "./OptionPayoffChart";
import LoadingCard from "./LoadingCard";
//import { ErrorBoundary } from "./ErrorBoundary";

function MainContainer() {
  const [optionData, setOptionData] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [isFetchingExpiries, setIsFetchingExpiries] = useState(false);
  const [fetchFlowActive, setFetchFlowActive] = useState(false);
  const [recommendFlowActive, setRecommendFlowActive] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);
  const recommendCardsReady = useRef({ legs: false, payoff: false });

  const isBusy = fetchFlowActive || recommendFlowActive;

  const handleFetchStart = useCallback(() => {
    setFetchFlowActive(true);
    setIsFetchingExpiries(true);
  }, []);

  const handleFetchComplete = useCallback((success) => {
    setIsFetchingExpiries(false);
    if (!success) {
      setFetchFlowActive(false);
    }
  }, []);

  const handleChartLoadingChange = useCallback((loading) => {
    if (!loading) {
      setFetchFlowActive(false);
    }
  }, []);

  const handleDataFetched = useCallback((data) => {
    setOptionData(data);
    setFetchKey((key) => key + 1);
  }, []);

  const handleRecommendFetched = useCallback((data) => {
    recommendCardsReady.current = { legs: false, payoff: false };
    setRecommendationData(data);
  }, []);

  const handleSubmitStart = useCallback(() => {
    setRecommendFlowActive(true);
  }, []);

  const handleSubmitComplete = useCallback((success) => {
    if (!success) {
      setRecommendFlowActive(false);
    }
  }, []);

  const handleLegsCardReady = useCallback(() => {
    recommendCardsReady.current.legs = true;
    if (recommendCardsReady.current.payoff) {
      setRecommendFlowActive(false);
    }
  }, []);

  const handlePayoffCardReady = useCallback(() => {
    recommendCardsReady.current.payoff = true;
    if (recommendCardsReady.current.legs) {
      setRecommendFlowActive(false);
    }
  }, []);


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
                    <ExpiryStrikeFetcher
                      onDataFetched={handleDataFetched}
                      onResetRecommendation={() => setRecommendationData(null)}
                      onFetchStart={handleFetchStart}
                      onFetchComplete={handleFetchComplete}
                      actionsDisabled={isBusy}
                    />
                </div>
              </div>
            </div>

            <div className="col">
              {isFetchingExpiries ? (
                <LoadingCard
                  title="Candlestick Chart"
                  message="Fetching market data. This can take up to a minute on first load."
                />
              ) : optionData ? (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <ChartFetcher
                      key={fetchKey}
                      ticker={optionData.ticker}
                      onLoadingChange={handleChartLoadingChange}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="col">
              {isFetchingExpiries ? (
                <LoadingCard
                  title="Choose Expiry & Strike"
                  message="Loading expiries and strikes..."
                />
              ) : optionData ? (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <RecommendationFetcher
                      {...optionData}
                      onRecommendFetched={handleRecommendFetched}
                      onSubmitStart={handleSubmitStart}
                      onSubmitComplete={handleSubmitComplete}
                      actionsDisabled={isBusy}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3 mt-1">
            <div className="col">
              {recommendationData ? 
              <div className="card shadow-sm">
                <div className="card-body">
                    <Recommendation {...recommendationData} onLoaded={handleLegsCardReady} />
                </div>
              </div>: null}
            </div>

            <div className="col">
              {recommendationData ? 
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">Payoff chart</h4>
                    <OptionPayoffChart {...recommendationData} onLoaded={handlePayoffCardReady} />
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