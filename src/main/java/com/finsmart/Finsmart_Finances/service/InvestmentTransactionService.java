package com.finsmart.Finsmart_Finances.service;

import java.util.List;
import java.util.Optional;

import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionDTO;
import com.finsmart.Finsmart_Finances.dto.InvestmentTransactionRequest;

public interface InvestmentTransactionService {
    InvestmentTransactionDTO createTransaction(InvestmentTransactionRequest transaction);
    List<InvestmentTransactionDTO> getAllTransactions();
    Optional<InvestmentTransactionDTO> getTransactionById(Long id);
    void deleteTransaction(Long id);
    InvestmentTransactionDTO updateTransaction(Long id, InvestmentTransactionDTO updatedTx);
}
