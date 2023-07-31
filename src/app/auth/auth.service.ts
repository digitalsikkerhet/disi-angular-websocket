import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription, take } from "rxjs";
import { OidcSecurityService } from "angular-auth-oidc-client";


@Injectable()
export class AuthService implements OnDestroy {
    private _checkAuthSubscription!: Subscription;
    public isAuthenticated = new BehaviorSubject(false);
    private configId: string | undefined;
    public userData: any;
    public accessToken!: string;
    public idToken!: string;    

   /**
    * constructor
    */
    constructor(private oidcSecurityService: OidcSecurityService) {
        this._checkAuthSubscription = this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken, configId }) => {
            this.isAuthenticated.next(isAuthenticated);
            this.userData = userData;
            this.accessToken = accessToken;
            this.idToken = idToken;
            this.configId = configId;
        });
    }

   /**
    * constructor
    */
    ngOnDestroy(): void {
        if(this._checkAuthSubscription && !this._checkAuthSubscription.closed) {
            this._checkAuthSubscription.unsubscribe();
        }
    }

    /**
     * login
     */
    public login(): void {
        this.oidcSecurityService.authorize(this.configId);
    }

    /**
     * logout
     */
    public logout(): void {
        this.oidcSecurityService.logoffAndRevokeTokens(this.configId).pipe(take(1)).subscribe((result) => {
            console.log(result);
        });
    }
}
