package com.fileStorage.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fileStorage.dto.storage.StorageStatsDto;
import com.fileStorage.model.User;
import com.fileStorage.service.StorageService;

@Slf4j
@RestController
@RequestMapping("/api/v1/storage")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StorageController {
    
    private final StorageService storageService;
    
    @GetMapping("/stats")
    public ResponseEntity<StorageStatsDto> getStorageStats(Authentication auth) {
        log.info("Getting storage stats");
        User user = (User) auth.getPrincipal();
        String userId = user.getId();        
        StorageStatsDto stats = storageService.getStorageStats(userId);
        
        log.info("Returning stats: {}", stats);
        return ResponseEntity.ok(stats);
    }
}