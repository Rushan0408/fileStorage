package com.fileStorage.dto.file;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UploadResponse {
    private String fileId;
    private String uploadUrl;
    private LocalDateTime expiresAt;
}
