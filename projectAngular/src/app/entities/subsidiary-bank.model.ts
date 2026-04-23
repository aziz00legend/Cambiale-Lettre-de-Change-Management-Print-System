// src/app/entities/subsidiary-bank.model.ts

export interface SubsidiaryBankDto {
    id: string;
    codeSubsidiary: string;
    name: string;
    location: string;
}

export interface SubsidiaryBankSaveInput {
    codeSubsidiary: string;
    name: string;
    location: string;
}

export interface SubsidiaryBankUpdateInput {
    name: string;
    location: string;
}
