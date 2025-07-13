package com.example.options.service;

import com.example.options.client.MarketDataClient;
import com.example.options.model.Option;
import com.example.options.model.RecommendationRequest;
import com.example.options.model.RecommendationResult;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OptionsService {
    
    @Autowired
    private MarketDataClient marketDataClient;

    public List<RecommendationResult> getRecommendations(RecommendationRequest request){
        List<Option> options = marketDataClient.getOptionsForTicker(request.getTicker());

        List<RecommendationResult> recommendations = new ArrayList<>();

        for(Option option: options){
            if (matchesRisk(option, request.getRiskLevel()) && matchesStrategy(option, request.getStrategy())){
                recommendations.add(
                    new RecommendationResult(option, "Matches risk level: "+request.getRiskLevel())
                );
            }
        }

        return recommendations;
    }


    //Filters out options based on risk and roi
    public boolean matchesRisk(Option option, String riskLevel){
        double roi = option.getRoi();

        switch(riskLevel.toLowerCase()){
            case "low": return roi<=0.2;
            case "medium": return roi > 0.2 && roi <=0.5;
            case "high": return roi > 0.5;
            default: return true;
        }
    }

    //Filters out options based on strategy
    public boolean matchesStrategy(Option option, String strategy){

        switch(strategy.toLowerCase()){
            case "covered call": return option.getOptionType() == "CE";
            case "protective put": return option.getOptionType() == "PE";
            default: return true;
        }
    }
}
