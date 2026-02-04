package com.fileStorage.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SignupResponseDto {
    private String id;
    private String username;
    public SignupResponseDto(String id,String username) {
        this.id = id;
        this.username = username;
    }
}
