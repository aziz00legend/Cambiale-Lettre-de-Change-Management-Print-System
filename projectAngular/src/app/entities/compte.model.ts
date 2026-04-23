// Compte DTO returned by backend
export interface CompteDto {
    id: string;
    rib: string;
    name: string;

    cin: string;
    city: string;
    location: string;
    codePostal: string;
}


// Input for creating a new Compte
export interface CompteSaveInput {
    rib: string;
    name: string;

    cin: string;
    city: string;
    location: string;
    codePostal: string;
}


// Input for updating an existing Compte
export interface CompteUpdateInput {
    name: string;

    cin: string;
    city: string;
    location: string;
    codePostal: string;
}
