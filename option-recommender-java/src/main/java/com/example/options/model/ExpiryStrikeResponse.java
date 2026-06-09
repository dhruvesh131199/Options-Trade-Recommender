package com.example.options.model;

import java.util.List;

public class ExpiryStrikeResponse{
    private List<String> expiries;
    private List<String> strikes;
    private List<String> weeklyVol;
    private String error;
    private boolean fromCache;
    private String cacheNotice;

    //REQUIRED: No-arg constructor for Jackson
    public ExpiryStrikeResponse() {
    }

    public ExpiryStrikeResponse(List<String> expiries, List<String> strikes, List<String> weeklyVol){
        this.expiries = expiries;
        this.strikes = strikes;
        this.weeklyVol = weeklyVol;
    }

    public List<String> getExpiries() {return this.expiries;}
    public List<String> getStrikes() {return this.strikes;}
    public List<String> getWeeklyVol() {return this.weeklyVol;}

    public void setExpiries(List<String> expiries){this.expiries = expiries;}
    public void setStrikes(List<String> strikes) {this.strikes = strikes;}
    public void setWeeklyVol(List<String> weeklyVol){this.weeklyVol = weeklyVol;}

    public String getError() {return this.error;}
    public void setError(String error) {this.error = error;}

    public boolean isFromCache() {return this.fromCache;}
    public void setFromCache(boolean fromCache) {this.fromCache = fromCache;}

    public String getCacheNotice() {return this.cacheNotice;}
    public void setCacheNotice(String cacheNotice) {this.cacheNotice = cacheNotice;}
}