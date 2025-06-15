package com.example.server.Timesheet;

import java.util.Date;

// import java.util.Date;

public class Day {

    private Date date;
    private String day;
    private int timeWorked;
    private String projectId;

	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public int getTimeWorked() {
		return timeWorked;
	}
	public void setTimeWorked(int timeWorked) {
		this.timeWorked = timeWorked;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
}
