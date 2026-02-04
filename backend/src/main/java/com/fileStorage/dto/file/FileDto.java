package com.fileStorage.dto.file;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FileDto {
    private String id;
    private String name;
    private Long size;
    private String mimeType;
    private String uploadStatus;
    private LocalDateTime createdAt;
}
