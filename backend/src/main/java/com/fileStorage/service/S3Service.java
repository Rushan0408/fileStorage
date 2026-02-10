package com.fileStorage.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    
    private final AmazonS3 s3Client;
    
    @Value("${aws.s3.bucket}") String bucketName;
    
    public String generateUploadUrl(String userId, String filename, String contentType) {
        String s3Key = generateS3Key(userId, filename);
        
        Date expiration = Date.from( LocalDateTime.now().plusHours(1).atZone(ZoneId.systemDefault()).toInstant() );
        
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, s3Key)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration)
                .withContentType(contentType);
        
        return s3Client.generatePresignedUrl(request).toString();
    }
    
    public String generateDownloadUrl(String s3Key, String filename) {
        Date expiration = Date.from(
            LocalDateTime.now().plusHours(1)
                .atZone(ZoneId.systemDefault()).toInstant()
        );
        
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, s3Key)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);
        
        return s3Client.generatePresignedUrl(request).toString();
    }
    
    public boolean fileExists(String s3Key) {
        log.info("checking key: " + s3Key);
        String decodedKey = URLDecoder.decode(s3Key, StandardCharsets.UTF_8);
        return s3Client.doesObjectExist(bucketName, decodedKey);
    }
    
    public void deleteFile(String s3Key) {
        log.info("checking key: " + s3Key);
        String decodedKey = URLDecoder.decode(s3Key, StandardCharsets.UTF_8);
        s3Client.deleteObject(bucketName, decodedKey);
    }
    
    private String generateS3Key(String userId, String filename) {
        String uuid = UUID.randomUUID().toString();
        String timestamp = String.valueOf(System.currentTimeMillis());
        return String.format("users/%s/%s-%s-%s", userId, timestamp, uuid, filename);
    }
}
