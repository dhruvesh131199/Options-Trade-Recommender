package com.example.options.model;

public class Option{

    private String ticker;
    private String optionType;
    private double strikePrice;
    private String expiryDate;
    private int DTE;
    private double premium;
    private double roi;

    //constructor
    public Option(String ticker, String optionType, double strikePrice, String expiryDate, int DTE, double premium, double roi){
        this.ticker = ticker;
        this.optionType = optionType;
        this.strikePrice = strikePrice;
        this.expiryDate = expiryDate;
        this.DTE = DTE;
        this.premium = premium;
        this.roi = roi;
    }

    //getters
    public String getTicker() {return this.ticker;}
    public String getOptionType() {return this.optionType;}
    public double getStrikePrice() {return this.strikePrice;}
    public String getExpiryDate() {return this.expiryDate;}
    public int getDTE() {return this.DTE;}
    public double getPremium() {return this.premium;}
    public double getRoi() {return this.roi;}

    //setters
    public void setTicker(String ticker) {this.ticker = ticker;}
    public void setOptionType(String optionType) {this.optionType = optionType;}
    public void setStrikePrice(double strikePrice) {this.strikePrice = strikePrice;}
    public void setExpiryDate(String expiryDate) {this.expiryDate = expiryDate;}
    public void setDTE(int DTE) {this.DTE = DTE;}
    public void setPremium(double premium) {this.premium = premium;}
    public void setRoi(double roi) {this.roi = roi;}

}
