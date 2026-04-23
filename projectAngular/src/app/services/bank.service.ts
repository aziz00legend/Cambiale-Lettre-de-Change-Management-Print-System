// src/app/services/bank.service.ts

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { BankDto, BankSaveInput, BankUpdateInput } from '../entities/bank.model';

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(private apollo: Apollo) { }

  getAllBanks(): Observable<BankDto[]> {
    return this.apollo
      .watchQuery<{ getAllBanks: BankDto[] }>({
        query: gql`
          query {
            getAllBanks {
              id
              name
              image
              codeBank
              abbreviation
            }
          }
        `,
        // Add these options to handle caching
        fetchPolicy: 'cache-and-network', // Always fetch from network
        errorPolicy: 'all'
      })
      .valueChanges.pipe(map((res) => res.data.getAllBanks));
  }

  saveBank(bank: BankSaveInput): Observable<BankDto> {
    return this.apollo.mutate<{ saveBank: BankDto }>({
      mutation: gql`
        mutation ($bankSaveInput: BankSaveInput!) {
          saveBank(bankSaveInput: $bankSaveInput) {
            id
            name
            image
            codeBank
            abbreviation
          }
        }
      `,
      variables: { bankSaveInput: bank },
      // Refetch queries after mutation
      refetchQueries: ['getAllBanks'],
      awaitRefetchQueries: true
    }).pipe(map(res => res.data!.saveBank));
  }

  updateBank(bank: BankUpdateInput): Observable<boolean> {
    return this.apollo.mutate<{ updateBank: boolean }>({
      mutation: gql`
        mutation ($bankUpdateInput: BankUpdateInput!) {
          updateBank(bankUpdateInput: $bankUpdateInput)
        }
      `,
      variables: { bankUpdateInput: bank },
      // Refetch queries after mutation
      refetchQueries: ['getAllBanks'],
      awaitRefetchQueries: true
    }).pipe(map(res => res.data!.updateBank));
  }

  deleteBank(bankId: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteBank: boolean }>({
      mutation: gql`
        mutation ($bankId: ID!) {
          deleteBank(bankId: $bankId)
        }
      `,
      variables: { bankId },
      // Refetch queries after mutation
      refetchQueries: ['getAllBanks'],
      awaitRefetchQueries: true
    }).pipe(map(res => res.data!.deleteBank));
  }
}