import { JwtPayload } from 'jsonwebtoken';

export interface BulkLinkData {
  originalUrl: string;
  prefix?: string | null;
  suffix?: string | null;
  linkTag1?: string | null;
  linkTag2?: string | null;
  linkTag3?: string | null;
  linkTag4?: string | null;
  linkTag5?: string | null;
}

export interface PlanDetails {
  price: number;
  clicksLimit: number;
}

export interface DecodedToken extends JwtPayload {
  id: string;
}
