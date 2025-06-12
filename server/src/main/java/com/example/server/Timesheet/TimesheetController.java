package com.example.server.Timesheet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
class TimesheetController{

    @Autowired
    public TimesheetService timesheetService;

    @GetMapping("api/v1/timesheet/{employeeId}")
    public ResponseEntity<?> getTimeSheet(
        @PathVariable String employeeId,
        @RequestParam int year,
        @RequestParam int month
    ){
        System.out.println("calling time sheet service");
        Timesheet empTimesheet = timesheetService.getTimeSheet(employeeId, year, month);
        if (empTimesheet == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(empTimesheet);
    }
    
    @PostMapping("api/v1/timesheet/{employeeId}")
    void postTimeSheet(
        @PathVariable String employeeId,
        @RequestParam int year,
        @RequestParam int month,
        @RequestBody Timesheet data
    ){  
        // timesheetService.updateTimeSheet(employeeId); 
        System.out.println("post method called " + data);
    }
}
