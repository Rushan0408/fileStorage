package com.fileStorage.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fileStorage.dto.file.DownloadResponse;
import com.fileStorage.dto.file.FileDto;
import com.fileStorage.dto.file.FileUploadRequest;
import com.fileStorage.dto.file.UploadResponse;
import com.fileStorage.model.User;
import com.fileStorage.service.FileService;

@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileController {
    
    private final FileService fileService;
    
    @PostMapping("/initiate-upload")
    public ResponseEntity<UploadResponse> initiateUpload( @RequestBody FileUploadRequest request, Authentication auth) {
        log.info("CAME HERE");  
        User user = (User) auth.getPrincipal();
        String userId = user.getId();
        return ResponseEntity.ok(fileService.initiateUpload(userId, request));
    }
    
    @PostMapping("/{fileId}/complete")
    public ResponseEntity<FileDto> completeUpload( @PathVariable String fileId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        String userId = user.getId();
        return ResponseEntity.ok(fileService.completeUpload(userId, fileId));
    }
    
    @GetMapping("/{fileId}/download")
    public ResponseEntity<DownloadResponse> getDownloadUrl( @PathVariable String fileId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        String userId = user.getId();
        return ResponseEntity.ok(fileService.getDownloadUrl(userId, fileId));
    }
    
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile( @PathVariable String fileId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        String userId = user.getId();
        fileService.deleteFile(userId, fileId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/root")
    public ResponseEntity<List<FileDto>> getRootFiles(Authentication auth) {
        log.info("Getting root files");
        User user = (User) auth.getPrincipal();
        String userId = user.getId();
        List<FileDto> files = fileService.getRootFiles(userId);
        return ResponseEntity.ok(files);
    }
}
