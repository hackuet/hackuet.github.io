// MOCK DATA — realistic stand-ins written for the prototype.
// Replace every value in this file with the club's real details before launch;
// nothing else in the app hard-codes club content.

import type { Hue } from '@/components/DieArt'

export const club = {
  short: 'HACK',
  name: 'Hardware Acceleration Club of KUET',
  university: 'Khulna University of Engineering & Technology',
  tagline: 'We make computation faster by building the hardware underneath it.',
  description:
    'HACK is the student club at KUET for FPGAs, GPUs and custom digital design. Members learn Verilog, build accelerators and compete nationally.',
  founded: 2022,
  email: 'hack@kuet.ac.bd',
  room: 'Digital Systems Lab, Room 304, EEE Building',
  address: 'KUET, Fulbarigate, Khulna 9203, Bangladesh',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khulna+University+of+Engineering+%26+Technology',
  meets: 'Thursdays, 5:00 PM',
  intake: 'Spring 2027 intake',
  intakeCloses: '30 November 2026',
}

export type Slide = {
  id: string
  label: string
  eyebrow: string
  title: string
  body: string
  figure: string
  seed: number
  hue: Hue
  image?: string
}

export const slides: Slide[] = [
  {
    id: 'club',
    label: 'The club',
    eyebrow: 'Hardware Acceleration Club of KUET',
    title: 'Software hits a wall. We build what gets past it.',
    body: 'HACK is where KUET students design the FPGA circuits, GPU kernels and custom chips that make heavy computation run fast.',
    figure: 'Floorplan of the student-built RISC-V core',
    seed: 11,
    hue: 'navy',
  },
  {
    id: 'learn',
    label: 'Learn',
    eyebrow: 'Weekly sessions',
    title: 'From your first line of Verilog to a working board.',
    body: 'Every Thursday a senior member teaches one idea, then you wire it up on real hardware before you leave the lab.',
    figure: 'Thursday session: pipelined multiplier on a Basys 3',
    seed: 23,
    hue: 'blue',
  },
  {
    id: 'compete',
    label: 'Compete',
    eyebrow: 'Contest teams',
    title: 'Small teams, hard problems, national stages.',
    body: 'We field teams for digital design and embedded contests across Bangladesh, and we review every loss as carefully as every win.',
    figure: 'Contest build: image-filter accelerator, 2025',
    seed: 37,
    hue: 'cyan',
  },
  {
    id: 'join',
    label: 'Join',
    eyebrow: 'Spring 2027 intake',
    title: 'No experience needed. Curiosity is the entry requirement.',
    body: 'Registration is open to every KUET department until 30 November 2026. It takes about two minutes.',
    figure: 'Your member pass artwork is generated from your roll number',
    seed: 52,
    hue: 'sky',
  },
]

export const history = {
  title: 'Four years, starting from one borrowed board.',
  lede: 'HACK began as five students sharing a single FPGA kit after class. It is now a recognised KUET club with its own lab bench and a weekly teaching programme.',
  milestones: [
    {
      year: '2022',
      title: 'One borrowed board',
      body: 'Five EEE and CSE students start meeting on Thursday evenings around a Basys 3 kit borrowed from the Digital Systems Lab.',
    },
    {
      year: '2023',
      title: 'Recognised by the university',
      body: 'The club is formally registered with a faculty moderator, elects its first committee and runs “Verilog from Zero” for 60 first-years.',
    },
    {
      year: '2024',
      title: 'First national final',
      body: 'A three-person team reaches the final of a national digital design contest with a hardware image-filter pipeline.',
    },
    {
      year: '2025',
      title: 'A bench of our own',
      body: 'The department allocates a permanent bench and six FPGA boards. The club hosts its first intra-university hardware sprint.',
    },
    {
      year: '2026',
      title: 'Building a processor',
      body: 'Members begin a year-long project: a small RISC-V core, written, verified and run on an FPGA entirely by students.',
    },
  ],
}

