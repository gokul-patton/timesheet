package com.example.server.Timesheet;

import java.util.Date;
// import java.time.LocalDate;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "timesheet")
public class Timesheet {

  @Id private String id;
  private String employeeId;
  private int year;
  private int month;
  private List<Weeks> weeks;
  private Date created_at;
  private Date updated_at;
  private boolean canEdit;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getEmployeeId() {
    return employeeId;
  }

  public void setEmployeeId(String employeeId) {
    this.employeeId = employeeId;
  }

  public int getYear() {
    return year;
  }

  public void setYear(int year) {
    this.year = year;
  }

  public int getMonth() {
    return month;
  }

  public void setMonth(int month) {
    this.month = month;
  }

  public List<Weeks> getWeeks() {
    return weeks;
  }

  public void setWeeks(List<Weeks> weeks) {
    this.weeks = weeks;
  }

  public Date getCreated_at() {
    return created_at;
  }

  public void setCreated_at(Date created_at) {
    this.created_at = created_at;
  }

  public Date getUpdated_at() {
    return updated_at;
  }

  public void setUpdated_at(Date updated_at) {
    this.updated_at = updated_at;
  }

  public boolean isCanEdit() {
    return canEdit;
  }

  public void setCanEdit(boolean canEdit) {
    this.canEdit = canEdit;
  }

  @Override
  public String toString() {
    return "User{id=" + id + ", year='" + year + "', month='" + month + "'}";
  }
}
