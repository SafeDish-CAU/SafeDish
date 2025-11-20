package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entitiy.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}
