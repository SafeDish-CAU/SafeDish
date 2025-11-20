package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entitiy.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

}
