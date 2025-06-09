package com.example.server.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController{

    @Autowired
    private UserService userService;

    @GetMapping("/api/v1/user/auth")
    public ResponseEntity<?> authUser(
        @RequestHeader(value = "username", required = false) String username,
        @RequestHeader(value = "password", required = false) String password) 
    {
        
        User user = userService.isActiveUser(username, password);

        if (user != null) {
            System.out.println("the User data is " + user);
            return ResponseEntity.ok(user);
        } else {
             return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
        }
}
