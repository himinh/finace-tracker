export interface ITransaction {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  description: string;
  category: string;
}
