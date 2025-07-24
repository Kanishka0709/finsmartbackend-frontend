package com.finsmart.Finsmart_Finances.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.finsmart.Finsmart_Finances.model.TaxProfile;
import com.finsmart.Finsmart_Finances.repository.TaxProfileRepository;
import com.finsmart.Finsmart_Finances.service.TaxProfileService;

@Service
public class TaxProfileServiceImpl implements TaxProfileService {

    private final TaxProfileRepository taxRepo;

    public TaxProfileServiceImpl(TaxProfileRepository taxRepo) {
        this.taxRepo = taxRepo;
    }

    @Override
    public TaxProfile saveTaxProfile(TaxProfile taxProfile) {
        return taxRepo.save(taxProfile);
    }

    @Override
    public List<TaxProfile> getAll() {
        return taxRepo.findAll();
    }

    @Override
    public Optional<TaxProfile> getById(Long id) {
        return taxRepo.findById(id);
    }

    @Override
    public List<TaxProfile> getByUserId(Long userId) {
        return taxRepo.findByUserId(userId);
    }

    @Override
    public void deleteTaxProfile(Long id) {
        taxRepo.deleteById(id);
    }
}
