import { jwtDecode, JwtPayload } from "jwt-decode";
import { KeycloakService } from "keycloak-angular";

export class LeoUser {
    constructor(public readonly firstName: string | null,
        public readonly lastName: string | null,
        public readonly username: string | null,
        public readonly role: Role | null) {
    }

    public get fullName(): string | null {
        if (this.firstName === null || this.lastName === null) {
            return null;
        }
        return `${this.firstName} ${this.lastName}`;
    }

    public hasRole(role: Role): boolean {
        if (this.role === null) {
            return false;
        }
        return this.role === role;
    }
}

export enum Role {
    Unknown = 0,
    Student = 1,
    Teacher = 2,
    TestUser = 3
}

export async function createLeoUser(keycloakService: KeycloakService): Promise<LeoUser> {
    const token = await decode(keycloakService);
    const values = getValues(token);

    return new LeoUser(values.firstName, values.lastName, values.username, values.role);
}

async function decode(keycloakService: KeycloakService): Promise<JwtPayload> {
    const rawToken = await keycloakService.getToken();
    return jwtDecode(rawToken);
}

function getValues(token: JwtPayload): IValues {
    const raw = token as any;
    const values: IValues = {
        firstName: null,
        lastName: null,
        username: null,
        role: null
    };
    const defaultConverter = (rawValue: string) => rawValue;

    trySetValue<string>("given_name", value => values.firstName = value, defaultConverter);
    trySetValue<string>("family_name", value => values.lastName = value, defaultConverter);
    trySetValue<string>("preferred_username", value => values.username = value, defaultConverter);
    trySetValue("LDAP_ENTRY_DN", value => values.role = value, ldapToRole);

    return values;

    function trySetValue<T>(propertyName: string, setter: (value: T) => void, converter: (rawValue: string) => T) {
        try {
            if (raw[propertyName]) {
                const value: T = converter(raw[propertyName]);
                setter(value);
            }
        } catch (e) {
            console.error(`Failed to set leo user value for ${propertyName}.`, e);
        }
    }

    function ldapToRole(ldap: string): Role {
        const prefix = "OU=";
        if (ldap.includes(`${prefix}Students`)) {
            return Role.Student;
        }
        if (ldap.includes(`${prefix}Teachers`)) {
            return Role.Teacher;
        }
        if (ldap.includes(`${prefix}TestUsers`)) {
            return Role.TestUser;
        }

        return Role.Unknown;
    }
}

interface IValues {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    role: Role | null;
}