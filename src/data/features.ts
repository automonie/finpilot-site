// Per-feature marketing pages. Honest copy only — Automonie reads your money, it
// doesn't move it (no wallet/auto-save claims at launch). Each renders at
// /features/<slug> with its own SEO. Keep titleTag ≤60 and description ≤155.
export type Feature = {
  slug: string;
  title: string;
  titleTag: string;
  description: string;
  lead: string;
  points: { h: string; p: string }[];
};

export const features: Feature[] = [
  {
    slug: 'transactions',
    title: 'Every transaction, sorted for you',
    titleTag: 'Transaction tracking — Automonie',
    description: 'Import your statement or scan your SMS alerts and Automonie sorts every transaction into real categories, automatically.',
    lead: 'The foundation of everything: a clean, categorised record of every naira in and out — built from your statements and bank alerts, not by hand.',
    points: [
      { h: 'Import in seconds', p: 'Upload a statement (PDF, CSV or Excel) or scan your SMS alerts. Even password-protected statements work.' },
      { h: 'Automatic categories', p: 'Each transaction is sorted into a real category. Fix one and it learns — the next import gets it right.' },
      { h: 'Honest numbers', p: 'Transfers between your own accounts, cash withdrawals and reversals are kept out of your spending, so the totals are true.' },
    ],
  },
  {
    slug: 'budgets',
    title: 'Budgets that warn you early',
    titleTag: 'Budgeting — Automonie',
    description: 'Set limits per category and Automonie shows you where you stand — bars turn amber at 80% and red before you overspend.',
    lead: 'A budget is only useful if it tells you before you go over. Automonie shows you exactly where you stand, all month.',
    points: [
      { h: 'Set it once', p: 'Choose a limit for the categories that matter to you. Everything else just tracks quietly.' },
      { h: 'See trouble coming', p: 'Each bar fills as you spend — amber at 80%, red once you go over — so nothing is a surprise on payday.' },
      { h: 'Built from real spend', p: 'Budgets track against your actual, categorised transactions — not a guess.' },
    ],
  },
  {
    slug: 'goals',
    title: 'Goals you can track',
    titleTag: 'Savings goals — Automonie',
    description: 'Set a target, log what you set aside, and watch the progress. Automonie tracks your goals — you stay in control of your money.',
    lead: 'Name what you’re saving for, set a target, and log your progress. Automonie keeps score; your money stays yours.',
    points: [
      { h: 'A clear target', p: 'Set an amount and a date. See how close you are at a glance.' },
      { h: 'Log a contribution', p: 'Record what you’ve set aside and watch the bar move. Automonie tracks it — it never moves your money for you.' },
      { h: 'Momentum you can feel', p: 'Small, visible progress is what keeps a goal alive.' },
    ],
  },
  {
    slug: 'bills',
    title: 'Never forget a bill again',
    titleTag: 'Bill reminders — Automonie',
    description: 'Automonie spots your recurring bills and subscriptions and reminds you before they’re due, so nothing catches you off guard.',
    lead: 'The quiet money-drainers are the ones you forget. Automonie surfaces your recurring bills and subscriptions and reminds you in time.',
    points: [
      { h: 'Spotted automatically', p: 'Recurring charges are detected from your history, so you see the subscriptions you forgot you had.' },
      { h: 'Reminders that land', p: 'Get a nudge before a bill is due — mark it paid to keep your record straight.' },
      { h: 'No surprises', p: 'See what’s coming up so payday isn’t a shock.' },
    ],
  },
  {
    slug: 'insights',
    title: 'Understand your money',
    titleTag: 'Money insights — Automonie',
    description: 'See where your money actually goes each month — your top categories, your money personality, and a plain-English read on your spending.',
    lead: 'Numbers you can act on: where your money went, what it says about you, and a witty, honest read on the month.',
    points: [
      { h: 'Where it went', p: 'Your month, broken down by category — the truth, in seconds.' },
      { h: 'Your money personality', p: 'A shareable read on how you spend, built from your own patterns.' },
      { h: 'A streak worth keeping', p: 'Check in daily and build a clarity streak — the habit that changes everything.' },
    ],
  },
];
