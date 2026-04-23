// src/app/entities/bank.model.ts

export interface BankDto {
    id: string;
    name: string;
    image?: string;
    codeBank: string;
    abbreviation?: string;
}

export interface BankSaveInput {
    name: string;
    image?: string;
    codeBank: string;
    abbreviation?: string;
}

export interface BankUpdateInput {
    id: string;
    name: string;
    image: string;
    abbreviation: string;
}
