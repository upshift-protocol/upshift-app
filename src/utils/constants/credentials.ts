import type { Auth } from 'googleapis';
import { google } from 'googleapis';

// interfaces
interface IGSheet {
  id?: string;
  range?: string;
  getClient: () => Promise<Auth.JWT>;
}

// constants
const private_key = process.env.NEXT_PUBLIC_GSHEET_PK;

const client_email = process.env.NEXT_PUBLIC_GSHEET_SERVICER;

// globally exported obj
const GSHEET: IGSheet = {
  id: process.env.NEXT_PUBLIC_GSHEET_ID,
  range: process.env.NEXT_PUBLIC_GSHEET_RANGE, // Adjust range as needed
  getClient: async () => {
    const auth = new google.auth.JWT(client_email, undefined, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);
    return auth;
  },
};

export default GSHEET;
