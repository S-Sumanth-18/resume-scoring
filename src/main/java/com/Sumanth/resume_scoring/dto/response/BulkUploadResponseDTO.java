package com.Sumanth.resume_scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResponseDTO {
    private int totalUploaded;
    private int successCount;
    private int failedCount;
    private List<String> failedEmails;
}
