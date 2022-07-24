package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/com")
public class UserController {

    private final UserService userService;

    @Autowired
    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/index2")
    public String index2() {
        return "index2";
    }

    @GetMapping("/admin")
    public String adminPage(Principal principal) {
        return "admin-page";
    }

    @GetMapping("/user")
    public String userProfile(Model model, Principal principal) {
        model.addAttribute("user", userService.findByEmail(principal.getName()));
        return "user";
    }

    @GetMapping("/admin/allUsers")
    public String getUsers(Model model, Principal principal) {
        model.addAttribute("user", new User());
        model.addAttribute("autUser", userService.findByEmail(principal.getName()));
        model.addAttribute("roleList", userService.roleList());
        model.addAttribute("adminEmail", principal.getName());
        model.addAttribute("users", userService.findAll());
        return "users";
    }

    @GetMapping(value = "/admin/add")
    public String addUser(Model model) {
        List<Role> roleList = userService.roleList();
        model.addAttribute("user", new User());
        model.addAttribute("roleList", roleList);
        return "create";
    }

    @GetMapping(value = "/admin/update/{id}")
    public String updateUser(@PathVariable("id") int id, Model model) {
        User user = userService.findById(id);
        List<Role> roleList = userService.roleList();
        model.addAttribute("user", user);
        model.addAttribute("roleList", roleList);
        return "create";
    }

    @PostMapping(value = "/admin/save")
    public String saveUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult) {

        userService.saveUser(user);
        return "redirect:/com/admin/allUsers";
    }

    @PostMapping(value = "/admin/delete/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.deleteById(id);
        return "redirect:/com/admin/allUsers";
    }

}
