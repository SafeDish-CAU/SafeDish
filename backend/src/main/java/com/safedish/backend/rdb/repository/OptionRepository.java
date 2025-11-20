package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Option, Long> {
}
