package com.example.server.Timesheet;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @CrossOrigin(origins = "http://localhost:3000")
class TimesheetController{

    @GetMapping("api/v1/timesheet/{id}")
    public ResponseEntity<Void> getTimeSheet(@PathVariable int id){
        System.out.println("get method called" + id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    
    @PostMapping("api/v1/timesheet/{id}")
    void postTimeSheet(@PathVariable int id){
       
        System.out.println("post method called" + id);
    }
}
