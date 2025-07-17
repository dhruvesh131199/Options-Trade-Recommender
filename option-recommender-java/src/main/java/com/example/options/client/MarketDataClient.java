package com.example.options.client;

import com.example.options.model.Option;
import com.example.options.model.ExpiryStrikeResponse;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

@Component
public class MarketDataClient{

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Option> getOptionsForTicker(String ticker){
        String url = "http://python-api:8000/options/" + ticker.toUpperCase();

        ResponseEntity<Option[]> response = restTemplate.getForEntity(url, Option[].class);
        return Arrays.asList(response.getBody());
    }

    public ExpiryStrikeResponse getExpiryStrike(String ticker, String strategy){
        String url = "http://python-api:8000/options/" + ticker.toUpperCase() + "/" +strategy.toLowerCase();

        ResponseEntity<ExpiryStrikeResponse> response = restTemplate.getForEntity(url, ExpiryStrikeResponse.class);
        return response.getBody();
    }

    public void testfetch(String ticker, String strategy){
        String url = "http://python-api:8000/options/" + ticker.toUpperCase() + "/" + strategy.toLowerCase();

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println("RAW JSON = " + response.getBody());
    }

}