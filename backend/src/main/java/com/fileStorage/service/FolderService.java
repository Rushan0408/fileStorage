package com.fileStorage.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.fileStorage.dto.file.FileDto;
import com.fileStorage.dto.folder.CreateFolderRequest;
import com.fileStorage.dto.folder.FolderContentsDto;
import com.fileStorage.dto.folder.FolderDto;
import com.fileStorage.model.Folder;
import com.fileStorage.repository.FolderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    
    private final FolderRepository folderRepository;
    private final FileService fileService;
    
    public FolderDto createFolder(String userId, CreateFolderRequest request) {
        String path = "/";
        
        if (request.getParentFolderId() != null) {
            Folder parent = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            
            if (!parent.getOwnerId().equals(userId)) {
                throw new RuntimeException("Unauthorized");
            }
            
            path = parent.getPath() + "/" + request.getName();
        } else {
            path = "/" + request.getName();
        }
        
        Folder folder = new Folder();
        folder.setName(request.getName());
        folder.setOwnerId(userId);
        folder.setParentFolderId(request.getParentFolderId());
        folder.setPath(path);
        folder.setCreatedAt(LocalDateTime.now());
        folder.setUpdatedAt(LocalDateTime.now());
        
        folder = folderRepository.save(folder);
        
        return toDto(folder);
    }
    
    public FolderContentsDto getFolderContents(String userId, String folderId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        if (!folder.getOwnerId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        List<Folder> subfolders = folderRepository.findByOwnerIdAndParentFolderId(userId, folderId);
        List<FileDto> files = fileService.getFilesByFolder(userId, folderId);
        
        FolderContentsDto contents = new FolderContentsDto();
        contents.setFolderId(folderId);
        contents.setPath(folder.getPath());
        contents.setFolders(subfolders.stream().map(this::toDto).collect(Collectors.toList()));
        contents.setFiles(files);
        
        return contents;
    }
    
    public List<FolderDto> getRootFolders(String userId) {
        return folderRepository.findByOwnerIdAndParentFolderIdIsNull(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    private FolderDto toDto(Folder folder) {
        FolderDto dto = new FolderDto();
        dto.setId(folder.getId());
        dto.setName(folder.getName());
        dto.setPath(folder.getPath());
        dto.setCreatedAt(folder.getCreatedAt());
        return dto;
    }
}
