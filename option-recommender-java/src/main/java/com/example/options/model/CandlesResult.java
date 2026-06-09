package com.example.options.model;

import java.util.List;

public class CandlesResult {
    private List<CandleResponse> candles;
    private String error;

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
}
