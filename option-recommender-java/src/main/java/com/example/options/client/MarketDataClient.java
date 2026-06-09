package com.example.options.client;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.example.options.model.CandleResponse;
import com.example.options.model.CandlesResult;
import com.example.options.model.ExpiryStrikeResponse;
import com.example.options.model.Option;
import com.example.options.model.RecommendationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MarketDataClient{

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${python_api_url}")
    private String python_api_url;

    private boolean hasError(JsonNode node) {
        return node != null && node.isObject() && node.has("error") && !node.get("error").isNull();
    }

    private String readError(JsonNode node) {
        return node.get("error").asText();
    }

    public List<Option> getOptionsForTicker(String ticker){
        String url = python_api_url + "options/" + ticker.toUpperCase();

        try {
            JsonNode node = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            if (hasError(node)) {
                return Collections.emptyList();
            }
            Option[] options = objectMapper.treeToValue(node, Option[].class);
            return Arrays.asList(options);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public ExpiryStrikeResponse getExpiryStrike(String ticker, String strategy){
        String url = python_api_url +"expiry_and_strikes/"+ticker.toUpperCase() + "/" +strategy.toLowerCase();

        try {
            JsonNode node = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            if (hasError(node)) {
                ExpiryStrikeResponse response = new ExpiryStrikeResponse();
                response.setError(readError(node));
                return response;
            }
            return objectMapper.treeToValue(node, ExpiryStrikeResponse.class);
        } catch (Exception e) {
            ExpiryStrikeResponse response = new ExpiryStrikeResponse();
            response.setError(e.getMessage());
            return response;
        }
    }

    public CandlesResult getCandles(String ticker){
        String url = python_api_url + "candles/" + ticker.toUpperCase();
        CandlesResult result = new CandlesResult();

        try {
            JsonNode node = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            if (hasError(node)) {
                result.setError(readError(node));
                return result;
            }
            if (node.isObject() && node.has("candles")) {
                CandleResponse[] candles = objectMapper.treeToValue(node.get("candles"), CandleResponse[].class);
                result.setCandles(Arrays.asList(candles));
                if (node.has("fromCache")) {
                    result.setFromCache(node.get("fromCache").asBoolean());
                }
                if (node.has("cacheNotice")) {
                    result.setCacheNotice(node.get("cacheNotice").asText());
                }
                return result;
            }
            CandleResponse[] candles = objectMapper.treeToValue(node, CandleResponse[].class);
            result.setCandles(Arrays.asList(candles));
            return result;
        } catch (Exception e) {
            result.setError(e.getMessage());
            return result;
        }
    }

    public RecommendationResponse fetchLegs(String ticker, String strategy, String expiry, double strike){

        if (strategy.equalsIgnoreCase("ratio call spread")){
            String url = python_api_url + "ratiocallspread/" + ticker.toUpperCase() + "/" + expiry + "/" + strike;
            try {
                JsonNode node = objectMapper.readTree(restTemplate.getForObject(url, String.class));
                if (hasError(node)) {
                    RecommendationResponse response = new RecommendationResponse();
                    response.setError(readError(node));
                    return response;
                }
                return objectMapper.treeToValue(node, RecommendationResponse.class);
            } catch (Exception e) {
                System.err.println("Error calling: " + url);
                e.printStackTrace();
                RecommendationResponse response = new RecommendationResponse();
                response.setError(e.getMessage());
                return response;
            }
        }
        
        return null;
    }

    public void testfetch(String ticker, String strategy){
        String url = python_api_url + ticker.toUpperCase() + "/" + strategy.toLowerCase();

        String response = restTemplate.getForObject(url, String.class);
        System.out.println("RAW JSON = " + response);
    }

}
