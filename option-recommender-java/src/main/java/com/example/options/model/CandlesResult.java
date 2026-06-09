package com.example.options.model;

import java.util.List;

public class CandlesResult {
    private List<CandleResponse> candles;
    private String error;
    private boolean fromCache;
    private String cacheNotice;

    public CandlesResult() {
    }

    public List<CandleResponse> getCandles() {
        return candles;
    }

    public void setCandles(List<CandleResponse> candles) {
        this.candles = candles;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public boolean isFromCache() {
        return fromCache;
    }

    public void setFromCache(boolean fromCache) {
        this.fromCache = fromCache;
    }

    public String getCacheNotice() {
        return cacheNotice;
    }

    public void setCacheNotice(String cacheNotice) {
        this.cacheNotice = cacheNotice;
    }
}
