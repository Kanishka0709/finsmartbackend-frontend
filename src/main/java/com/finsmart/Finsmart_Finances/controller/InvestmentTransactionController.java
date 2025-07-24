package com.finsmart.Finsmart_Finances.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionDTO;
import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionRequest;
import com.finsmart.Finsmart_Finances.service.InvestmentTransactionService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InvestmentTransactionController {

    private final InvestmentTransactionService service;

    public InvestmentTransactionController(InvestmentTransactionService service) {
        this.service = service;
    }

    @PostMapping
    public InvestmentTransactionDTO create(@Valid @RequestBody InvestmentTransactionRequest txReq) {
        System.out.println("Received transaction request: " + txReq);
        System.out.println("goalId: " + txReq.getGoalId());
        return service.createTransaction(txReq);
    }

    @GetMapping
    public List<InvestmentTransactionDTO> getAll() {
        return service.getAllTransactions();
    }

    @GetMapping("/{id}")
    public Optional<InvestmentTransactionDTO> getById(@PathVariable Long id) {
        return service.getTransactionById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentTransactionDTO> updateTransaction(@PathVariable Long id, @RequestBody InvestmentTransactionDTO updatedTx) {
        InvestmentTransactionDTO updated = service.updateTransaction(id, updatedTx);
        return ResponseEntity.ok(updated);
    }

   
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteTransaction(id);
    }
}
