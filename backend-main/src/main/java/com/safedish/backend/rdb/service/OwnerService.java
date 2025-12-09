package com.safedish.backend.rdb.service;

import com.safedish.backend.auth.token.TokenGenerator;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.repository.OwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OwnerService {
    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenGenerator tokenGenerator;

    public Owner createOwner(String email, String rawPassword) throws Exception {
        String encodedPassword = passwordEncoder.encode(rawPassword);
        try {
            Owner owner = new Owner(email, encodedPassword);
            ownerRepository.save(owner);

            return owner;
        }  catch (Exception e) {
            throw new Exception("이미 사용 중인 이메일입니다.");
        }
    }

    public Owner resetToken(String email, String rawPassword) throws Exception {
        Optional<Owner> ownerOpt = ownerRepository.findByEmail(email);
        if (ownerOpt.isEmpty()) {
            throw new Exception("해당하는 이메일이 없습니다.");
        }

        Owner owner = ownerOpt.get();
        if (!passwordEncoder.matches(rawPassword, owner.getPassword())) {
            throw new Exception("비밀번호가 일치하지 않습니다.");
        }

        try {
            String token = tokenGenerator.generateToken(owner.getId(), owner.getEmail());
            owner.setToken(token);
            ownerRepository.save(owner);

            return owner;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void verifyToken(String token) throws Exception {
        Optional<Owner> ownerOpt = ownerRepository.findByToken(token);
        if (ownerOpt.isEmpty()) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }
    }
}
