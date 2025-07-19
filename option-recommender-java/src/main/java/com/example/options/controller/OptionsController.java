package com.example.options.controller;

import com.example.options.service.*;
import com.example.options.model.*;
import com.example.options.client.MarketDataClient;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@CrossOrigin(origins = "https://option-recommender-frontend-92837797412.europe-west1.run.app")

public class OptionsController {

    @Autowired
    private OptionsService optionsService;

    @Autowired
    private MarketDataClient mdc;

    @PostMapping("/recommend")
    public List<RecommendationResult> recommend(@RequestBody RecommendationRequest request) {       
        return optionsService.getRecommendations(request);
    }

    @PostMapping("/expiries_and_strikes")
    public ExpiryStrikeResponse recommend(@RequestBody ExpiryStrikeRequest request) {       
        return optionsService.getExpriyStrike(request);
    }

    @GetMapping("/testfetch")
    public void testfetch() {       
        mdc.testfetch("GOOG", "covered call");
    }
    

    @GetMapping("/hello")
    public String hello() {
        return "Options Recommender API is running!";
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to the Options Recommender API!";
    }

    @PostMapping("/candles")
    public List<CandleResponse> candles(@RequestBody String ticker){
        return mdc.getCandles(ticker);
    }

}
