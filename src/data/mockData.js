// ──────────────────────────────────────────────
//  Mock Data — replace with real API calls later
// ──────────────────────────────────────────────

export const CATEGORY_EMOJI = {
  wallet:      '👛',
  phone:       '📱',
  bag:         '🎒',
  id:          '💳',
  electronics: '💻',
  books:       '📚',
  keys:        '🔑',
  clothes:     '👕',
  others:      '📦',
}

export const CATEGORIES = [
  { value: 'wallet',      label: 'Wallet'      },
  { value: 'phone',       label: 'Phone'        },
  { value: 'bag',         label: 'Bag'          },
  { value: 'id',          label: 'ID Card'      },
  { value: 'electronics', label: 'Electronics'  },
  { value: 'books',       label: 'Books'        },
  { value: 'keys',        label: 'Keys'         },
  { value: 'clothes',     label: 'Clothes'      },
  { value: 'others',      label: 'Others'       },
]

export const STATUSES = [
  { value: 'pending',  label: 'Pending'  },
  { value: 'approved', label: 'Approved' },
  { value: 'claimed',  label: 'Claimed'  },
  { value: 'closed',   label: 'Closed'   },
]

// ── Status style maps ──────────────────────────
export const STATUS_BADGE = {
  pending:  { label: 'Pending',  cls: 'bg-amber-100  text-amber-600  border-amber-200'  },
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  rejected: { label: 'Rejected', cls: 'bg-red-100    text-red-600    border-red-200'    },
  claimed:  { label: 'Claimed',  cls: 'bg-blue-100   text-blue-600   border-blue-200'   },
  closed:   { label: 'Closed',   cls: 'bg-slate-100  text-slate-500  border-slate-200'  },
}

// ── All items (lost + found mixed) ────────────
export const ALL_ITEMS = [
  {
    id: '1',
    title: 'Black Leather Wallet',
    type: 'lost',
    category: 'wallet',
    location: 'Library, Block A',
    date: '2026-09-20',
    description: 'Black leather bifold wallet with student ID and some cash inside. Has a small scratch on the left corner.',
    keywords: ['black', 'leather', 'bifold'],
    status: 'approved',
    postedBy: { name: 'Rahul Sharma', avatar: null },
    createdAt: '2026-09-20T10:30:00Z',
    imageURL: null,
  },
  {
    id: '2',
    title: 'iPhone 14 Pro',
    type: 'found',
    category: 'phone',
    location: 'Canteen, Ground Floor',
    date: '2026-09-22',
    description: 'Space Black iPhone 14 Pro found on one of the canteen tables. Screen has a small crack.',
    keywords: ['iphone', 'apple', 'black'],
    status: 'approved',
    postedBy: { name: 'Priya Mehta', avatar: null },
    createdAt: '2026-09-22T14:00:00Z',
    imageURL: null,
  },
  {
    id: '3',
    title: 'Blue Backpack',
    type: 'lost',
    category: 'bag',
    location: 'Computer Lab, 3rd Floor',
    date: '2026-09-23',
    description: 'Navy blue Wildcraft backpack with laptop sleeve. Contains charger and notebooks.',
    keywords: ['blue', 'wildcraft', 'backpack', 'laptop'],
    status: 'pending',
    postedBy: { name: 'Aman Singh', avatar: null },
    createdAt: '2026-09-23T09:15:00Z',
    imageURL: null,
  },
  {
    id: '4',
    title: 'Student ID Card',
    type: 'found',
    category: 'id',
    location: 'Hostel B Entrance',
    date: '2026-09-24',
    description: 'Found a student ID card near Hostel B main gate. Name on card: Deepak Kumar.',
    keywords: ['id', 'student', 'card'],
    status: 'approved',
    postedBy: { name: 'Security Staff', avatar: null },
    createdAt: '2026-09-24T08:00:00Z',
    imageURL: null,
  },
  {
    id: '5',
    title: 'Dell Laptop Charger',
    type: 'lost',
    category: 'electronics',
    location: 'Seminar Hall, Block C',
    date: '2026-09-25',
    description: 'White Dell 65W charger with adapter. Left after the morning seminar session.',
    keywords: ['dell', 'charger', 'laptop', 'white'],
    status: 'approved',
    postedBy: { name: 'Sneha Rao', avatar: null },
    createdAt: '2026-09-25T12:00:00Z',
    imageURL: null,
  },
  {
    id: '6',
    title: 'Water Bottle (Milton)',
    type: 'found',
    category: 'others',
    location: 'Gym, Sports Complex',
    date: '2026-09-25',
    description: 'Blue Milton insulated water bottle found at the gym. Name tag reads S.K.',
    keywords: ['milton', 'bottle', 'blue', 'insulated'],
    status: 'approved',
    postedBy: { name: 'Vikram Patil', avatar: null },
    createdAt: '2026-09-25T17:30:00Z',
    imageURL: null,
  },
  {
    id: '7',
    title: 'AirPods Pro (2nd Gen)',
    type: 'lost',
    category: 'electronics',
    location: 'Study Room, Library',
    date: '2026-09-26',
    description: 'White Apple AirPods Pro 2nd Gen in white case. Case has a sticker with "AK" on it.',
    keywords: ['airpods', 'apple', 'white', 'earbuds'],
    status: 'claimed',
    postedBy: { name: 'Ananya Krishnan', avatar: null },
    createdAt: '2026-09-26T11:00:00Z',
    imageURL: null,
  },
  {
    id: '8',
    title: 'Engineering Mathematics Book',
    type: 'found',
    category: 'books',
    location: 'Classroom 201, Block B',
    date: '2026-09-27',
    description: 'RD Sharma Engineering Mathematics book. Found after evening class. Has handwritten notes.',
    keywords: ['maths', 'book', 'rd sharma', 'engineering'],
    status: 'approved',
    postedBy: { name: 'Mohit Gupta', avatar: null },
    createdAt: '2026-09-27T18:00:00Z',
    imageURL: null,
  },
  {
    id: '9',
    title: 'Bunch of Keys',
    type: 'found',
    category: 'keys',
    location: 'Parking Lot, Gate 2',
    date: '2026-09-28',
    description: 'Found a bunch of 4 keys on a Honda keychain near the parking lot.',
    keywords: ['keys', 'honda', 'keychain', 'parking'],
    status: 'pending',
    postedBy: { name: 'Parking Attendant', avatar: null },
    createdAt: '2026-09-28T09:00:00Z',
    imageURL: null,
  },
  {
    id: '10',
    title: 'Grey Hoodie',
    type: 'lost',
    category: 'clothes',
    location: 'Basketball Court',
    date: '2026-09-28',
    description: 'Large size grey H&M hoodie left near the basketball court after practice.',
    keywords: ['hoodie', 'grey', 'hm', 'clothes'],
    status: 'approved',
    postedBy: { name: 'Karan Verma', avatar: null },
    createdAt: '2026-09-28T20:00:00Z',
    imageURL: null,
  },
  {
    id: '11',
    title: 'Calculator (Casio fx-991)',
    type: 'found',
    category: 'electronics',
    location: 'Exam Hall 3',
    date: '2026-09-29',
    description: 'Casio FX-991EX scientific calculator found after the morning exam session.',
    keywords: ['casio', 'calculator', 'scientific'],
    status: 'pending',
    postedBy: { name: 'Exam Dept', avatar: null },
    createdAt: '2026-09-29T12:30:00Z',
    imageURL: null,
  },
  {
    id: '12',
    title: 'Prescription Glasses',
    type: 'lost',
    category: 'others',
    location: 'Cafeteria, Block A',
    date: '2026-09-29',
    description: 'Black rectangular prescription glasses in a brown case. Minus 2.5 power.',
    keywords: ['glasses', 'spectacles', 'prescription', 'black'],
    status: 'approved',
    postedBy: { name: 'Tanvi Shah', avatar: null },
    createdAt: '2026-09-29T13:00:00Z',
    imageURL: null,
  },
]

