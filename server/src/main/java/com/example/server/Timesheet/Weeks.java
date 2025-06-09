package com.example.server.Timesheet;

import java.util.List;

public class Weeks {

    private int weekNo;
    private String weekWorkDescription;
    private int weekTotalWorkedHr;
    private List<Day> daysOfWeek;
	
    public int getWeekNo() {
		return weekNo;
	}
	public void setWeekNo(int weekNo) {
		this.weekNo = weekNo;
	}
	public String getWeekWorkDescription() {
		return weekWorkDescription;
	}
	public void setWeekWorkDescription(String weekWorkDescription) {
		this.weekWorkDescription = weekWorkDescription;
	}
	public int getWeekTotalWorkedHr() {
		return weekTotalWorkedHr;
	}
	public void setWeekTotalWorkedHr(int weekTotalWorkedHr) {
		this.weekTotalWorkedHr = weekTotalWorkedHr;
	}
	public List<Day> getDaysOfWeek() {
		return daysOfWeek;
	}
	public void setDaysOfWeek(List<Day> daysOfWeek) {
		this.daysOfWeek = daysOfWeek;
	}


}
