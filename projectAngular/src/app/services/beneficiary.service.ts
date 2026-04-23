import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    BeneficiaryDto,
    BeneficiarySaveInput,
    BeneficiaryUpdateInput
} from '../entities/beneficiary.model';

@Injectable({ providedIn: 'root' })
export class BeneficiaryService {
    constructor(private apollo: Apollo) { }

    // --------------------------------------------
    // GET ALL BENEFICIARIES
    // --------------------------------------------
    getAllBeneficiaries(): Observable<BeneficiaryDto[]> {
        return this.apollo
            .watchQuery<{ getAllBeneficiaries: BeneficiaryDto[] }>({
                query: gql`
          query getAllBeneficiaries {
            getAllBeneficiaries {
              id
              drawer
              payToOrderOf
            }
          }
        `,
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'all'
            })
            .valueChanges.pipe(map((res) => res.data.getAllBeneficiaries));
    }

    // --------------------------------------------
    // GET ONE BENEFICIARY BY ID
    // --------------------------------------------
    getBeneficiaryById(beneficiaryId: string): Observable<BeneficiaryDto> {
        return this.apollo
            .watchQuery<{ getBeneficiaryById: BeneficiaryDto }>({
                query: gql`
          query ($beneficiaryId: ID!) {
            getBeneficiaryById(beneficiaryId: $beneficiaryId) {
              id
              drawer
              payToOrderOf
            }
          }
        `,
                variables: { beneficiaryId },
                fetchPolicy: 'network-only'
            })
            .valueChanges.pipe(map((res) => res.data.getBeneficiaryById));
    }

    // --------------------------------------------
    // CREATE BENEFICIARY
    // --------------------------------------------
    saveBeneficiary(input: BeneficiarySaveInput): Observable<BeneficiaryDto> {
        return this.apollo
            .mutate<{ saveBeneficiary: BeneficiaryDto }>({
                mutation: gql`
          mutation ($beneficiarySaveDto: BeneficiarySaveInput!) {
            saveBeneficiary(beneficiarySaveDto: $beneficiarySaveDto) {
              id
              drawer
              payToOrderOf
            }
          }
        `,
                variables: { beneficiarySaveDto: input },
                refetchQueries: ['getAllBeneficiaries'],
                awaitRefetchQueries: true
            })
            .pipe(map((res) => res.data!.saveBeneficiary));
    }

    // --------------------------------------------
    // UPDATE BENEFICIARY
    // --------------------------------------------
    updateBeneficiary(input: BeneficiaryUpdateInput): Observable<boolean> {
        return this.apollo
            .mutate<{ updateBeneficiary: boolean }>({
                mutation: gql`
          mutation ($beneficiaryDto: BeneficiaryUpdateInput!) {
            updateBeneficiary(beneficiaryDto: $beneficiaryDto)
          }
        `,
                variables: { beneficiaryDto: input },
                refetchQueries: ['getAllBeneficiaries'],
                awaitRefetchQueries: true
            })
            .pipe(map((res) => res.data!.updateBeneficiary));
    }

    // --------------------------------------------
    // DELETE BENEFICIARY
    // --------------------------------------------
    deleteBeneficiary(beneficiaryId: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteBeneficiary: boolean }>({
                mutation: gql`
          mutation ($beneficiaryId: ID!) {
            deleteBeneficiary(beneficiaryId: $beneficiaryId)
          }
        `,
                variables: { beneficiaryId },
                refetchQueries: ['getAllBeneficiaries'],
                awaitRefetchQueries: true
            })
            .pipe(map((res) => res.data!.deleteBeneficiary));
    }
}
