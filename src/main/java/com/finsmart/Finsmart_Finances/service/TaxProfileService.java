package com.finsmart.Finsmart_Finances.service;

import java.util.List;
import java.util.Optional;

import com.finsmart.Finsmart_Finances.model.TaxProfile;

public interface TaxProfileService {
    TaxProfile saveTaxProfile(TaxProfile taxProfile);
    List<TaxProfile> getAll();
    Optional<TaxProfile> getById(Long id);
    List<TaxProfile> getByUserId(Long userId);
    void deleteTaxProfile(Long id);
}
