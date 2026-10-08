package com.smartwaste.dto;

public class TaskActionRequest {
    private String action; // START, COMPLETE
    private String beforeImageUrl;
    private String afterImageUrl;
    private String completionNotes;

    public TaskActionRequest() {}

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getBeforeImageUrl() { return beforeImageUrl; }
    public void setBeforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; }

    public String getAfterImageUrl() { return afterImageUrl; }
    public void setAfterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; }

    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }
}
