


// =======================
//      CambialeDto
// =======================
export interface CambialeDto {
    id: string;
    amount: number;

    creationDateFr: string;
    operationDateFr: string;

    protestable: boolean;
    creationLocation: TunisianGovernorate;

    referenceCode: string;
    isPrinted: boolean;

    display?: string; // UI only
}


// =======================
//   CambialeDtoDetail
// =======================
export interface CambialeDtoDetail extends CambialeDto {
    amountInLetters: string;

    // Bank details
    nameBank?: string;
    imageBank?: string;
    codeBank?: string;
    abbreviationBank?: string;

    // Subsidiary details
    codeSubsidiary?: string;
    nameSubsidiary?: string;
    locationSubsidiary?: string;

    // Beneficiary fields
    beneficiaryDrawer?: string;
    beneficiaryPayToOrderOf?: string;

    // Donor fields
    donorAccountRib?: string;
    donorAccountName?: string;
    donorCin?: string;
    donorCity?: string;
    donorLocation?: string;
    donorCodePostal?: string;
}


// =======================
//   CambialeSaveDto
// =======================
export interface CambialeSaveDto {
    amount: number;
    operationDate: string;
    protestable: boolean;
    creationLocation: TunisianGovernorate;
    referenceCode: string;

    beneficiaryId: string;
    donorAccountId: string;
}


// =======================
//  Tunisian Governorates
// =======================
export enum TunisianGovernorate {
    ARIANA = "ARIANA",
    TUNIS = "TUNIS",
    BEJA = "BEJA",
    BEN_AROUSS = "BEN_AROUSS",
    BIZERTE = "BIZERTE",
    GABES = "GABES",
    GAFSA = "GAFSA",
    JENDOUBA = "JENDOUBA",
    KAIROUAN = "KAIROUAN",
    KASSERINE = "KASSERINE",
    KEBILI = "KEBILI",
    KEF = "KEF",
    MAHDIA = "MAHDIA",
    MANOUBA = "MANOUBA",
    MEDENINE = "MEDENINE",
    MONASTIR = "MONASTIR",
    NABEUL = "NABEUL",
    SFAX = "SFAX",
    SIDI_BOUZID = "SIDI_BOUZID",
    SILIANA = "SILIANA",
    SOUSSE = "SOUSSE",
    TOZEUR = "TOZEUR",
    TATAOUINE = "TATAOUINE",
    ZAGHOUAN = "ZAGHOUAN"
}