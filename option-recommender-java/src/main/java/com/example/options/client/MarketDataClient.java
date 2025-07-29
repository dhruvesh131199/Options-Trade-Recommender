package com.example.options.client;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.example.options.model.CandleResponse;
import com.example.options.model.ExpiryStrikeResponse;
import com.example.options.model.Option;
import com.example.options.model.RecommendationResponse;

@Component
public class MarketDataClient{

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${python_api_url}")
    private String python_api_url;

    public List<Option> getOptionsForTicker(String ticker){
        String url = python_api_url + "options/" + ticker.toUpperCase();

        ResponseEntity<Option[]> response = restTemplate.getForEntity(url, Option[].class);
        return Arrays.asList(response.getBody());
    }

    public ExpiryStrikeResponse getExpiryStrike(String ticker, String strategy){
        String url = python_api_url +"expiry_and_strikes/"+ticker.toUpperCase() + "/" +strategy.toLowerCase();

        ResponseEntity<ExpiryStrikeResponse> response = restTemplate.getForEntity(url, ExpiryStrikeResponse.class);
        return response.getBody();
    }

    public List<CandleResponse> getCandles(String ticker){
        String url = python_api_url + "candles/" + ticker.toUpperCase();
        
        ResponseEntity<CandleResponse[]> response = restTemplate.getForEntity(url, CandleResponse[].class);
        return Arrays.asList(response.getBody());
    }

    public RecommendationResponse fetchLegs(String ticker, String strategy, String expiry, double strike){

        if (strategy.equalsIgnoreCase("ratio call spread")){
            String url = python_api_url + "ratiocallspread/" + ticker.toUpperCase() + "/" + expiry + "/" + strike;
            try {
                ResponseEntity<RecommendationResponse> response = restTemplate.getForEntity(url, RecommendationResponse.class);
                return response.getBody();
            } catch (Exception e) {
                System.err.println("Error calling: " + url);
                e.printStackTrace(); // or use logger if you have one
                return null;
            }
        }
        
        return null;
    }

    public void testfetch(String ticker, String strategy){
        String url = python_api_url + ticker.toUpperCase() + "/" + strategy.toLowerCase();

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println("RAW JSON = " + response.getBody());
    }

}