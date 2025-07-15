package com.example.options.model;

public class ExpiryStrikeRequest{

    private String ticker;
    private String strategy;

    public ExpiryStrikeRequest(String ticker, String strategy){
        this.ticker = ticker;
        this.strategy = strategy;
    }

    public String getTicker() {return this.ticker;}
    public String getStrategy() {return this.strategy;}

    public void setTicker(String ticker) {this.ticker = ticker;}
    public void setStrategy(String strategy) {this.strategy = strategy;}
}