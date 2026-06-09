package com.example.options.model;
import lombok.Data;

import java.util.List;

@Data
public class RecommendationResponse{

    private List<OptionLeg> legs;
    private double lowestStrike;
    private double highestStrike;
    private String error;
    private boolean fromCache;
    private String cacheNotice;

    public RecommendationResponse(){
    }

    public RecommendationResponse(List<OptionLeg> legs, double lowestStrike, double highestStrike){
        this.legs = legs;
        this.lowestStrike = lowestStrike;
        this.highestStrike = highestStrike;
    }

    public List<OptionLeg> getLegs(){return this.legs;}
    public double getLowestStrike(){return this.lowestStrike;}
    public double getHighestStrike(){return this.highestStrike;}

    public void setLegs(List<OptionLeg> legs){this.legs = legs;}
    public void setLowestStrike(double lowestStrike){this.lowestStrike = lowestStrike;}
    public void setHighestStrike(double highestStrike){this.highestStrike = highestStrike;}

    public String getError() {return this.error;}
    public void setError(String error) {this.error = error;}

    public boolean isFromCache() {return this.fromCache;}
    public void setFromCache(boolean fromCache) {this.fromCache = fromCache;}

    public String getCacheNotice() {return this.cacheNotice;}
    public void setCacheNotice(String cacheNotice) {this.cacheNotice = cacheNotice;}
}