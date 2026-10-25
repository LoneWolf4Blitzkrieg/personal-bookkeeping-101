// Free articles on official sites, linked at the end of modules (the
// course's "getting stuck" help). Modules list the ids they use.

export const OFFICIAL_DOMAINS = [
  'consumerfinance.gov', 'irs.gov', 'ssa.gov', 'azdor.gov', 'azica.gov',
  'federalreserve.gov', 'bls.gov', 'investor.gov', 'fdic.gov', 'usa.gov', 'ftc.gov', 'mymoney.gov',
];

export const RESOURCES = {
  'cfpb-budget': {
    title: 'Monthly budget worksheet (Your Money, Your Goals)',
    publisher: 'Consumer Financial Protection Bureau',
    url: 'https://files.consumerfinance.gov/f/documents/cfpb_well-being_monthly-budget.pdf',
  },
  'irs-understanding-withholding': {
    title: 'Tax withholding: how to get it right',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/payments/tax-withholding',
  },
  'azica-min-wage': {
    title: 'Arizona minimum wage',
    publisher: 'Industrial Commission of Arizona',
    url: 'https://www.azica.gov/labor-minimum-wage-main-page',
  },
};

// True when a URL is https and on an official domain (or a subdomain of one).
export function isOfficialUrl(url) {
  let host;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    host = u.hostname;
  } catch {
    return false;
  }
  return OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
}
