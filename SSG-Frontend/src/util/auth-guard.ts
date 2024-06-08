import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { createLeoUser, Role } from "./leo-token";

@Injectable({ providedIn: 'root' })
export class AuthGuard extends KeycloakAuthGuard {
    constructor(
        router: Router,
        keycloak: KeycloakService
    ) {
        super(router, keycloak);
    }

    public async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        // Force the user to log in if crrently unauthenticated.
        if (!this.authenticated) {
            await this.keycloakAngular.login({
                redirectUri: window.location.origin + state.url
            });
        }

        // Get the roles required from the route.
        const requiredRoles: Role[] = route.data["roles"];

        // Allow the user to proceed if no additional roles are required to access the route.
        if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
            return true;
        }

        const leoUser = await createLeoUser(this.keycloakAngular);

        // Allow the user to proceed if all the required roles are present.
        return requiredRoles.some((role) => leoUser.hasRole(role));
    }
}