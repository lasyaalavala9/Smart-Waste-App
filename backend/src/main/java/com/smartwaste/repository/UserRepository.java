package com.smartwaste.repository;

import com.smartwaste.model.Role;
import com.smartwaste.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByIdentifierId(String identifierId);
    Optional<User> findByEmail(String email);
    boolean existsByIdentifierId(String identifierId);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}
