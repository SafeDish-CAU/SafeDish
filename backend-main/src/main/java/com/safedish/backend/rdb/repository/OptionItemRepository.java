package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entity.OptionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionItemRepository extends JpaRepository<OptionItem, Long> {
}