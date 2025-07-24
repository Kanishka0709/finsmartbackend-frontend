package com.finsmart.Finsmart_Finances.service.impl;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finsmart.Finsmart_Finances.service.ChatbotService;

@Service
public class ChatbotServiceImpl implements ChatbotService {
    @Override
    public String getChatbotReply(String message) {
        System.out.println("ChatbotServiceImpl.getChatbotReply called with: " + message);
        try {
            ObjectMapper mapper = new ObjectMapper();
            String requestBody = mapper.writeValueAsString(Map.of("message", message));
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:5001/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Flask Gemini API response code: " + response.statusCode());
            System.out.println("Flask Gemini API response body: " + response.body());
            if (response.statusCode() == 200) {
                Map<?,?> json = mapper.readValue(response.body(), Map.class);
                Object reply = json.get("reply");
                return reply != null ? reply.toString().trim() : "No reply from Gemini Flask API.";
            }
            return "Sorry, I could not process your request.";
        } catch (Exception e) {
            System.out.println("Exception in ChatbotServiceImpl.getChatbotReply:");
            e.printStackTrace();
            return "Sorry, I could not process your request.";
        }
    }
} 