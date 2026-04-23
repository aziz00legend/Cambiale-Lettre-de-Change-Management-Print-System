import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

import {
  CambialeDto,
  CambialeDtoDetail,
  CambialeSaveDto
} from '../entities/cambiale.model';

@Injectable({ providedIn: 'root' })
export class CambialeService {
  constructor(private apollo: Apollo) { }

  // ===========================
  //   Get All Cambiales
  // ===========================
  getCambiales(): Observable<CambialeDto[]> {
    return this.apollo
      .query<{ getCambiales: CambialeDto[] }>({
        query: gql`
          query getCambiales {
            getCambiales {
              id
              amount
              creationDateFr
              operationDateFr
              protestable
              creationLocation
              referenceCode
              isPrinted
            }
          }
        `,
        fetchPolicy: 'network-only'
      })
      .pipe(map(res => res.data.getCambiales));
  }

  // ===========================
  //   Get Cambiale Detail
  // ===========================
  getCambialeById(id: string, fields: string[]): Observable<Partial<CambialeDtoDetail>> {
    fields.push("isPrinted");
    const selectedFields = fields.join('\n');

    const query = gql`
      query getCambialeById($id: ID!) {
        getCambialeById(id: $id) {
          ${selectedFields}
        }
      }
    `;

    return this.apollo
      .query<{ getCambialeById: Partial<CambialeDtoDetail> }>({
        query,
        variables: { id },
        fetchPolicy: 'network-only'
      })
      .pipe(map(res => res.data.getCambialeById));
  }

  // ===========================
  //   Save Cambiale
  // ===========================
  saveCambiale(input: CambialeSaveDto): Observable<CambialeDto> {
    return this.apollo
      .mutate<{ addCambiale: CambialeDto }>({
        mutation: gql`
          mutation addCambiale($dto: CambialeSaveDto!) {
            addCambiale(dto: $dto) {
              id
              amount
              creationDateFr
              operationDateFr
              protestable
              creationLocation
              referenceCode
              isPrinted
            }
          }
        `,
        variables: { dto: input },
        refetchQueries: ['getCambiales'],
        awaitRefetchQueries: true
      })
      .pipe(map(res => res.data!.addCambiale));
  }

  // ===========================
  //   Delete Cambiale
  // ===========================
  deleteCambiale(cambialeId: string): Observable<string> {
    return this.apollo
      .mutate<{ deleteCambiale: string }>({
        mutation: gql`
          mutation deleteCambiale($id: ID!) {
            deleteCambiale(id: $id)
          }
        `,
        variables: { id: cambialeId },
        refetchQueries: ['getCambiales'],
        awaitRefetchQueries: true
      })
      .pipe(map(res => res.data!.deleteCambiale));
  }

  // ===========================
  //   Print Cambiale (set isPrinted = true)
  // ===========================
  printCambiale(cambialeId: string): Observable<string> {
    return this.apollo
      .mutate<{ markAsPrinted: string }>({
        mutation: gql`
          mutation markAsPrinted($id: ID!) {
            markAsPrinted(id: $id)
          }
        `,
        variables: { id: cambialeId },
        refetchQueries: ['getCambiales'],
        awaitRefetchQueries: true
      })
      .pipe(map(res => res.data!.markAsPrinted));
  }

  // ===========================
  //   Get Cambiales by Compte ID
  // ===========================
  getCambialesByCompteId(compteId: string): Observable<CambialeDto[]> {
    return this.apollo
      .query<{ getCambialesByCompteId: CambialeDto[] }>({
        query: gql`
          query getCambialesByCompteId($compteId: ID!) {
            getCambialesByCompteId(compteId: $compteId) {
              id
              amount
              creationDateFr
              operationDateFr
              protestable
              creationLocation
              referenceCode
              isPrinted
            }
          }
        `,
        variables: { compteId },
        fetchPolicy: 'network-only'
      })
      .pipe(map(res => res.data.getCambialesByCompteId));
  }

  // ===========================
  //   Get Cambiales by Beneficiary ID
  // ===========================
  getCambialesByBeneficiaryId(beneficiaryId: string): Observable<CambialeDto[]> {
    return this.apollo
      .query<{ getCambialesByBeneficiaryId: CambialeDto[] }>({
        query: gql`
          query getCambialesByBeneficiaryId($beneficiaryId: ID!) {
            getCambialesByBeneficiaryId(beneficiaryId: $beneficiaryId) {
              id
              amount
              creationDateFr
              operationDateFr
              protestable
              creationLocation
              referenceCode
              isPrinted
            }
          }
        `,
        variables: { beneficiaryId },
        fetchPolicy: 'network-only'
      })
      .pipe(map(res => res.data.getCambialesByBeneficiaryId));
  }
}