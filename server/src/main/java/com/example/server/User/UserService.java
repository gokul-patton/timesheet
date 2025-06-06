package com.example.server.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService{
    
    @Autowired
    private UserRepo userRepo;

    public User isActiveUser(String username, String password){

        User currentUserData = userRepo.findByEmail(username);
        if(currentUserData != null && currentUserData.getPassword().equals(password)){
            return currentUserData;
        } else{
            return null;
        }
    }

}
