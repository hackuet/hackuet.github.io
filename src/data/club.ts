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

export const batches = ['2K25', '2K24', '2K23', '2K22', '2K21']

export type Member = {
  id: string
  name: string
  title: string
  department?: string
  designation?: string
  roll?: string
  batch?: string
  seed: number
  hue: Hue
  /** Path to a portrait or Sanity CDN URL. Artwork is shown until one is set. */
  image?: string
  initials?: string
}

export const committeeTitle = 'Organizing Committee - 2026'

const hues: Hue[] = ['navy', 'blue', 'cyan', 'sky']

export const team: Member[] = [
  // Moderator
  { id: 'moderator-1', name: 'Md. Repon Islam', title: 'Moderator', designation: 'Assistant Professor, Dept. of CSE, KUET', seed: 301, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/1716ecfbfa34cd4dae824401767eeedd1287f1dd-827x866.webp' },
  // Advisor
  { id: 'advisor-1', name: 'Dr. Muhammad Sheikh Sadi', title: 'Advisor', designation: 'Professor, Dept. of CSE, KUET', seed: 302, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/c23a723f2e98527aeaaf4c5eb22ed39af74fd852-761x790.webp' },
  // Co-Moderator
  { id: 'co-moderator-1', name: 'Md. Badiuzzaman Shuvo', title: 'Co-Moderator', designation: 'Assistant Professor, Dept. of CSE, KUET', seed: 303, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/843c93779cf5ccdfa71dad9b86d91d642757a08e-608x946.webp' },
  // President
  { id: 'president-1', name: 'Abdullah Al Noman', title: 'President', roll: '2107105', batch: '2K21', seed: 304, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/6b0868a4cef1b45e56a4eb3e31e9ba8b70341572-578x779.webp' },
  // Vice President
  { id: 'vp-1', name: 'Mustafizur Rahman', title: 'Vice President', roll: '2107058', batch: '2K21', seed: 305, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/4e26c6d303b3144dea4135de4ffeba8779856ff9-659x923.webp' },
  { id: 'vp-2', name: 'Tawhidul Hasan', title: 'Vice President', roll: '2107004', batch: '2K21', seed: 306, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/ada50ed06b5fd5166994b3c51e66ad2413fd9d06-630x939.webp' },
  { id: 'vp-3', name: 'Tahmid Hossain Chowdhury Mahin', title: 'Vice President', roll: '2207109', batch: '2K22', seed: 307, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/f28457303c7087f4e592c532c9fe0cf95bf387aa-619x886.webp' },
  { id: 'vp-4', name: 'Saleh Sadid Mir', title: 'Vice President', roll: '2207024', batch: '2K22', seed: 308, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/af7a12b19543221640ae951bf4e0fcc5812dfc8c-633x954.webp' },
  // General Secretary
  { id: 'gs-1', name: 'Sheikh Md. Galib Mahim', title: 'General Secretary', roll: '2107020', batch: '2K21', seed: 309, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/f500f78ff3fb4cbd0644a999815aedbb24d55ee3-707x946.webp' },
  // Assistant General Secretary
  { id: 'ags-1', name: 'Md. Mosaddek Ali Shishir', title: 'Assistant General Secretary', roll: '2107027', batch: '2K21', seed: 310, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/0f749a84c484041e158b5a72ebf1a463f7cc0831-782x797.webp' },
  { id: 'ags-2', name: 'Shormi Ghosh', title: 'Assistant General Secretary', roll: '2107109', batch: '2K21', seed: 311, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/d40049e3be30ed9055941342725ab56f32eceaf8-640x950.webp' },
  // Organizing Secretary
  { id: 'os-1', name: 'Ki Mahi', title: 'Organizing Secretary', roll: '2107076', batch: '2K21', seed: 312, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/a821bb49cb363388301e75f76fc65d1c93a33282-696x879.webp' },
  { id: 'os-2', name: 'Md Khorshed Sheikh', title: 'Organizing Secretary', roll: '2207013', batch: '2K22', seed: 313, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/ee95218a73dd3619ee1cda8297648d985a3aa93b-640x966.webp' },
  // Assistant Organizing Secretary
  { id: 'aos-1', name: 'Abdullah Al Saif', title: 'Assistant Organizing Secretary', roll: '2107017', batch: '2K21', seed: 314, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/0fa61f3a646a49da6e86b19ff7d38faff16f62d6-572x958.webp' },
  // Treasurer
  { id: 'treasurer-1', name: 'Isaac Aneek Sarker', title: 'Treasurer', roll: '2207095', batch: '2K22', seed: 315, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/0954b7cc8addc2fb8a1c2c9fd371661402b97860-789x832.webp' },
  // Assistant Treasurer
  { id: 'asst-treasurer-1', name: 'Sumaiya Akter', title: 'Assistant Treasurer', roll: '2107080', batch: '2K21', seed: 316, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/eeae069659d8ce6fd053bbd7554c09ccdf8ecedd-703x829.webp' },
  // Publication Secretary
  { id: 'pub-sec-1', name: 'Mehedi Hasan', title: 'Publication Secretary', roll: '2207028', batch: '2K22', seed: 317, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/561fb52bdc236d302b47691327e6628b2309d664-650x934.webp' },
  // Assistant Publication Secretary
  { id: 'asst-pub-sec-1', name: 'Munem Shahriar Nijhum', title: 'Assistant Publication Secretary', roll: '2207111', batch: '2K22', seed: 318, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/1b0ffe65973bfcee80cf76a6f7465f68b0775fb6-623x1005.webp' },
  // Workshop Manager
  { id: 'wm-1', name: 'Tasmir Hossain Zihad', title: 'Workshop Manager', roll: '2107071', batch: '2K21', seed: 319, hue: hues[2], initials: 'TZ' },
  // Assistant Workshop Manager
  { id: 'awm-1', name: 'Shahriar Hossain Prottoy', title: 'Assistant Workshop Manager', roll: '2207005', batch: '2K22', seed: 320, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/0e5f8bd57d3d356e08750e6a4389c2f6e974aa66-542x907.webp' },
  { id: 'awm-2', name: 'Md Sulaiman', title: 'Assistant Workshop Manager', roll: '2207011', batch: '2K22', seed: 321, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/3cb5887ea7d6f7e5833e611ffb5d622974702b4c-693x927.webp' },
  { id: 'awm-3', name: 'Md. Mahadi Hossion Joy', title: 'Assistant Workshop Manager', roll: '2303029', batch: '2K23', seed: 322, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/38052d5806c6f1ae5eba7dea1f11495917988f59-700x907.webp' },
  { id: 'awm-4', name: 'Tasnimul Hassan Rahat', title: 'Assistant Workshop Manager', roll: '2303028', batch: '2K23', seed: 323, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/c1c9b36ee8821154bb80383b7dfa61c9828a7646-627x965.webp' },
  { id: 'awm-5', name: 'Sanzida Alam Jerin', title: 'Assistant Workshop Manager', roll: '2207010', batch: '2K22', seed: 324, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/8076864741db1dc9bbdeb17154042aa3ea9639e2-673x907.webp' },
  // Editorial Manager
  { id: 'em-1', name: 'Hirobi Chakma', title: 'Editorial Manager', roll: '2207121', batch: '2K22', seed: 325, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/2b1c8dca612cb6f2a6ef935351e81d9e7e48beb1-752x966.webp' },
  { id: 'em-2', name: 'Sadiq Bin Shahidullah', title: 'Editorial Manager', roll: '2207036', batch: '2K22', seed: 326, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/52be1712a6eb58b2e088ea623db5f05d24f85464-754x950.webp' },
  { id: 'em-3', name: 'Khalid Bin Atik', title: 'Editorial Manager', roll: '2307073', batch: '2K23', seed: 327, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/d16a949ac472f589fd3659bfa5297ccbc4b55be5-577x847.webp' },
  { id: 'em-4', name: 'Md. Al Intejar Hasnath Prodhan', title: 'Editorial Manager', roll: '2307094', batch: '2K23', seed: 328, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/59f1d7f318637b999cc6f47bfa333d47cef2f6b4-588x911.webp' },
  { id: 'em-5', name: 'Md. Imtiaz Ahmed', title: 'Editorial Manager', roll: '2303040', batch: '2K23', seed: 329, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/54c1ef1a78ebbb80267b7848ffccb5b9a99c3484-551x915.webp' },
  { id: 'em-6', name: 'Lailatunnesa Lamisa', title: 'Editorial Manager', roll: '2307068', batch: '2K23', seed: 330, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/fb01e9927b8482a2a8c7968d979874c3cfccebc9-559x752.webp' },
  // Assistant Editorial Manager
  { id: 'aem-1', name: 'Prottoy Kumar Bhoumik', title: 'Assistant Editorial Manager', roll: '2207040', batch: '2K22', seed: 331, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/de7ad94f0774f19d15cf7803390f0ba3b64dd712-821x938.webp' },
  { id: 'aem-2', name: 'Md. Mohosin Alam', title: 'Assistant Editorial Manager', roll: '2307033', batch: '2K23', seed: 332, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/d3a6dd331ef336829f0e25b0005c116ea7a9168a-678x966.webp' },
  { id: 'aem-3', name: 'Abu Naser Md. Tauseef', title: 'Assistant Editorial Manager', roll: '2303027', batch: '2K23', seed: 333, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/ab424c90da2b7ae35e029b9f95e8f7de73821769-619x919.webp' },
  { id: 'aem-4', name: 'Efat Ara Belly', title: 'Assistant Editorial Manager', roll: '2307004', batch: '2K23', seed: 334, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/e7d102f449ef0d325de9c0ce9596c84b18200f91-517x980.webp' },
  { id: 'aem-5', name: 'Afra Yasmin', title: 'Assistant Editorial Manager', roll: '2307052', batch: '2K23', seed: 335, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/0b46767c424ab4b450f8dc8061601758d1d97e10-723x943.webp' },
  { id: 'aem-6', name: 'Nowmin Saife Aanchal', title: 'Assistant Editorial Manager', roll: '2307103', batch: '2K23', seed: 336, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/9853780e9d980a92bbc0ce43e6173c8bf9eda4cd-621x817.webp' },
  { id: 'aem-7', name: 'Muhammad Abu Talha', title: 'Assistant Editorial Manager', roll: '2303043', batch: '2K23', seed: 337, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/5511ef42a7fe5d1c97bcbebe3abb2c955cc81b5b-461x958.webp' },
  // Batch Representative (2K22)
  { id: 'br22-1', name: 'Muntasir Muhammad', title: 'Batch Representative (2K22)', roll: '2207069', batch: '2K22', seed: 338, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/2f657038244d5480ddc0da6d9c3f0a45c1e4428d-738x906.webp' },
  { id: 'br22-2', name: 'Yasar Wajih', title: 'Batch Representative (2K22)', roll: '2207064', batch: '2K22', seed: 339, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/9c6d5e796df50e551594856712f728be6efb5aa6-598x954.webp' },
  { id: 'br22-3', name: 'Nurul Absar Shadik', title: 'Batch Representative (2K22)', roll: '2207065', batch: '2K22', seed: 340, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/5907405804f5ed8029a54e518175c4fd4c6f0c39-588x997.webp' },
  { id: 'br22-4', name: 'Shahriar Abdullah', title: 'Batch Representative (2K22)', roll: '2207050', batch: '2K22', seed: 341, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/2044d6b88a71c4d535cd13c4aa37f3cdf899196d-438x957.webp' },
  // Batch Representative (2K23)
  { id: 'br23-1', name: 'Sanjidur Rahman', title: 'Batch Representative (2K23)', roll: '2307006', batch: '2K23', seed: 342, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/a96a2519cf9b8a69f31351f5a0c416fb08f4cc76-602x974.webp' },
  { id: 'br23-2', name: 'Anika Fairooz Asad', title: 'Batch Representative (2K23)', roll: '2303076', batch: '2K23', seed: 343, hue: hues[2] },
  { id: 'br23-3', name: 'Abrar Jawad', title: 'Batch Representative (2K23)', roll: '2307026', batch: '2K23', seed: 344, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/5632868aa441bff666354c3b23669c516247c41c-564x935.webp' },
  { id: 'br23-4', name: 'Nusrat Zahan Maria', title: 'Batch Representative (2K23)', roll: '2303009', batch: '2K23', seed: 345, hue: hues[0] },
  { id: 'br23-5', name: 'Souvik Kumar Kundu', title: 'Batch Representative (2K23)', roll: '2307048', batch: '2K23', seed: 346, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/a674fee2b0130c78d471f96ebbf6ba29d176b6d2-719x887.webp' },
  { id: 'br23-6', name: 'Maruf Ahmed', title: 'Batch Representative (2K23)', roll: '2303057', batch: '2K23', seed: 347, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/1a6294ec3e12d3308413aa0e07c34adde0aef2f2-595x872.webp' },
  // Batch Representative (2K24)
  { id: 'br24-1', name: 'Turjo Deb', title: 'Batch Representative (2K24)', roll: '2407084', batch: '2K24', seed: 348, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/4ef2aaba4e1b630d05ef6c81dcea348050b32e4e-563x953.webp' },
  { id: 'br24-2', name: 'Noor E Jannat Mawa', title: 'Batch Representative (2K24)', roll: '2407095', batch: '2K24', seed: 349, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/7d076b51649aff329633109da8355e9c5fc5d1ca-548x927.webp' },
  { id: 'br24-3', name: 'Parthib Chanda Dibbo', title: 'Batch Representative (2K24)', roll: '2407093', batch: '2K24', seed: 350, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/080d55a2d843ad7857ae443d20e2078047a69e40-676x914.webp' },
  { id: 'br24-4', name: 'Bandhon Kumar Sutrodhar', title: 'Batch Representative (2K24)', roll: '2407054', batch: '2K24', seed: 351, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/e5ece42786fa110f30ad8ab26f1371bc24da9f0d-786x860.webp' },
  { id: 'br24-5', name: 'Ayesha Yesmin Moumita', title: 'Batch Representative (2K24)', roll: '2407104', batch: '2K24', seed: 352, hue: hues[3] },
  { id: 'br24-6', name: 'Thowai Hla Gya Marma', title: 'Batch Representative (2K24)', roll: '2407121', batch: '2K24', seed: 353, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/2b86aebf4f102bcb38f9813bcb696b60e7a09f4a-540x970.webp' },
  // Performance Analyzer
  { id: 'pa-1', name: 'Muttakin Rahman Shoscho', title: 'Performance Analyzer', roll: '2207061', batch: '2K22', seed: 354, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/63f9d15879fc55d4ca733c5676f8bc78d47ff7ab-493x950.webp' },
  { id: 'pa-2', name: 'Rupam Bose', title: 'Performance Analyzer', roll: '2207038', batch: '2K22', seed: 355, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/458db17540c0785d8f2e82349d991d8c654fc793-706x927.webp' },
  { id: 'pa-3', name: 'Aavas Roy', title: 'Performance Analyzer', roll: '2207099', batch: '2K22', seed: 356, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/d5a3ca125cf387cb2b5f4cc8c146b542019e68a7-489x907.webp' },
  { id: 'pa-4', name: 'Md. Farhaduzzaman Rume', title: 'Performance Analyzer', roll: '2207080', batch: '2K22', seed: 357, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/de302438e19c5dbac8261db898b702bd01017e38-650x895.webp' },
  { id: 'pa-5', name: 'Maisha Oaima Islam', title: 'Performance Analyzer', roll: '2307102', batch: '2K23', seed: 358, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/bd7d14fa2de3407cafda8225d2267fdfb4cdaf59-661x790.webp' },
  { id: 'pa-6', name: 'Fariha Tabassum', title: 'Performance Analyzer', roll: '2207034', batch: '2K22', seed: 359, hue: hues[2] },
  { id: 'pa-7', name: 'Arnob Dam', title: 'Performance Analyzer', roll: '2307091', batch: '2K23', seed: 360, hue: hues[3], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/4ba0cd2380878013dfd3c0a697ac9642893ec91c-801x860.webp' },
  { id: 'pa-8', name: 'Md Abu Sufian', title: 'Performance Analyzer', roll: '2207072', batch: '2K22', seed: 361, hue: hues[0], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/128cbb22ef7e33317ea8902b184691f7798b2483-676x923.webp' },
  { id: 'pa-9', name: 'Alfaz Rahman', title: 'Performance Analyzer', roll: '2303031', batch: '2K23', seed: 362, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/3e183d93937c594a64ba7b9d2bc525e53115b41f-501x911.webp' },
  // Senior Executive
  { id: 'se-1', name: 'Shomik Shahriar', title: 'Senior Executive', roll: '2207041', batch: '2K22', seed: 363, hue: hues[2], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/7e91065bebf93a6e979f2d8df17cf46a01390342-662x892.webp' },
  { id: 'se-2', name: 'Mirza Samia Beg', title: 'Senior Executive', roll: '2207091', batch: '2K22', seed: 364, hue: hues[3] },
  { id: 'se-3', name: 'Nashita Binte Hamid', title: 'Senior Executive', roll: '2207067', batch: '2K22', seed: 365, hue: hues[0] },
  { id: 'se-4', name: 'Alif Al Ahad', title: 'Senior Executive', roll: '2207016', batch: '2K22', seed: 366, hue: hues[1], image: 'https://cdn.sanity.io/images/xcn3cj7z/production/a485ecd9a9c3a2e9b220590263f91fce6d365004-715x935.webp' },
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
