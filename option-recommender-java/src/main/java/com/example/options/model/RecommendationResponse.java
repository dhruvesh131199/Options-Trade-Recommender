package com.example.options.model;
import lombok.Data;

import java.util.List;

@Data
public class RecommendationResponse{

    private List<OptionLeg> legs;
    private double lowestStrike;
    private double highestStrike;

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
}