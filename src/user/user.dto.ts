
export class ApplicationUser {
	readonly name: string;
	readonly email: string;
	readonly password?: string;
	readonly id?: string;
	readonly provider?: string;
	readonly isConfirmed: boolean;
	readonly balanceEdge: number;
	readonly sortCategoriesBy: string;
	readonly categories?: [];
	readonly transactions?: [];
}

export class LoginUser {
	readonly email: string;
	readonly password: string;
}