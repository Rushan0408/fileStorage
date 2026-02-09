package com.fileStorage.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fileStorage.model.Folder;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
    
    // Find all folders owned by a user
    List<Folder> findByOwnerId(String ownerId);
    
    // Find root folders (no parent) for a user
    List<Folder> findByOwnerIdAndParentFolderIdIsNull(String ownerId);
    
    // Find subfolders of a specific folder
    List<Folder> findByOwnerIdAndParentFolderId(String ownerId, String parentFolderId);
    
    // Find folder by owner and name in specific parent
    Optional<Folder> findByOwnerIdAndNameAndParentFolderId(String ownerId, String name, String parentFolderId);
    
    // Find all subfolders recursively (for deletion)
    List<Folder> findByOwnerIdAndPathStartingWith(String ownerId, String pathPrefix);
    
    // Check if folder exists with name in parent
    boolean existsByOwnerIdAndNameAndParentFolderId(String ownerId, String name, String parentFolderId);

    // Count folders by owner
    long countByOwnerId(String ownerId);
}