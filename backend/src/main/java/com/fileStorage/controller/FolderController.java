package com.fileStorage.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fileStorage.dto.folder.CreateFolderRequest;
import com.fileStorage.dto.folder.FolderContentsDto;
import com.fileStorage.dto.folder.FolderDto;
import com.fileStorage.service.FolderService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/folders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FolderController {
    
    private final FolderService folderService;
    
    @PostMapping
    public ResponseEntity<FolderDto> createFolder( @RequestBody CreateFolderRequest request, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(folderService.createFolder(userId, request));
    }
    
    @GetMapping("/{folderId}/contents")
    public ResponseEntity<FolderContentsDto> getFolderContents( @PathVariable String folderId, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(folderService.getFolderContents(userId, folderId));
    }
    
    @GetMapping
    public ResponseEntity<List<FolderDto>> getRootFolders(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(folderService.getRootFolders(userId));
    }
}