export const mission = {
  statement:
    'Give every KUET student who is curious about hardware a place to learn it by building: real boards, patient seniors and problems worth solving.',
  commitments: [
    {
      title: 'Teach from zero',
      body: 'Weekly sessions assume no background. Seniors teach what they learned the year before.',
    },
    {
      title: 'Build real things',
      body: 'Every term ends with working hardware on a bench, not slides about hardware.',
    },
    {
      title: 'Share the work',
      body: 'Designs, notes and post-mortems stay open to the next batch.',
    },
  ],
}

export const vision = {
  statement:
    'A KUET where designing a chip feels as reachable to a student as writing an app, and where Bangladesh’s next hardware engineers get their start.',
  goals: [
    {
      title: 'A processor of our own',
      body: 'Finish the student-built RISC-V core and teach the first-year course on top of it.',
    },
    {
      title: 'A board for every member',
      body: 'Grow the bench until nobody has to wait a week for their turn on hardware.',
    },
    {
      title: 'Work that reaches industry',
      body: 'Send members into internships and research groups with designs they can show.',
    },
  ],
}

export type Achievement = {
  id: string
  year: string
  title: string
  event: string
  result: string
}

export const achievements: Achievement[] = [
  {
    id: 'a1',
    year: '2026',
    title: 'Real-time edge detection on a Zynq-7000',
    event: 'National Digital Design Contest, Dhaka',
    result: 'Champion',
  },
  {
    id: 'a2',
    year: '2025',
    title: 'GPU-accelerated flood simulation of the Rupsha basin',
    event: 'Inter-University Project Showcase, Khulna',
    result: '1st runner-up',
  },
  {
    id: 'a3',
    year: '2025',
    title: 'Low-power CNN inference on a Lattice iCE40',
    event: 'IEEE student conference, Rajshahi',
    result: 'Paper accepted',
  },
  {
    id: 'a4',
    year: '2024',
    title: 'Streaming image-filter pipeline in Verilog',
    event: 'National Digital Design Contest, Dhaka',
    result: 'Finalist',
  },
]

export type Photo = {
  id: string
  title: string
  date: string
  seed: number
  hue: Hue
  image?: string
}

export const gallery: Photo[] = [
  { id: 'g1', title: 'Verilog from Zero, day one', date: 'February 2026', seed: 101, hue: 'navy' },
  { id: 'g2', title: 'RISC-V core review night', date: 'August 2026', seed: 102, hue: 'sky' },
  { id: 'g3', title: 'Contest team at the Dhaka final', date: 'May 2026', seed: 103, hue: 'blue' },
  { id: 'g4', title: 'Soldering clinic for first-years', date: 'March 2026', seed: 104, hue: 'cyan' },
  { id: 'g5', title: 'Hardware sprint demo table', date: 'November 2025', seed: 105, hue: 'sky' },
  { id: 'g6', title: 'New bench, six new boards', date: 'January 2025', seed: 106, hue: 'navy' },
]

export const tracks = [
  { id: 'fpga', title: 'FPGA & digital design', note: 'Verilog, timing, getting designs onto boards' },
  { id: 'gpu', title: 'GPU & parallel computing', note: 'CUDA, OpenCL, making code scale' },
  { id: 'arch', title: 'Computer architecture', note: 'RISC-V, pipelines, how a CPU is built' },
  { id: 'embedded', title: 'Embedded systems', note: 'Microcontrollers, sensors, firmware' },
] as const

export type TrackId = (typeof tracks)[number]['id']

export const departments = [
  'CSE', 'EEE', 'ECE', 'ME', 'CE', 'IEM', 'BME', 'MSE', 'MTE', 'ESE', 'ChE', 'TE', 'LE', 'URP', 'BECM', 'Arch',
]

export const batches = ['2k25', '2k24', '2k23', '2k22', '2k21']

export type Member = {
  id: string
  name: string
  title: string
  department: string
  batch: string
  seed: number
  hue: Hue
  /** Path to a portrait in /public, e.g. '/team/president.jpg'. Artwork is shown until one is set. */
  image?: string
}

