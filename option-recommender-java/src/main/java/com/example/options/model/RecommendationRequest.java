package com.example.options.model;

public class RecommendationRequest{

    private String ticker;
    private String riskLevel;
    private String strategy;

    //constructor
    public RecommendationRequest(String ticker, String riskLevel, String Strategy){
        this.ticker = ticker;
        this.riskLevel = riskLevel;
        this.strategy = strategy;
    }

    //getter
    public String getTicker() {return this.ticker;}
    public String getRiskLevel() {return this.riskLevel;}
    public String getStrategy() {return this.strategy;}

    //setter
    public void setTicker(String ticker) {this.ticker = ticker;}
    public void setRiskLevel(String riskLevel) {this.riskLevel = riskLevel;}
    public void setStrategy(String strategy) {this.strategy = strategy;}
}