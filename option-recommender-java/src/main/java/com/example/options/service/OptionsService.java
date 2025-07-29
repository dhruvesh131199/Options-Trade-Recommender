package com.example.options.service;

import com.example.options.client.MarketDataClient;
import com.example.options.model.Option;
import com.example.options.model.OptionLeg;
import com.example.options.model.RecommendationRequest;
import com.example.options.model.RecommendationResponse;
import com.example.options.model.ExpiryStrikeRequest;
import com.example.options.model.ExpiryStrikeResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OptionsService {
    
    @Autowired
    private MarketDataClient marketDataClient;

    public ExpiryStrikeResponse getExpriyStrike(ExpiryStrikeRequest request){
        return marketDataClient.getExpiryStrike(request.getTicker(), request.getStrategy());
    }

    //We fetch OptionLegs without lot modification from market data client class
    //Based on the strategy and risk, we modify option legs, and then pass it to the react
    //On react we do the calculations to show payoff chart and complete details
    public RecommendationResponse getRecommendations(RecommendationRequest request){
        String ticker = request.getTicker();
        String strategy = request.getStrategy();
        String expiry = request.getExpiry();
        double strike = request.getStrike();
        String risk = request.getRisk();

        RecommendationResponse response = marketDataClient.fetchLegs(ticker, strategy, expiry, strike);

        //Modify lot size for ratio call spread strategy with strategy
        if (strategy.equalsIgnoreCase("ratio call spread")){
            response.setLegs(getRatioCallSpread(response.getLegs(), risk));
        }
        return response;
    }

    public List<OptionLeg> getRatioCallSpread(List<OptionLeg> legs, String risk){
        OptionLeg buyLeg = new OptionLeg();
        OptionLeg sellLeg = new OptionLeg();
        for (OptionLeg leg : legs) {
            if (leg.getBuySell().equalsIgnoreCase("sell")){
                sellLeg = leg;
            }else{
                buyLeg = leg;
            }
        }

        double buyPremium = buyLeg.getPremium();
        double sellPremium = sellLeg.getPremium();

        if (buyPremium == 0.0 || sellPremium == 0.0) {
            return Collections.emptyList();
        }

        double sellLotSize = 1;

        if (risk.equalsIgnoreCase("low")){
            double collectingPremium = 1.5 * buyPremium;
            sellLotSize = new BigDecimal(collectingPremium/sellPremium).setScale(1, RoundingMode.HALF_UP).doubleValue();
        } else if (risk.equalsIgnoreCase("medium")) {
            double collectingPremium = 2 * buyPremium;
            sellLotSize = new BigDecimal(collectingPremium/sellPremium).setScale(1, RoundingMode.HALF_UP).doubleValue();
        } else {
            double collectingPremium = 2.5 * buyPremium;
            sellLotSize = new BigDecimal(collectingPremium/sellPremium).setScale(1, RoundingMode.HALF_UP).doubleValue();
        }

        sellLeg.setLots(sellLotSize);
        List<OptionLeg> response = new ArrayList<>();
        response.add(buyLeg);
        response.add(sellLeg);

        return response;
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
            case "covered call": return option.getOptionType().equals("CE");
            case "protective put": return option.getOptionType().equals("PE");
            default: return true;
        }
    }

    public int findRatio(String risk){
        return 1;
    }
}
