package com.fileStorage.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fileStorage.dto.auth.LoginRequestDto;
import com.fileStorage.dto.auth.LoginResponseDto;
import com.fileStorage.dto.auth.SignupResponseDto;
import com.fileStorage.model.User;
import com.fileStorage.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDto login ( LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword()));
        User user = (User)authentication.getPrincipal();
        String token = authUtil.generateAccessToken(user);
        return new LoginResponseDto(token, user.getUsername());
    }

    public SignupResponseDto signup ( LoginRequestDto signupResponseDto ) {
        User user = userRepository.findByUsername(signupResponseDto.getUsername()).orElse(null);

        if ( user != null ) throw new IllegalArgumentException("Player Already Exists");

        user = userRepository.save(User.builder().username(signupResponseDto.getUsername()).password(passwordEncoder.encode(signupResponseDto.getPassword())).build());

        return new SignupResponseDto(user.getId(),user.getPassword());
    }
}
