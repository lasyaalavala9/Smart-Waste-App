package com.smartwaste.service;

import com.smartwaste.model.Notification;
import com.smartwaste.model.NotificationType;
import com.smartwaste.model.Role;
import com.smartwaste.model.User;
import com.smartwaste.repository.NotificationRepository;
import com.smartwaste.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Notification sendNotification(User recipient, String title, String message, NotificationType type, Long refId, String refType) {
        Notification notification = new Notification(recipient, title, message, type, refId, refType);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void notifyAuthorities(String title, String message, NotificationType type, Long refId, String refType) {
        List<User> authorities = userRepository.findByRole(Role.ROLE_AUTHORITY);
        for (User auth : authorities) {
            notificationRepository.save(new Notification(auth, title, message, type, refId, refType));
        }
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(list);
    }
}
