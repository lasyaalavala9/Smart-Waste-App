package com.smartwaste.service;

import com.smartwaste.model.EcoPointTransaction;
import com.smartwaste.model.User;
import com.smartwaste.repository.EcoPointTransactionRepository;
import com.smartwaste.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EcoPointService {

    private final EcoPointTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public EcoPointService(EcoPointTransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EcoPointTransaction awardPoints(User user, int points, String reason, Long complaintId) {
        user.setEcoPoints(user.getEcoPoints() + points);
        userRepository.save(user);

        EcoPointTransaction tx = new EcoPointTransaction(user, points, reason, complaintId);
        return transactionRepository.save(tx);
    }

    public List<EcoPointTransaction> getUserHistory(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public int getUserBalance(Long userId) {
        return userRepository.findById(userId)
                .map(User::getEcoPoints)
                .orElse(0);
    }
}
