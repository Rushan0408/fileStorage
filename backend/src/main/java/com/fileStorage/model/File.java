package com.fileStorage.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "files")
public class File {
    @Id
    private String id;
    
    private String name;
    
    @Indexed        
    private String ownerId;
    
    @Indexed
    private String folderId;
    
    private Long size;
    private String mimeType;
    
    @Indexed(unique = true)
    private String s3Key;
    private String s3Bucket;
    
    // "pending", "complete", "failed"
    private String uploadStatus; 
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
