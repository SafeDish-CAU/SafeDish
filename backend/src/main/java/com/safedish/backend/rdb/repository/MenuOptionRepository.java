package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entitiy.MenuOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuOptionRepository extends JpaRepository<MenuOption, Long> {
}
