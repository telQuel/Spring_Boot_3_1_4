package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    private final Logger LOGGER = Logger.getLogger("ru.kata.spring.boot_security.demo.service.UserServiceImpl");

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByName(String username) {
        return userRepository.findByFirstName(username).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    @Transactional
    public User saveUser(User user) {

        if (user.getId() != 0) {
            User user1 = userRepository.findById(user.getId()).orElse(new User());
            user1.setFirstName(user.getFirstName());
            user1.setLastName(user.getLastName());
            user1.setEmail(user.getEmail());
            user1.setAge(user.getAge());
            user1.setPassword(user.getPassword());
            user1.setRoles(user.getRoles());

            return userRepository.save(user1);
        }

            user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '%s' not found", email));
        }

        LOGGER.setLevel(Level.WARNING);
        LOGGER.log(Level.WARNING, user.getEmail() + "_____________" + user.getFirstName());

        return user;
    }

    @Transactional(readOnly = true)
    public List<Role> roleList() {
        List<Role> roleList = new ArrayList<>() {
            @Override
            public String toString() {
                Iterator<Role> it = iterator();
                if (! it.hasNext())
                    return "[]";

                StringBuilder sb = new StringBuilder();
                //sb.append('[');
                for (;;) {
                    Role e = it.next();
                    sb.append(e.toString().replace("ROLE_", ""));
                    if (! it.hasNext())
                        return sb.toString();
                    sb.append(' ').append(' ');
                }
                //return super.toString();
            }
        };
        roleList.addAll(roleRepository.findAll());
        return roleList;
    }
}
