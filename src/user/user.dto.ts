
export class ApplicationUser {
	readonly name: string;
	readonly email: string;
	readonly password?: string;
	readonly id?: string;
	readonly provider?: string;
	readonly isConfirmed: boolean;
	readonly balanceEdge: boolean;
}

export class LoginUser {
	readonly email: string;
	readonly password: string;
}