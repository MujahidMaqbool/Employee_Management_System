import { Component, Injectable, OnInit } from '@angular/core';
import { ReimbursementService } from '../../services/reimbursementService';

@Component({
    selector: 'Reimbursement',
    templateUrl: './reimbursement.component.template.html'
})


export class ReimbursementComponent implements OnInit {

    FromDate: Date = new Date();
    ToDate: Date = new Date();

    constructor(private _reimbursementService: ReimbursementService) {
    }
    ngOnInit() {

    }
}