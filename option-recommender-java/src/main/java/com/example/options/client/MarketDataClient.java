package com.example.options.client;

import com.example.options.model.Option;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

@Component
public class MarketDataClient{

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Option> getOptionsForTicker(String ticker){
        String url = "http://localhost:8000/options/" + ticker.toUpperCase();

        ResponseEntity<Option[]> response = restTemplate.getForEntity(url, Option[].class);
        return Arrays.asList(response.getBody());
        
    }

}