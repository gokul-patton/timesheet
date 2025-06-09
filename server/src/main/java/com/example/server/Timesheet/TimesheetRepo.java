 package com.example.server.Timesheet;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TimesheetRepo extends MongoRepository<Timesheet, String>{
     Timesheet findByEmployeeIdAndYearAndMonth(String employeeId, int year, int month);    
 }
