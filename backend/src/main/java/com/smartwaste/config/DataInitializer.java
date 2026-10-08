package com.smartwaste.config;

import com.smartwaste.model.*;
import com.smartwaste.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final EcoPointTransactionRepository ecoPointRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ComplaintRepository complaintRepository,
                           TaskRepository taskRepository,
                           NotificationRepository notificationRepository,
                           EcoPointTransactionRepository ecoPointRepo,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
        this.ecoPointRepo = ecoPointRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Users
        String defaultPw = passwordEncoder.encode("password123");

        User citizen = new User("CITIZEN01", "Priya Sharma", "priya@citizen.eco", defaultPw, Role.ROLE_CITIZEN);
        citizen.setEcoPoints(1250);
        citizen.setPhoneNumber("+91 98765 43210");
        citizen = userRepository.save(citizen);

        User worker1 = new User("WORKER01", "Ramesh Kumar", "ramesh@sanitation.eco", defaultPw, Role.ROLE_WORKER);
        worker1.setAssignedZone("Sector 5 & Park Area");
        worker1.setPhoneNumber("+91 91234 56789");
        worker1 = userRepository.save(worker1);

        User worker2 = new User("WORKER02", "Sunil Yadav", "sunil@sanitation.eco", defaultPw, Role.ROLE_WORKER);
        worker2.setAssignedZone("Market Square & Sector 3");
        worker2.setPhoneNumber("+91 98888 12345");
        worker2 = userRepository.save(worker2);

        User authority = new User("AUTH01", "Commissioner Verma", "verma@citymunicipal.gov", defaultPw, Role.ROLE_AUTHORITY);
        authority.setAssignedZone("Metropolitan Municipal HQ");
        authority.setPhoneNumber("+91 90000 11223");
        authority = userRepository.save(authority);

        // 2. Seed Sample Complaints with real coordinates (e.g., around city center)
        // Complaint 1: In Progress
        Complaint c1 = new Complaint();
        c1.setComplaintCode("SW-2026-2345");
        c1.setCitizen(citizen);
        c1.setWasteType(WasteType.MIXED);
        c1.setPriority(Priority.HIGH);
        c1.setStatus(ComplaintStatus.IN_PROGRESS);
        c1.setDescription("Overflowing community dumpster near children's playground. Plastic packaging and wet waste scattered.");
        c1.setEstimatedWeightKg(18.5);
        c1.setAssignedWorker(worker1);
        Location loc1 = new Location(12.9716, 77.5946, "Park Area, Sector 5", "Near Children's Playground", "Sector 5", "Metro City");
        c1.setLocation(loc1);
        c1 = complaintRepository.save(c1);

        Task task1 = new Task(c1, worker1);
        task1.setStatus(ComplaintStatus.IN_PROGRESS);
        task1.setStartedAt(LocalDateTime.now().minusHours(1));
        task1.setDistanceKm(0.8);
        taskRepository.save(task1);

        // Complaint 2: Assigned
        Complaint c2 = new Complaint();
        c2.setComplaintCode("SW-2026-2346");
        c2.setCitizen(citizen);
        c2.setWasteType(WasteType.PLASTIC);
        c2.setPriority(Priority.MEDIUM);
        c2.setStatus(ComplaintStatus.ASSIGNED);
        c2.setDescription("Large pile of single-use plastic bottles and packaging behind grocery market.");
        c2.setEstimatedWeightKg(12.0);
        c2.setAssignedWorker(worker1);
        Location loc2 = new Location(12.9780, 77.6010, "Commercial Road, Block C", "Opposite Supermarket", "Block C", "Metro City");
        c2.setLocation(loc2);
        c2 = complaintRepository.save(c2);

        Task task2 = new Task(c2, worker1);
        task2.setStatus(ComplaintStatus.ASSIGNED);
        task2.setDistanceKm(1.4);
        taskRepository.save(task2);

        // Complaint 3: Completed
        Complaint c3 = new Complaint();
        c3.setComplaintCode("SW-2026-2340");
        c3.setCitizen(citizen);
        c3.setWasteType(WasteType.E_WASTE);
        c3.setPriority(Priority.URGENT);
        c3.setStatus(ComplaintStatus.COMPLETED);
        c3.setDescription("Discarded broken television and electronic circuit boards beside bus stop.");
        c3.setEstimatedWeightKg(22.0);
        c3.setAssignedWorker(worker1);
        Location loc3 = new Location(12.9650, 77.5890, "Central Avenue, Sector 2", "Bus Depot Shelter", "Sector 2", "Metro City");
        c3.setLocation(loc3);
        c3 = complaintRepository.save(c3);

        Task task3 = new Task(c3, worker1);
        task3.setStatus(ComplaintStatus.COMPLETED);
        task3.setStartedAt(LocalDateTime.now().minusHours(4));
        task3.setCompletedAt(LocalDateTime.now().minusHours(2));
        task3.setCompletionNotes("Electronic waste segregated safely and transferred to authorized e-waste recycling unit.");
        taskRepository.save(task3);

        // Complaint 4: Submitted (Pending Assignment)
        Complaint c4 = new Complaint();
        c4.setComplaintCode("SW-2026-2350");
        c4.setCitizen(citizen);
        c4.setWasteType(WasteType.GLASS);
        c4.setPriority(Priority.HIGH);
        c4.setStatus(ComplaintStatus.SUBMITTED);
        c4.setDescription("Broken glass bottles and ceramic construction debris near footpath.");
        c4.setEstimatedWeightKg(14.0);
        Location loc4 = new Location(12.9830, 77.5920, "Heritage Lane, Sector 7", "Next to Library", "Sector 7", "Metro City");
        c4.setLocation(loc4);
        complaintRepository.save(c4);

        // Complaint 5: Submitted (Pending Assignment)
        Complaint c5 = new Complaint();
        c5.setComplaintCode("SW-2026-2351");
        c5.setCitizen(citizen);
        c5.setWasteType(WasteType.PAPER);
        c5.setPriority(Priority.LOW);
        c5.setStatus(ComplaintStatus.SUBMITTED);
        c5.setDescription("Cardboard delivery boxes piled up outside residential complex.");
        c5.setEstimatedWeightKg(9.5);
        Location loc5 = new Location(12.9690, 77.6080, "Greenview Heights, Sector 4", "Gate 2 Entrance", "Sector 4", "Metro City");
        c5.setLocation(loc5);
        complaintRepository.save(c5);

        // 3. Seed Eco Points Transactions
        ecoPointRepo.save(new EcoPointTransaction(citizen, 50, "Initial Welcome Bonus", null));
        ecoPointRepo.save(new EcoPointTransaction(citizen, 50, "Reported Waste: SW-2026-2345 (Mixed)", c1.getId()));
        ecoPointRepo.save(new EcoPointTransaction(citizen, 50, "Reported Waste: SW-2026-2346 (Plastic)", c2.getId()));
        ecoPointRepo.save(new EcoPointTransaction(citizen, 50, "Reported Waste: SW-2026-2340 (E-Waste)", c3.getId()));
        ecoPointRepo.save(new EcoPointTransaction(citizen, 25, "Cleanup Resolution Bonus: SW-2026-2340", c3.getId()));

        // 4. Seed Notifications for each role
        // For Citizen
        notificationRepository.save(new Notification(citizen, "Task Completed & Verified! 🎉",
                "Your reported e-waste at Central Avenue (SW-2026-2340) has been cleaned. +25 Eco Points awarded!",
                NotificationType.TASK_COMPLETED, c3.getId(), "COMPLAINT"));
        notificationRepository.save(new Notification(citizen, "Sanitation Worker Dispatched",
                "Worker Ramesh Kumar has been assigned to your report SW-2026-2345.",
                NotificationType.STATUS_CHANGED, c1.getId(), "COMPLAINT"));

        // For Worker
        notificationRepository.save(new Notification(worker1, "New Task Assigned: SW-2026-2345",
                "High priority collection required at Park Area, Sector 5.",
                NotificationType.COMPLAINT_ASSIGNED, c1.getId(), "TASK"));
        notificationRepository.save(new Notification(worker1, "New Task Assigned: SW-2026-2346",
                "Plastic waste collection at Commercial Road, Block C.",
                NotificationType.COMPLAINT_ASSIGNED, c2.getId(), "TASK"));

        // For Authority
        notificationRepository.save(new Notification(authority, "High Priority Complaint Submitted",
                "New high-priority glass waste report SW-2026-2350 requires immediate assignment.",
                NotificationType.COMPLAINT_SUBMITTED, c4.getId(), "COMPLAINT"));
        notificationRepository.save(new Notification(authority, "Daily Collection Milestone",
                "City operations reached 1,810 kg recycled materials diverted from landfills today.",
                NotificationType.GENERAL, null, "ANALYTICS"));
    }
}
