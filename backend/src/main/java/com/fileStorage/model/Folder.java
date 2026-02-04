package com.fileStorage.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "folders")
public class Folder {
    @Id
    private String id;
    
    private String name;
    
    @Indexed
    private String ownerId;
    
    @Indexed
    private String parentFolderId;  
    
    private String path;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
