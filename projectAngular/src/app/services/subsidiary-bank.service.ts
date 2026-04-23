
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  SubsidiaryBankDto,
  SubsidiaryBankSaveInput,
  SubsidiaryBankUpdateInput
} from '../entities/subsidiary-bank.model';

@Injectable({ providedIn: 'root' })
export class SubsidiaryBankService {
  constructor(private apollo: Apollo) { }

  getSubsidiaryBanksByBankId(bankId: string): Observable<SubsidiaryBankDto[]> {
    return this.apollo
      .watchQuery<{ getSubsidiaryBanksByBankId: SubsidiaryBankDto[] }>({
        query: gql`
          query ($bankId: ID!) {
            getSubsidiaryBanksByBankId(bankId: $bankId) {
              id
              codeSubsidiary
              name
              location
            }
          }
        `,
        variables: { bankId },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(map(res => res.data.getSubsidiaryBanksByBankId));
  }

  saveSubsidiaryBank(bankId: string, saveDTO: SubsidiaryBankSaveInput): Observable<SubsidiaryBankDto> {
    return this.apollo.mutate<{ addSubsidiaryBank: SubsidiaryBankDto }>({
      mutation: gql`
        mutation ($bankId: ID!, $saveDTO: SubsidiaryBankSaveDTO!) {
          addSubsidiaryBank(bankId: $bankId, saveDTO: $saveDTO) {
            id
            codeSubsidiary
            name
            location
          }
        }
      `,
      variables: { bankId, saveDTO },
      refetchQueries: ['getSubsidiaryBanksByBankId'],
      awaitRefetchQueries: true
    }).pipe(map(res => res.data!.addSubsidiaryBank));
  }

  updateSubsidiaryBank(subsidiaryBankId: string, updateDTO: SubsidiaryBankUpdateInput): Observable<boolean> {
    return this.apollo.mutate<{ updateSubsidiaryBank: boolean }>({
      mutation: gql`
        mutation ($subsidiaryBankId: ID!, $updateDTO: SubsidiaryBankUpdateDTO!) {
          updateSubsidiaryBank(subsidiaryBankId: $subsidiaryBankId, updateDTO: $updateDTO)
        }
      `,
      variables: { subsidiaryBankId, updateDTO },
      refetchQueries: ['getSubsidiaryBanksByBankId'],
      awaitRefetchQueries: true
    }).pipe(map(res => res.data!.updateSubsidiaryBank));
  }

  deleteSubsidiaryBank(subsidiaryBankId: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteSubsidiaryBank: boolean }>({
      mutation: gql`
        mutation ($subsidiaryBankId: ID!) {
          deleteSubsidiaryBank(subsidiaryBankId: $subsidiaryBankId)
        }
      `,
      variables: { subsidiaryBankId },
      refetchQueries: ['getSubsidiaryBanksByBankId'],
      awaitRefetchQueries: true
    }).pipe(map(res => res.data!.deleteSubsidiaryBank));
  }
}
