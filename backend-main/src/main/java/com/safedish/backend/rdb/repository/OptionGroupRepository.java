package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entity.OptionGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionGroupRepository extends JpaRepository<OptionGroup, Long> {
}