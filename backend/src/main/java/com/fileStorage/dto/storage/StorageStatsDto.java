package com.fileStorage.dto.storage;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class StorageStatsDto {
    private Long storageUsed;      // Total bytes used
    private Long storageQuota;     // Total bytes allowed
    private Long storageAvailable; // Remaining bytes
    private Double usagePercentage; // Percentage used
    private Long fileCount;        // Total number of files
    private Long folderCount;      // Total number of folders
}