// ── Current user's items (for My Lost / My Found pages) ───
export const MY_LOST_ITEMS = ALL_ITEMS.filter(i => i.type === 'lost').slice(0, 4)
export const MY_FOUND_ITEMS = ALL_ITEMS.filter(i => i.type === 'found').slice(0, 3)

// ── Dashboard stats ────────────────────────────
export const DASHBOARD_STATS = {
  lostItems:  MY_LOST_ITEMS.length,
  foundItems: MY_FOUND_ITEMS.length,
  claims:     2,
  matches:    3,
}

// ── Recent activity (mix) ─────────────────────
export const RECENT_ACTIVITY = ALL_ITEMS.slice(0, 5)

// ── Mock matches ──────────────────────────────
export const MY_MATCHES = [
  {
    id: 'm1',
    lostItem:  { id: '1',  title: 'Black Leather Wallet',    location: 'Library, Block A',   category: 'wallet'  },
    foundItem: { id: '4',  title: 'Student ID Card',         location: 'Hostel B Entrance',  category: 'id'      },
    matchScore: 74,
    status: 'suggested',
  },
  {
    id: 'm2',
    lostItem:  { id: '7',  title: 'AirPods Pro (2nd Gen)',   location: 'Study Room, Library',  category: 'electronics' },
    foundItem: { id: '11', title: 'Calculator (Casio fx-991)',location: 'Exam Hall 3',          category: 'electronics' },
    matchScore: 52,
    status: 'accepted',
  },
  {
    id: 'm3',
    lostItem:  { id: '3',  title: 'Blue Backpack',           location: 'Computer Lab',       category: 'bag'     },
    foundItem: { id: '6',  title: 'Water Bottle (Milton)',   location: 'Sports Complex',     category: 'others'  },
    matchScore: 41,
    status: 'suggested',
  },
]

// ── Mock claims ───────────────────────────────
export const MY_CLAIMS = [
  { id: 'c1', item: ALL_ITEMS[1], status: 'pending',  claimedAt: '2026-09-23T10:00:00Z' },
  { id: 'c2', item: ALL_ITEMS[3], status: 'approved', claimedAt: '2026-09-25T14:00:00Z' },
]

// ── Mock user profile ─────────────────────────
export const MOCK_USER = {
  firstname:    'Alex',
  lastname:     'Johnson',
  email:        'alex.johnson@campus.edu',
  phone:        '+91 98765 43210',
  role:         'student',
  profileImage: null,
  createdAt:    '2025-08-01T00:00:00Z',
  stats: {
    lostItems:  MY_LOST_ITEMS.length,
    foundItems: MY_FOUND_ITEMS.length,
    claims:     MY_CLAIMS.length,
  },
}
