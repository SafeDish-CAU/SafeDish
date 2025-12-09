package com.safedish.backend.auth.token;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

@Component
public class TokenGenerator {
    @Value("${token.secret-key}")
    private String secretKey;

    public String generateToken(Long ownerId, String email) throws Exception {
        long now = Instant.now().toEpochMilli();
        String raw = email + ":" + ownerId + ":" + now + ":" + secretKey;

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder(hashBytes.length * 2);
            for (int i = 7; i >= 0; i--) {
                sb.append(String.format("%02x", (ownerId >> (i * 8)) & 0xFF));
            }
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new Exception("SHA-256 암호화 실패");
        }
    }
}
