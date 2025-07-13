package com.example.options.client;

import com.example.options.model.Option;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class MarketDataClient{

    public List<Option> getOptionsForTicker(String ticker){
        return Arrays.asList(
            new Option(ticker, "CE", 100, "2000-01-01", 7, 0.50, 0.2),
            new Option(ticker, "PE", 102, "2000-01-01", 10,0.40, 0.4),
            new Option(ticker, "CE", 104, "2000-01-01", 10, 0.30, 0.3)
        );
    }

}