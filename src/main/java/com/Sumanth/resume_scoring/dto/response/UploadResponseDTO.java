package com.Sumanth.resume_scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponseDTO {
    private boolean success;
    private Long candidateId;
    private Integer score;
    private Integer rank;
    private String experienceLevel;
    private String message;
}
