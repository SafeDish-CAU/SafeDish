package com.safedish.backend.openai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safedish.backend.openai.prompt.MainAllergyPromptBuilder;
import com.safedish.backend.openai.prompt.OptionAllergyPromptBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatGptService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${token.openai-rest-api-key}")
    private String openaiRestApiKey;

    public List<Long> inferMainAllergies(String menuName, String description) throws Exception {
        String instruction = MainAllergyPromptBuilder.buildInstruction();
        String input = MainAllergyPromptBuilder.buildInput(menuName, description);
        return inferAllergies(input, instruction);
    }

    public List<Long> inferOptionAllergies(String menuName, String groupName, String itemName, String description) throws Exception {
        String instruction = OptionAllergyPromptBuilder.buildInstruction();
        String input = OptionAllergyPromptBuilder.buildInput(menuName, groupName, itemName, description);
        return inferAllergies(input, instruction);
    }

    public List<Long> inferAllergies(String instruction, String input) throws Exception {
        String url = "https://api.openai.com/v1/responses";

        // Schema 정의
        Map<String, Object> allergiesItems = new HashMap<>();
        allergiesItems.put("type", "integer");

        Map<String, Object> allergiesProperty = new HashMap<>();
        allergiesProperty.put("type", "array");
        allergiesProperty.put("items", allergiesItems);
        allergiesProperty.put("description", "List of allergy codes that this dish likely contains.");

        Map<String, Object> properties = new HashMap<>();
        properties.put("allergies", allergiesProperty);

        Map<String, Object> schema = new HashMap<>();
        schema.put("type", "object");
        schema.put("properties", properties);
        schema.put("required", List.of("allergies"));
        schema.put("additionalProperties", false);

        // text.format 정의
        Map<String, Object> format = new HashMap<>();
        format.put("type", "json_schema");
        format.put("name", "allergy_prediction");
        format.put("strict", true);
        format.put("schema", schema);

        Map<String, Object> text = new HashMap<>();
        text.put("format", format);

        // request body
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4.1-mini");
        body.put("instructions", instruction);
        body.put("input", input);
        body.put("text", text);
        body.put("max_output_tokens", 128);

        // request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiRestApiKey);

        String requestJson = objectMapper.writeValueAsString(body);
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("ChatGPT API 오류: " +
                    response.getStatusCode() + " - " + response.getBody());
        }

        String responseBody = response.getBody();
        if (responseBody == null) {
            throw new Exception("ChatGPT API 오류: empty body");
        }

        // response parsing
        JsonNode root = objectMapper.readTree(responseBody);

        String structuredJson = null;
        JsonNode outputTextNode = root.path("output_text");
        if (outputTextNode.isTextual()) {
            structuredJson = outputTextNode.asText();
        } else {
            JsonNode outputArray = root.path("output");
            if (!outputArray.isArray() || outputArray.isEmpty()) {
                throw new Exception("ChatGPT API 오류: missing 'output'");
            }

            JsonNode firstMessage = outputArray.get(0);
            JsonNode contentArray = firstMessage.path("content");
            if (!contentArray.isArray() || contentArray.isEmpty()) {
                throw new Exception("ChatGPT API 오류: missing 'content'");
            }

            JsonNode firstContent = contentArray.get(0);
            JsonNode textNode = firstContent.path("text");
            if (textNode.isMissingNode()) {
                throw new Exception("ChatGPT API 오류: missing 'text'");
            }

            structuredJson = textNode.asText();
        }

        JsonNode structured = objectMapper.readTree(structuredJson);
        JsonNode allergiesNode = structured.path("allergies");
        if (!allergiesNode.isArray()) {
            throw new Exception("ChatGPT API 오류: 'allergies' is not an array");
        }

        List<Long> allergies = new ArrayList<>();
        for (JsonNode item : allergiesNode) {
            if (item.isNumber()) {
                allergies.add(item.asLong());
            }
        }

        return allergies;
    }
}
