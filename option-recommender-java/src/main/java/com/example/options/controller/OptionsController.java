package com.example.options.controller;

import com.example.options.service.*;
import com.example.options.model.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class OptionsController {

    @Autowired
    private OptionsService optionsService;

    @PostMapping("/recommend")
    public List<RecommendationResult> recommend(@RequestBody RecommendationRequest request) {       
        return optionsService.getRecommendations(request);
    }
    

    @GetMapping("/hello")
    public String hello() {
        return "Options Recommender API is running!";
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to the Options Recommender API!";
    }

}
