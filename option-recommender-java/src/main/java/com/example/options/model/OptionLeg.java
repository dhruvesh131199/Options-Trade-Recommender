package com.example.options.model;
import lombok.Data;

@Data
public class OptionLeg {
    
    private double strike;
    private String buySell;
    private double lots;
    private double premium;

    public OptionLeg() {
    }

    public OptionLeg(double strike, String buySell, double lots, double premium){
        this.strike = strike;
        this.buySell = buySell;
        this.lots = lots;
        this.premium = premium;
    }

    public double getStrike(){return this.strike;}
    public String getBuySell(){return this.buySell;}
    public double getLots(){return this.lots;}
    public double getPremium(){return this.premium;}

    public void setStrike(double strike){this.strike = strike;}
    public void setBuySell(String buySell){this.buySell = buySell;}
    public void setLots(double lots){this.lots = lots;}
    public void setPremium(double premium){this.premium = premium;}
}
