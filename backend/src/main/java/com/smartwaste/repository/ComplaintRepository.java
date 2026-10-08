package com.smartwaste.repository;

import com.smartwaste.model.Complaint;
import com.smartwaste.model.ComplaintStatus;
import com.smartwaste.model.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintCode(String complaintCode);
    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<Complaint> findByAssignedWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    List<Complaint> findAllByOrderByCreatedAtDesc();

    long countByStatus(ComplaintStatus status);
    long countByWasteType(WasteType wasteType);

    @Query("SELECT c.wasteType, COUNT(c) FROM Complaint c GROUP BY c.wasteType")
    List<Object[]> countByWasteTypeGrouped();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countByStatusGrouped();
}
