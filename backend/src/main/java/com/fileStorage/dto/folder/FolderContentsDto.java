package com.fileStorage.dto.folder;

import java.util.List;

import com.fileStorage.dto.file.FileDto;

import lombok.Data;

@Data
public class FolderContentsDto {
    private String folderId;
    private String path;
    private List<FolderDto> folders;
    private List<FileDto> files;
}
