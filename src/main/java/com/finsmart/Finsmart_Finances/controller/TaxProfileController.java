package com.finsmart.Finsmart_Finances.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.model.TaxProfile;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.repository.UserRepository;
import com.finsmart.Finsmart_Finances.service.TaxProfileService;
import com.finsmart.Finsmart_Finances.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/taxprofiles")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaxProfileController {

    private final TaxProfileService taxService;
    private final UserService userService;
    private final UserRepository userRepository;

    public TaxProfileController(TaxProfileService taxService, UserService userService, UserRepository userRepository) {
        this.taxService = taxService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public TaxProfile save(@Valid @RequestBody TaxProfile taxProfile, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username);
        taxProfile.setUser(user);
        return taxService.saveTaxProfile(taxProfile);
    }

    @GetMapping
    public List<TaxProfile> getAll(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username);
        return taxService.getByUserId(user.getId());
    }

    @GetMapping("/{id}")
    public Optional<TaxProfile> getById(@PathVariable Long id) {
        return taxService.getById(id);
    }

    @PutMapping("/{id}")
    public TaxProfile update(@PathVariable Long id, @Valid @RequestBody TaxProfile taxProfile, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username);
        taxProfile.setId(id);
        taxProfile.setUser(user);
        return taxService.saveTaxProfile(taxProfile);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taxService.deleteTaxProfile(id);
    }
}
