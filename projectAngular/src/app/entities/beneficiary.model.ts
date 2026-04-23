// Beneficiary returned by the backend
export interface BeneficiaryDto {
    id: string;
    drawer: string;
    payToOrderOf: string;
}


// Input used when creating a beneficiary
export interface BeneficiarySaveInput {
    drawer: string;
    payToOrderOf: string;
}


// Input used when updating a beneficiary
export interface BeneficiaryUpdateInput {
    id: string;
    drawer: string;
    payToOrderOf: string;
}
