package com.fileStorage.dto.auth;

import lombok.Data;

@Data
public class LoginRequestDto {
    String username;
    String password;
    public String toString(){
        return username + " " + password;
    }
}
