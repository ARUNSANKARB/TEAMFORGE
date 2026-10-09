package com.teamforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationReasonDto {
    private Long id;
    private String type;
    private String explanationText;
    private boolean isPositive;
}
