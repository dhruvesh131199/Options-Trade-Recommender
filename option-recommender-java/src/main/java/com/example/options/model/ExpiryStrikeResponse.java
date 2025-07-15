package com.example.options.model;

import java.util.List;

public class ExpiryStrikeResponse{
    private List<String> expiries;
    private List<Double> strikes;

    //REQUIRED: No-arg constructor for Jackson
    public ExpiryStrikeResponse() {
    }

    public ExpiryStrikeResponse(List<String> expiries, List<Double> strikes){
        this.expiries = expiries;
        this.strikes = strikes;
    }

    public List<String> getExpiries() {return this.expiries;}
    public List<Double> getStrikes() {return this.strikes;}

    public void setExpiries(List<String> expiries){this.expiries = expiries;}
    public void setStrikes(List<Double> strikes) {this.strikes = strikes;}
}