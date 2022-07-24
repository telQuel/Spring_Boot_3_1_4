package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
//@CrossOrigin
@RequestMapping("/rest")
public class UserRestController {

    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/")
    public List<User> getAllUsers() {

        List<User> users = userService.findAll();
        return users;
    }

    @RequestMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable int id) {
        User user = userService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateUser")
    public User editUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @PostMapping("/addNewUser")
    public User addNewUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping("/deleteUser/{id}")
    public void deleteUserById(@PathVariable int id) {
        userService.deleteById(id);
    }
}
