import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Shared {
    private hashString: string;

    constructor() { }

    get getHashString() { return this.hashString; }

    setHashString(token: string) {
        this.hashString = token;
    }
}
