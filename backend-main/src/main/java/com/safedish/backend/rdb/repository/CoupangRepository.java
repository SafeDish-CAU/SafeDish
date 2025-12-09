package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entity.Coupang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoupangRepository extends JpaRepository<Coupang, Long> {
}
