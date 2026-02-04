package com.fileStorage.dto.file;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileUploadRequest {
    private String name;
    private Long size;
    private String mimeType;
    private String folderId;
}
