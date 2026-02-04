package com.fileStorage.dto.folder;

import lombok.Data;

@Data
public class CreateFolderRequest {
    private String name;
    private String parentFolderId;
}
