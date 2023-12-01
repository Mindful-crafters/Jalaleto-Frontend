import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Shared {
    private hashStringToken: string;
    private hashStringEmail: string;
    private resetEmail: string;

    constructor() { }

    get getHashString() { return this.hashStringToken; }
    get getHashStringEmail() { return this.hashStringEmail; }
    get getEmail() { return this.resetEmail; }

    setHashString(token: string) {
        this.hashStringToken = token;
    }

    setHashStringEmail(hashString: string) {
        this.hashStringEmail = hashString;
    }

    setEmail(email: string) {
        this.resetEmail = email;
    }
}