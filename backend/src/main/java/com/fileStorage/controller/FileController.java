package com.fileStorage.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fileStorage.dto.file.DownloadResponse;
import com.fileStorage.dto.file.FileDto;
import com.fileStorage.dto.file.FileUploadRequest;
import com.fileStorage.dto.file.UploadResponse;
import com.fileStorage.service.FileService;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {
    
    private final FileService fileService;
    
    @PostMapping("/initiate-upload")
    public ResponseEntity<UploadResponse> initiateUpload( @RequestBody FileUploadRequest request, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(fileService.initiateUpload(userId, request));
    }
    
    @PostMapping("/{fileId}/complete")
    public ResponseEntity<FileDto> completeUpload( @PathVariable String fileId, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(fileService.completeUpload(userId, fileId));
    }
    
    @GetMapping("/{fileId}/download")
    public ResponseEntity<DownloadResponse> getDownloadUrl(
            @PathVariable String fileId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(fileService.getDownloadUrl(userId, fileId));
    }
    
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String fileId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        fileService.deleteFile(userId, fileId);
        return ResponseEntity.noContent().build();
    }
}
