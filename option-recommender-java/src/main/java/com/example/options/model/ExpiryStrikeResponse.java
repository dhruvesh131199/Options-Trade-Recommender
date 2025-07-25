package com.example.options.model;

import java.util.List;

public class ExpiryStrikeResponse{
    private List<String> expiries;
    private List<Double> strikes;
    private List<String> weeklyVol;

    //REQUIRED: No-arg constructor for Jackson
    public ExpiryStrikeResponse() {
    }

    public ExpiryStrikeResponse(List<String> expiries, List<Double> strikes, List<String> weeklyVol){
        this.expiries = expiries;
        this.strikes = strikes;
        this.weeklyVol = weeklyVol;
    }

    public List<String> getExpiries() {return this.expiries;}
    public List<Double> getStrikes() {return this.strikes;}
    public List<String> getWeeklyVol() {return this.weeklyVol;}

    public void setExpiries(List<String> expiries){this.expiries = expiries;}
    public void setStrikes(List<Double> strikes) {this.strikes = strikes;}
    public void setWeeklyVol(List<String> weeklyVol){this.weeklyVol = weeklyVol;}
}