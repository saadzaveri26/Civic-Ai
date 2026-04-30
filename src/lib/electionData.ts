export interface ElectionStep {
  id: string;
  stepNumber: number;
  title: string;
  icon: string;
  summary: string;
  details: string;
  keyFacts: string[];
  duration: string;
}

export const ELECTION_STEPS: ElectionStep[] = [
  {
    id: "voter-registration",
    stepNumber: 1,
    title: "Voter Registration",
    icon: "ClipboardCheck",
    summary: "Deadlines, eligibility, and how to register to vote.",
    details:
      "Every citizen aged 18 or above on the qualifying date is eligible to register as a voter. The Election Commission conducts special drives for voter registration. You can register online through the National Voter Service Portal (NVSP) or by submitting Form 6 at your local Electoral Registration Officer's office. Photo identity is required, and your name must appear on the electoral roll to vote.",
    keyFacts: [
      "Minimum age: 18 years",
      "Register via NVSP or Form 6",
      "Photo ID required (EPIC card)",
      "Check electoral roll before election day",
    ],
    duration: "Ongoing — verify 30 days before election",
  },
  {
    id: "candidate-nomination",
    stepNumber: 2,
    title: "Candidate Nomination",
    icon: "UserCheck",
    summary: "Who can run for office and the nomination process.",
    details:
      "Any registered voter can contest elections, subject to age requirements (25 for Lok Sabha/State Assembly). Candidates must file nomination papers with the Returning Officer, pay a security deposit, and have their papers scrutinized. The deposit is forfeited if the candidate fails to secure 1/6th of valid votes. Independent candidates and party nominees follow the same process.",
    keyFacts: [
      "Minimum age: 25 years for Parliament",
      "Security deposit required",
      "Nominations scrutinized by Returning Officer",
      "Withdrawal window available after filing",
    ],
    duration: "1–2 weeks for filing and scrutiny",
  },
  {
    id: "campaign-period",
    stepNumber: 3,
    title: "Campaign Period",
    icon: "Megaphone",
    summary: "Rules, funding, debates, and the Model Code of Conduct.",
    details:
      "Once elections are announced, the Model Code of Conduct (MCC) comes into effect. Parties and candidates campaign through rallies, door-to-door visits, media advertisements, and social media. There are strict spending limits — ₹95 lakh for Lok Sabha and ₹40 lakh for Assembly elections. Campaigning must stop 48 hours before polling day (silence period).",
    keyFacts: [
      "Model Code of Conduct enforced",
      "Spending limits strictly monitored",
      "48-hour silence period before voting",
      "No hate speech or communal appeals",
    ],
    duration: "2–3 weeks typically",
  },
  {
    id: "voting-day",
    stepNumber: 4,
    title: "Voting Day",
    icon: "Vote",
    summary: "Polling booths, EVMs, VVPAT, and the voting process.",
    details:
      "On voting day, registered voters visit their assigned polling station with valid ID. Votes are cast using Electronic Voting Machines (EVMs) with VVPAT (Voter Verifiable Paper Audit Trail) for verification. Each voter's finger is marked with indelible ink to prevent duplicate voting. Polling hours are typically 7 AM to 6 PM, and voters in queue by 6 PM are allowed to vote.",
    keyFacts: [
      "Carry valid photo ID to polling station",
      "EVM + VVPAT ensures transparency",
      "Indelible ink prevents double voting",
      "NOTA option available on ballot",
    ],
    duration: "1 day (7 AM – 6 PM typically)",
  },
  {
    id: "vote-counting",
    stepNumber: 5,
    title: "Vote Counting",
    icon: "Calculator",
    summary: "How votes are counted and the role of observers.",
    details:
      "Counting typically takes place a few days after polling. EVMs are stored in strong rooms under CCTV and armed guard. On counting day, EVMs are opened in the presence of candidates' agents and Election Commission observers. Postal ballots are counted first, followed by EVM results round by round. VVPAT slips of randomly selected booths are matched with EVM totals for verification.",
    keyFacts: [
      "EVMs stored in secure strong rooms",
      "Counting in presence of observers",
      "Postal ballots counted first",
      "VVPAT verification of random booths",
    ],
    duration: "1–2 days for counting",
  },
  {
    id: "result-declaration",
    stepNumber: 6,
    title: "Result Declaration",
    icon: "Trophy",
    summary: "Announcement process, margins, and certification.",
    details:
      "The Returning Officer declares results after counting is complete. The candidate with the most votes wins (First Past the Post system). Results are published on the Election Commission website in real time. A certificate of election is issued to winning candidates. In case of a tie, a fresh election is held for that constituency.",
    keyFacts: [
      "First Past the Post system",
      "Results published in real time",
      "Certificate of election issued",
      "Tie leads to fresh election",
    ],
    duration: "Same day as counting",
  },
  {
    id: "legal-challenges",
    stepNumber: 7,
    title: "Legal Challenges",
    icon: "Scale",
    summary: "Election petitions, timelines, and dispute resolution.",
    details:
      "Any voter or candidate can challenge election results by filing an Election Petition in the High Court within 45 days of result declaration. Grounds include corrupt practices, non-compliance with electoral law, or disqualification of the winning candidate. The High Court's decision can be appealed to the Supreme Court. Courts aim to resolve petitions within 6 months.",
    keyFacts: [
      "Petition must be filed within 45 days",
      "Filed in the respective High Court",
      "Appeal possible to Supreme Court",
      "Target resolution: 6 months",
    ],
    duration: "45 days filing window, 6 months resolution target",
  },
  {
    id: "government-formation",
    stepNumber: 8,
    title: "Government Formation",
    icon: "Landmark",
    summary: "Majority, coalition building, and oath of office.",
    details:
      "After results, the party or coalition with a majority (more than half the seats) is invited by the President/Governor to form the government. The leader of the majority party becomes the Prime Minister (or Chief Minister at state level). Ministers are sworn in, and the new government must prove its majority on the floor of the House through a trust vote if required.",
    keyFacts: [
      "Simple majority needed to form government",
      "Leader sworn in as PM/CM",
      "Trust vote may be required",
      "Coalition governments are common",
    ],
    duration: "Days to weeks after results",
  },
];
