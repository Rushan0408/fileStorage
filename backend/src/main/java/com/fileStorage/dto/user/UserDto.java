package com.fileStorage.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private String id;
    private String username;
    private Long storageUsed;
    private Long storageQuota;
}
