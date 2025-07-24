package com.finsmart.Finsmart_Finances.controller;

import com.finsmart.Finsmart_Finances.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        String reply = chatbotService.getChatbotReply(message);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
} 