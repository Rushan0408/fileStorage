package com.fileStorage.dto.file;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class DownloadResponse {
    private String downloadUrl;
    private String filename;
    private Long size;
    private LocalDateTime expiresAt;
}
