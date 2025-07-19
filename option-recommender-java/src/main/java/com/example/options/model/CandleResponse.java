package com.example.options.model;

public class CandleResponse {
    private long time;
    private double open;
    private double high;
    private double low;
    private double close;

    //REQUIRED: No-arg constructor for Jackson
    public CandleResponse() {
    }

    public CandleResponse(long time, double open, double high, double low, double close){
        this.time = time;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
    }

    public long getTime(){return this.time;}
    public double getOpen(){return this.open;}
    public double getHigh(){return this.high;}
    public double getLow(){return this.low;}
    public double getClose(){return this.close;}

    public void setTime(long time){this.time = time;}
    public void setOpen(double open){this.open = open;}
    public void setHigh(double high){this.high = high;}
    public void setLow(double low){this.low = low;}
    public void setClose(double close){this.close = close;}
}
