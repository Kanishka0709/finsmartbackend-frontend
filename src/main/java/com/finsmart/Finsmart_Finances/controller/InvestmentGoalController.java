package com.finsmart.Finsmart_Finances.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.finsmart.Finsmart_Finances.dto.InvestmentGoalDTO;
import com.finsmart.Finsmart_Finances.model.InvestmentGoal;
import com.finsmart.Finsmart_Finances.model.User;
import com.finsmart.Finsmart_Finances.service.InvestmentGoalService;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InvestmentGoalController {

    private final InvestmentGoalService goalService;
    private static final Logger log = LoggerFactory.getLogger(InvestmentGoalController.class);

    public InvestmentGoalController(InvestmentGoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<InvestmentGoalDTO> createGoal(@RequestBody InvestmentGoal goal, Authentication authen) {
        if (authen == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authen.getName();
        User logged_in = goalService.findusingusername(username);
        if (logged_in == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        goal.setUser(logged_in);
        InvestmentGoalDTO saved = goalService.createGoal(goal);
        return ResponseEntity.ok(saved);
    }
    
    
    @GetMapping
    public ResponseEntity<List<InvestmentGoalDTO>> getAllGoalsOfUser(Authentication authen) {
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	List<InvestmentGoalDTO> allGoalofUser = goalService.getAllGoalsrelatedtoUser(logged_in.getId());
    	
        return ResponseEntity.ok(allGoalofUser);
    }

    @GetMapping("/{id}")
    public Optional<InvestmentGoalDTO> getGoalById(@PathVariable Long id) {
        return goalService.getGoalById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InvestmentGoalDTO> updateGoal(@PathVariable Long id, @RequestBody InvestmentGoal updatedGoal) {
        InvestmentGoalDTO updated = goalService.updateGoal(id, updatedGoal);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/by-date/{date}")
	public ResponseEntity<List<InvestmentGoalDTO>> getBystartDate(Authentication authen, 
	     @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	List<InvestmentGoalDTO> allgoalofdate = goalService.getAllGoalOfStartDateAndUser(date, logged_in.getId());
    	
    	return ResponseEntity.ok(allgoalofdate);
    	
    	
    }
    
    @GetMapping("/by-start-month/{month}/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getBystartMonth(Authentication authen, @PathVariable int month, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for month {}-{} and user: {}", month, year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to month filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofstartmonth = goalService.getAllGoalWhichStartedInMonthOfUser(month, year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofstartmonth);
    }	
    
    @GetMapping("/by-start-year/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getBystartyear(Authentication authen, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for year {} and user: {}", year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to year filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofstartyear = goalService.getAllGoalWhichStartedInYearOfUser(year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofstartyear);
    }	
    
    
    @GetMapping("/by-end-date/{date}")
	public ResponseEntity<List<InvestmentGoalDTO>> getByendDate(Authentication authen, 
	     @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    	String username = authen.getName();
    	User logged_in = goalService.findusingusername(username);
    	
    	if(logged_in == null) {
    		log.warn("Unauthorized attempt to add expense by user: {}", username);
 			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	
    	List<InvestmentGoalDTO> allgoalofenddate = goalService.getAllGoalOfEndDateAndUser(date, logged_in.getId());
    	
    	return ResponseEntity.ok(allgoalofenddate);
    	    	
    }
    
    @GetMapping("/by-end-month/{month}/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getByendMonth(Authentication authen, @PathVariable int month, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for month {}-{} and user: {}", month, year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to month filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofendmonth = goalService.getAllGoalWhichEndedInMonthOfUser(month, year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofendmonth);
    }	
    
    @GetMapping("/by-end-year/{year}")
	public ResponseEntity<List<InvestmentGoalDTO>> getByendyear(Authentication authen, @PathVariable int year) {
		String Username = authen.getName();
		log.info("Fetching expenses for year {} and user: {}", year, Username);
		
		User logged_in =  goalService.findusingusername(Username);
		if(logged_in == null) {
			log.warn("Unauthorized access to year filter by user: {}", Username);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		List<InvestmentGoalDTO> allgoalofendyear = goalService.getAllGoalWhichEndedInYearOfUser(year, logged_in.getId());
		
		return ResponseEntity.ok(allgoalofendyear);
    }	
    
    
}
