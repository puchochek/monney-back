export class TransactionInput {
	id?: string;
	user?: string;
	date: Date;
	comment?: string;
	category: string;
	sum: number;
	isDeleted: boolean;
}