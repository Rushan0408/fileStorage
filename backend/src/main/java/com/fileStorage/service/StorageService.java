package com.fileStorage.service;

import com.fileStorage.dto.storage.StorageStatsDto;
import com.fileStorage.model.User;
import com.fileStorage.repository.FileRepository;
import com.fileStorage.repository.FolderRepository;
import com.fileStorage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService {
    
    private final UserRepository userRepository;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    
    public StorageStatsDto getStorageStats(String userId) {
        log.info("Calculating storage stats for user: {}", userId);
        
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Count files
        long fileCount = fileRepository.countByOwnerId(userId);
        
        // Count folders
        long folderCount = folderRepository.countByOwnerId(userId);
        
        // Calculate usage percentage
        double usagePercentage = user.getStorageQuota() > 0 
            ? ((double) user.getStorageUsed() / user.getStorageQuota()) * 100 
            : 0;
        
        // Calculate available storage
        long storageAvailable = user.getStorageQuota() - user.getStorageUsed();
        
        return StorageStatsDto.builder()
                .storageUsed(user.getStorageUsed())
                .storageQuota(user.getStorageQuota())
                
                .storageAvailable(storageAvailable)
                .usagePercentage(usagePercentage)
                .fileCount(fileCount)
                .folderCount(folderCount)
                .build();
    }
}
