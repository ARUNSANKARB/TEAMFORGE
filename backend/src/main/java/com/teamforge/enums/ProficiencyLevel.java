package com.teamforge.enums;

public enum ProficiencyLevel {
    BEGINNER(1),
    INTERMEDIATE(2),
    ADVANCED(3),
    EXPERT(4);

    private final int value;

    ProficiencyLevel(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
