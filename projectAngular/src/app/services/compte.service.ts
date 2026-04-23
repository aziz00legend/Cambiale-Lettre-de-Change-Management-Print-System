import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CompteDto, CompteSaveInput, CompteUpdateInput } from '../entities/compte.model';

@Injectable({ providedIn: 'root' })
export class CompteService {
  constructor(private apollo: Apollo) { }

  // Get all comptes
  getAllComptes(): Observable<CompteDto[]> {
    return this.apollo
      .watchQuery<{ getAllComptes: CompteDto[] }>({
        query: gql`
          query {
            getAllComptes {
              id
              rib
              name
              cin
              city
              location
              codePostal
            }
          }
        `,
        fetchPolicy: 'cache-and-network'
      })
      .valueChanges.pipe(map(res => res.data.getAllComptes));
  }

  // Get comptes by subsidiary bank
  getComptesBySubsidiaryBankId(subsidiaryBankId: string): Observable<CompteDto[]> {
    return this.apollo
      .watchQuery<{ getComptesBySubsidiaryBankId: CompteDto[] }>({
        query: gql`
          query ($subsidiaryBankId: ID!) {
            getComptesBySubsidiaryBankId(subsidiaryBankId: $subsidiaryBankId) {
              id
              rib
              name
              cin
              city
              location
              codePostal
            }
          }
        `,
        variables: { subsidiaryBankId },
        fetchPolicy: 'cache-and-network'
      })
      .valueChanges.pipe(map(res => res.data.getComptesBySubsidiaryBankId));
  }

  // Get compte by ID
  getCompteById(id: string): Observable<CompteDto> {
    return this.apollo
      .query<{ getCompteById: CompteDto }>({
        query: gql`
          query ($id: ID!) {
            getCompteById(id: $id) {
              id
              rib
              name
              cin
              city
              location
              codePostal
            }
          }
        `,
        variables: { id }
      })
      .pipe(map(res => res.data.getCompteById));
  }

  // Add new compte
  addCompte(subsidiaryBankId: string, input: CompteSaveInput): Observable<CompteDto> {
    return this.apollo
      .mutate<{ addCompte: CompteDto }>({
        mutation: gql`
          mutation ($subsidiaryBankId: ID!, $input: CompteSaveInput!) {
            addCompte(subsidiaryBankId: $subsidiaryBankId, input: $input) {
              id
              rib
              name
              cin
              city
              location
              codePostal
            }
          }
        `,
        variables: { subsidiaryBankId, input },
        refetchQueries: ['getAllComptes', 'getComptesBySubsidiaryBankId'],
        awaitRefetchQueries: true
      })
      .pipe(map(res => res.data!.addCompte));
  }

  // Update compte
  updateCompte(compteId: string, input: CompteUpdateInput): Observable<boolean> {
    return this.apollo
      .mutate<{ updateCompte: boolean }>({
        mutation: gql`
          mutation ($compteId: ID!, $input: CompteUpdateInput!) {
            updateCompte(compteId: $compteId, input: $input)
          }
        `,
        variables: { compteId, input },
        refetchQueries: ['getAllComptes', 'getComptesBySubsidiaryBankId'],
        awaitRefetchQueries: true
      })
      .pipe(map(res => res.data!.updateCompte));
  }

  // Delete compte
  deleteCompte(compteId: string): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteCompte: boolean }>({
        mutation: gql`
          mutation ($compteId: ID!) {
            deleteCompte(compteId: $compteId)
          }
        `,
        variables: { compteId },
        refetchQueries: ['getAllComptes', 'getComptesBySubsidiaryBankId'],
        awaitRefetchQueries: true
      })
      .pipe(map(res => res.data!.deleteCompte));
  }
}
