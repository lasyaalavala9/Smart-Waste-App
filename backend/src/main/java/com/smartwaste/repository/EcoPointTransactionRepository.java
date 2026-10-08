package com.smartwaste.repository;

import com.smartwaste.model.EcoPointTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcoPointTransactionRepository extends JpaRepository<EcoPointTransaction, Long> {
    List<EcoPointTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
