package com.smartwaste.security;

import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifierId) throws UsernameNotFoundException {
        User user = userRepository.findByIdentifierId(identifierId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID/Username: " + identifierId));
        return new UserPrincipal(user);
    }
}
