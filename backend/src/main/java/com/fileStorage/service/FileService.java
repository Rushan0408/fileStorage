package com.fileStorage.service;



import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import com.fileStorage.dto.file.DownloadResponse;
import com.fileStorage.dto.file.FileDto;
import com.fileStorage.dto.file.FileUploadRequest;
import com.fileStorage.dto.file.UploadResponse;
import com.fileStorage.model.File;
import com.fileStorage.model.User;
import com.fileStorage.repository.FileRepository;
import com.fileStorage.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {
    
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    
    public UploadResponse initiateUpload(String userId, FileUploadRequest request) {
        // Check storage quota
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        if (user.getStorageUsed() + request.getSize() > user.getStorageQuota()) {
            throw new RuntimeException("Storage quota exceeded");
        }
        
        // Generate S3 upload URL
        String uploadUrl = s3Service.generateUploadUrl(userId, request.getName(), request.getMimeType());
        String s3Key = extractS3KeyFromUrl(uploadUrl);
        
        // Create file record
        File file = new File();
        file.setName(request.getName());
        file.setSize(request.getSize());
        file.setMimeType(request.getMimeType());
        file.setOwnerId(userId);
        file.setFolderId(request.getFolderId());
        file.setS3Key(s3Key);
        file.setS3Bucket(s3Service.bucketName);
        file.setUploadStatus("pending");
        file.setCreatedAt(LocalDateTime.now());
        file.setUpdatedAt(LocalDateTime.now());
        
        file = fileRepository.save(file);

        System.out.println("\n\n" + file + "\n\n");
        
        // Return response
        UploadResponse response = new UploadResponse();
        response.setFileId(file.getId());
        response.setUploadUrl(uploadUrl);
        response.setExpiresAt(LocalDateTime.now().plusHours(1));
        
        return response;
    }
    
    public FileDto completeUpload(String userId, String fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Verify file exists in S3
        log.info("file's s3 key : " + file.getS3Key());
        
        if (!s3Service.fileExists(file.getS3Key())) {
            file.setUploadStatus("failed");
            fileRepository.save(file);
            throw new RuntimeException("File upload failed");
        }
        
        // Update file status
        file.setUploadStatus("complete");
        file.setUpdatedAt(LocalDateTime.now());
        file = fileRepository.save(file);
        
        // Update user storage
        User user = userRepository.findById(userId).orElseThrow();
        user.setStorageUsed(user.getStorageUsed() + file.getSize());
        userRepository.save(user);
        
        return toDto(file);
    }
    
    public DownloadResponse getDownloadUrl(String userId, String fileId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (!"complete".equals(file.getUploadStatus())) {
            throw new RuntimeException("File not ready for download");
        }
        
        String downloadUrl = s3Service.generateDownloadUrl(file.getS3Key(), file.getName());
        
        DownloadResponse response = new DownloadResponse();
        response.setDownloadUrl(downloadUrl);
        response.setFilename(file.getName());
        response.setSize(file.getSize());
        response.setExpiresAt(LocalDateTime.now().plusHours(1));
        
        return response;
    }
    
    public void deleteFile(String userId, String fileId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (!file.getOwnerId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        log.info("file s3 key : " + file.getS3Key());
        // Delete from S3
        s3Service.deleteFile(file.getS3Key());
        
        // Update user storage
        User user = userRepository.findById(userId).orElseThrow();
        user.setStorageUsed(user.getStorageUsed() - file.getSize());
        userRepository.save(user);
        
        // Delete from DB
        fileRepository.delete(file);
    }
    
    public List<FileDto> getFilesByFolder(String userId, String folderId) {
        return fileRepository.findByOwnerIdAndFolderId(userId, folderId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    private FileDto toDto(File file) {
        FileDto dto = new FileDto();
        dto.setId(file.getId());
        dto.setName(file.getName());
        dto.setSize(file.getSize());
        dto.setMimeType(file.getMimeType());
        dto.setUploadStatus(file.getUploadStatus());
        dto.setCreatedAt(file.getCreatedAt());
        return dto;
    }
    
    private String extractS3KeyFromUrl(String url) {
        // Extract key from presigned URL
        String[] parts = url.split("\\?")[0].split("/");
        return parts[parts.length - 3] + "/" + parts[parts.length - 2] + "/" + parts[parts.length - 1];
    }

    public List<FileDto> getRootFiles(String userId) {
        log.info("Getting root files for user: {}", userId);
        
        // Find files where folderId is null
        List<File> files = fileRepository.findByOwnerIdAndFolderIdIsNull(userId);
        
        return files.stream()
                .filter(file -> "complete".equals(file.getUploadStatus()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