export const team: Member[] = [
  { id: 'president', name: 'Tahmid Hasan', title: 'President', department: 'EEE', batch: '2k21', seed: 211, hue: 'navy' },
  { id: 'vp', name: 'Nusrat Jahan Mim', title: 'Vice President', department: 'CSE', batch: '2k21', seed: 212, hue: 'blue' },
  { id: 'gs', name: 'Sadman Sakib', title: 'General Secretary', department: 'ECE', batch: '2k22', seed: 213, hue: 'cyan' },
  { id: 'treasurer', name: 'Farhana Akter', title: 'Treasurer', department: 'EEE', batch: '2k22', seed: 214, hue: 'navy' },
  { id: 'org', name: 'Rakibul Islam', title: 'Organising Secretary', department: 'CSE', batch: '2k22', seed: 215, hue: 'blue' },
  { id: 'tech', name: 'Anika Tabassum', title: 'Technical Lead', department: 'ECE', batch: '2k23', seed: 216, hue: 'cyan' },
]

export type ClubEvent = {
  id: string
  /** ISO date of the (first) day. */
  date: string
  when: string
  title: string
  place: string
  body: string
}

export const events: ClubEvent[] = [
  {
    id: 'e1',
    date: '2026-10-15',
    when: '15 Oct 2026, 5:00 PM',
    title: 'Verilog from Zero: first session of the term',
    place: 'Digital Systems Lab, Room 304',
    body: 'The first of eight weekly sessions for beginners. Bring a laptop; boards are provided.',
  },
  {
    id: 'e2',
    date: '2026-11-13',
    when: '13 to 14 Nov 2026',
    title: 'Hardware Sprint 2026',
    place: 'EEE Building, KUET',
    body: 'A 24-hour build for teams of three. One problem statement, one FPGA board per team, demos on Saturday evening.',
  },
  {
    id: 'e3',
    date: '2026-12-03',
    when: '3 Dec 2026, 5:00 PM',
    title: 'RISC-V core: open design review',
    place: 'Digital Systems Lab, Room 304',
    body: 'The processor team walks through the pipeline they have built so far and takes questions from anyone.',
  },
  {
    id: 'e4',
    date: '2026-08-20',
    when: '20 Aug 2026',
    title: 'GPU computing with CUDA: a one-day workshop',
    place: 'CSE Seminar Room, KUET',
    body: 'An introduction to parallel programming on GPUs, ending with a matrix-multiply speed contest.',
  },
  {
    id: 'e5',
    date: '2026-03-12',
    when: '12 Mar 2026',
    title: 'Soldering clinic for first-years',
    place: 'Digital Systems Lab, Room 304',
    body: 'Forty first-year students assembled and tested their first through-hole board.',
  },
  {
    id: 'e6',
    date: '2025-11-21',
    when: '21 to 22 Nov 2025',
    title: 'Hardware Sprint 2025',
    place: 'EEE Building, KUET',
    body: 'The first intra-university sprint: twelve teams, with a traffic-signal controller as the winning build.',
  },
]

// The four section routes. The address is the site's recurring label motif.
export const routes = [
  { href: '/achievements', label: 'Achievements', addr: '0x05', blurb: 'Contest results and published work.' },
  { href: '/events', label: 'Events', addr: '0x06', blurb: 'Workshops, sprints and what is coming next.' },
  { href: '/gallery', label: 'Gallery', addr: '0x07', blurb: 'Sessions, builds and contest days.' },
  { href: '/executive-board', label: 'Executive Board', addr: '0x08', blurb: 'The students running the club this year.' },
]

// Header and footer links: general information lives on the front page, the rest are routes.
export const nav = [
  { href: '/#history', label: 'About', addr: '0x01' },
  ...routes.map(({ href, label, addr }) => ({ href, label, addr })),
  { href: '/#contact', label: 'Contact', addr: '0x09' },
]
