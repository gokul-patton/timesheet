package com.example.server.userAuth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @CrossOrigin(origins = "http://localhost:3000")
public class userAuthController{

    @GetMapping("/api/v1/userauth")
    public ResponseEntity<String> authUser(
        @RequestHeader(value = "username", required = false) String username,
        @RequestHeader(value = "password", required = false) String password) 
    {
       // Null check for missing headers
        if (username == null || password == null) {
            System.out.println("missing user name");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Missing username or password header");
        }

        // Static validation
        if ("employee1".equals(username) && "pass123".equals(password)) {
            System.out.println("success");
            return ResponseEntity.ok("Authentication successful");
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }    }

}
