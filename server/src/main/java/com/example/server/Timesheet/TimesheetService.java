package com.example.server.Timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TimesheetService {

  @Autowired public TimesheetRepo timesheetRepo;

  // 1) Need to write data to database - if already there update?
  // 2) Need to get data based on employeeId, year and date
  // create an object for repository
  public Timesheet getTimeSheet(String employeeId, int year, int month) {

    Timesheet employeeTimesheetOutput =
        timesheetRepo.findByEmployeeIdAndYearAndMonth(employeeId, year, month);
    if (employeeTimesheetOutput != null) {
      return employeeTimesheetOutput;
    } else {
      return null;
    }
  }

  public String updateTimeSheet(Timesheet timeData) {
    System.out.printf("the data before sending the db ", timeData);
    timesheetRepo.save(timeData);
    System.out.println("the data has been saved sucessfully");
    return "Success";
  }

  // public String createTimeSheet(Timesheet timesheet){
  //     timesheetRepo.find
  // }
}
