package com.finsmart.Finsmart_Finances.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.finsmart.Finsmart_Finances.model.InvestmentTransaction;

public interface InvestmentTransactionRepository extends JpaRepository<InvestmentTransaction, Long> {
    
}
