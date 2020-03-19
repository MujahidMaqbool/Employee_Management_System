import { Http } from '@angular/http';
import { Router } from "@angular/router";
import { Injectable } from '@angular/core';
//import * as sharedData from '../app/sharedData/sharedData.json';

@Injectable()
export class SharedService {

    // private sharedData = require('../sharedData/sharedData.json'); //../../../../SharedData/sharedData.json

    constructor(private sharedData) {
        this.sharedData = {
            "Loader": "false",
            "responseMessage": "",
            "ShowMessage": "false",
            "MessageIsSuccess": "false"
        }
    }

    public getSharedData() {
        return this.sharedData;
    }
}
