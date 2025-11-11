package com.safedish.backend.rdb.repository;

import com.safedish.backend.rdb.entitiy.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Long>  {

}
