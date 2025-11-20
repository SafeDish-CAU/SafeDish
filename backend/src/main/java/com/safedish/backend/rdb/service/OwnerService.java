package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entitiy.Owner;
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

    public void createOwner(String email, String rawPassword) throws Exception {
       String encodedPassword = passwordEncoder.encode(rawPassword);
       try {
            Owner owner = new Owner(email, encodedPassword);
            ownerRepository.save(owner);
       }  catch (Exception e) {
           throw new Exception("이미 사용 중인 이메일입니다.");
       }
    }
}
