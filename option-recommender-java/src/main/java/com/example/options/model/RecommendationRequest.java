package com.example.options.model;

public class RecommendationRequest{

    private String ticker;
    private String strategy;
    private String expiry;
    private String strikeWithHowFar;
    private double strike;
    private String risk;

    //REQUIRED: No-arg constructor for Jackson
    public RecommendationRequest() {
    }

    //constructor
    public RecommendationRequest(String ticker, String strategy, String expiry, String strikeWithHowFar, String risk ){
        this.ticker = ticker;
        this.strategy = strategy;
        this.expiry = expiry;
        this.strikeWithHowFar = strikeWithHowFar;
        this.risk = risk;

        String[] parts = this.strikeWithHowFar.split(" ");
        this.strike = Double.parseDouble(parts[0]);
    }

    //getter
    public String getTicker() {return this.ticker;}
    public String getStrategy() {return this.strategy;}
    public String getExpiry() {return this.expiry;}
    public String getStrikeWithHowFar() {return this.strikeWithHowFar;}
    public double getStrike() {return this.strike;}
    public String getRisk() {return this.risk;}
    

    //setter
    public void setTicker(String ticker) {this.ticker = ticker;}
    public void setStrategy(String strategy) {this.strategy = strategy;}
    public void setExpiry(String expiry) {this.expiry = expiry;}

    public void setStrikeWithHowFar(String strikeWithHowFar) {
        this.strikeWithHowFar = strikeWithHowFar;

        // Parse the strike from the string
        if (strikeWithHowFar != null && !strikeWithHowFar.isEmpty()) {
            String[] parts = strikeWithHowFar.split(" ");
            this.strike = Double.parseDouble(parts[0]);
        }
    }
    
    public void setStrike(double strike) {this.strike = strike;}
    public void setRisk(String risk) {this.risk = risk;}

    @Override
    public String toString() {
        return "RecommendationRequest {" +
                "ticker='" + ticker + '\'' +
                ", strategy='" + strategy + '\'' +
                ", expiry='" + expiry + '\'' +
                ", strikeWithHowFar='" + strikeWithHowFar + '\'' +
                ", strike=" + strike +
                ", risk='" + risk + '\'' +
                '}';
    }
}