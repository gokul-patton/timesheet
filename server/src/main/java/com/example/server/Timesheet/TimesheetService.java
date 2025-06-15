package com.example.server.Timesheet;

import java.util.Date;

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
    // System.out.printf("the data before sending the db ", timeData);
    // timesheetRepo.save(timeData);
    // System.out.println("the data has been saved sucessfully");
    // return "Success";


    System.out.println("Received timesheet data: " + timeData);
    
    if (timesheetRepo.existsByEmployeeIdAndYearAndMonth(timeData.getEmployeeId(), timeData.getYear(), timeData.getMonth())) {
        // Update existing document
        System.out.println("Updating existing timesheet with ID: " + timeData.getId());
        Timesheet existingTimesheet = timesheetRepo.findByEmployeeIdAndYearAndMonth(timeData.getEmployeeId(), timeData.getYear(), timeData.getMonth());
        
        // Update only the fields you want to change
        existingTimesheet.setEmployeeId(timeData.getEmployeeId());
        existingTimesheet.setYear(timeData.getYear());
        existingTimesheet.setMonth(timeData.getMonth());
        existingTimesheet.setWeeks(timeData.getWeeks());
        existingTimesheet.setUpdated_at(new Date());
        existingTimesheet.setCanEdit(timeData.isCanEdit());
        
        timesheetRepo.save(existingTimesheet);
        System.out.println("Timesheet updated successfully");
    } else {
        // Create new document
        System.out.println("Creating new timesheet");
        timeData.setId(null); // Ensure MongoDB generates new ID
        timeData.setCreated_at(new Date());
        timeData.setUpdated_at(new Date());
        timesheetRepo.save(timeData);
        System.out.println("New timesheet created successfully");
    }
    
    return "Success";
  }

 }
