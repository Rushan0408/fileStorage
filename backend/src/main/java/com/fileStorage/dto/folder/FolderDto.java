package com.fileStorage.dto.folder;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FolderDto {
    private String id;
    private String name;
    private String path;
    private LocalDateTime createdAt;
}
