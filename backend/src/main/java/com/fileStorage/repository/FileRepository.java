package com.fileStorage.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.fileStorage.model.File;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<File, String> {
    
    // Find all files in a folder
    List<File> findByOwnerIdAndFolderId(String ownerId, String folderId);
    
    // Find files with pagination
    Page<File> findByOwnerIdAndFolderId(String ownerId, String folderId, Pageable pageable);
    
    // Find all files owned by user
    List<File> findByOwnerId(String ownerId);
    
    // Find file by S3 key
    Optional<File> findByS3Key(String s3Key);
    
    // Find files by upload status
    List<File> findByUploadStatus(String uploadStatus);
    
    // Find pending uploads older than certain time (for cleanup)
    List<File> findByUploadStatusAndCreatedAtBefore(String uploadStatus, LocalDateTime before);
    
    // Find files by owner and name in folder
    Optional<File> findByOwnerIdAndNameAndFolderId(String ownerId, String name, String folderId);
    
    // Check if file exists with name in folder
    boolean existsByOwnerIdAndNameAndFolderId(String ownerId, String name, String folderId);
    
    // Find recent files by owner
    List<File> findTop10ByOwnerIdAndUploadStatusOrderByCreatedAtDesc(String ownerId, String uploadStatus);
    
    // Count files in folder
    long countByOwnerIdAndFolderId(String ownerId, String folderId);
    
    // Find all files in a folder and its subfolders (for deletion)
    @Query("{ 'ownerId': ?0, 'folderId': { $regex: ?1 } }")
    List<File> findByOwnerIdAndFolderIdRegex(String ownerId, String folderIdPattern);

    // Count files by owner
    long countByOwnerId(String ownerId);

    // Find files in root (no folder)
    List<File> findByOwnerIdAndFolderIdIsNull(String ownerId);
}
