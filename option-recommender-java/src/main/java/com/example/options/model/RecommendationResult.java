package com.example.options.model;

public class RecommendationResult{

    private Option option;
    private String reason;

    //constructor
    public RecommendationResult(Option option, String reason){
        this.option = option;
        this.reason = reason;
    }

    //getters
    public Option getOption() {return this.option;}
    public String getString() {return this.reason;}

    //setters
    public void setOption(Option option) {this.option = option;}
    public void setReason(String reason) {this.reason = reason;}
}