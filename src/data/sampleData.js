// ── Sample Data for Gym Management System ──────────────────────────────────

export const kpiData = {
  revenue: { value: '$48,320', change: '+12.5%', positive: true, label: 'Monthly Revenue' },
  members: { value: '1,284', change: '+8.2%', positive: true, label: 'Active Members' },
  attendance: { value: '73%', change: '-2.1%', positive: false, label: 'Avg Attendance' },
  expiring: { value: '47', change: '+5', positive: false, label: 'Expiring This Week' },
};

export const revenueData = [
  { month: 'Jan', revenue: 32000, members: 980 },
  { month: 'Feb', revenue: 35000, members: 1020 },
  { month: 'Mar', revenue: 38000, members: 1080 },
  { month: 'Apr', revenue: 36000, members: 1100 },
  { month: 'May', revenue: 41000, members: 1150 },
  { month: 'Jun', revenue: 44000, members: 1200 },
  { month: 'Jul', revenue: 42000, members: 1220 },
  { month: 'Aug', revenue: 48320, members: 1284 },
];

export const attendanceData = [
  { day: 'Mon', morning: 120, evening: 180, total: 300 },
  { day: 'Tue', morning: 100, evening: 160, total: 260 },
  { day: 'Wed', morning: 140, evening: 200, total: 340 },
  { day: 'Thu', morning: 110, evening: 170, total: 280 },
  { day: 'Fri', morning: 160, evening: 220, total: 380 },
  { day: 'Sat', morning: 200, evening: 150, total: 350 },
  { day: 'Sun', morning: 90, evening: 80, total: 170 },
];

export const membershipDistribution = [
  { name: 'Basic', value: 35, color: '#6B7280' },
  { name: 'Standard', value: 40, color: '#00D4FF' },
  { name: 'Premium', value: 20, color: '#39FF14' },
  { name: 'VIP', value: 5, color: '#FF6B00' },
];

export const recentPayments = [
  { id: 'PAY-001', member: 'Alex Johnson', plan: 'Premium', amount: '$89', date: '2026-08-18', status: 'Paid', avatar: 'AJ' },
  { id: 'PAY-002', member: 'Maria Garcia', plan: 'Standard', amount: '$59', date: '2026-08-17', status: 'Paid', avatar: 'MG' },
  { id: 'PAY-003', member: 'James Wilson', plan: 'Basic', amount: '$29', date: '2026-08-17', status: 'Pending', avatar: 'JW' },
  { id: 'PAY-004', member: 'Sophia Lee', plan: 'VIP', amount: '$149', date: '2026-08-16', status: 'Paid', avatar: 'SL' },
  { id: 'PAY-005', member: 'David Brown', plan: 'Premium', amount: '$89', date: '2026-08-16', status: 'Failed', avatar: 'DB' },
  { id: 'PAY-006', member: 'Emma Davis', plan: 'Standard', amount: '$59', date: '2026-08-15', status: 'Paid', avatar: 'ED' },
  { id: 'PAY-007', member: 'Noah Martinez', plan: 'Basic', amount: '$29', date: '2026-08-15', status: 'Paid', avatar: 'NM' },
  { id: 'PAY-008', member: 'Olivia Taylor', plan: 'Premium', amount: '$89', date: '2026-08-14', status: 'Pending', avatar: 'OT' },
];

export const members = [
  { id: 'M-001', name: 'Alex Johnson', email: 'alex@example.com', plan: 'Premium', status: 'Active', joinDate: '2025-01-15', expiry: '2026-09-15', attendance: 28, trainer: 'Mike Stone', avatar: 'AJ', phone: '+1 555-0101' },
  { id: 'M-002', name: 'Maria Garcia', email: 'maria@example.com', plan: 'Standard', status: 'Active', joinDate: '2025-03-20', expiry: '2026-09-20', attendance: 22, trainer: 'Sarah Fit', avatar: 'MG', phone: '+1 555-0102' },
  { id: 'M-003', name: 'James Wilson', email: 'james@example.com', plan: 'Basic', status: 'Expiring', joinDate: '2025-05-10', expiry: '2026-08-25', attendance: 10, trainer: 'Unassigned', avatar: 'JW', phone: '+1 555-0103' },
  { id: 'M-004', name: 'Sophia Lee', email: 'sophia@example.com', plan: 'VIP', status: 'Active', joinDate: '2024-12-01', expiry: '2026-12-01', attendance: 35, trainer: 'Mike Stone', avatar: 'SL', phone: '+1 555-0104' },
  { id: 'M-005', name: 'David Brown', email: 'david@example.com', plan: 'Premium', status: 'Inactive', joinDate: '2025-02-14', expiry: '2026-08-14', attendance: 5, trainer: 'Tom Flex', avatar: 'DB', phone: '+1 555-0105' },
  { id: 'M-006', name: 'Emma Davis', email: 'emma@example.com', plan: 'Standard', status: 'Active', joinDate: '2025-04-05', expiry: '2026-10-05', attendance: 18, trainer: 'Sarah Fit', avatar: 'ED', phone: '+1 555-0106' },
  { id: 'M-007', name: 'Noah Martinez', email: 'noah@example.com', plan: 'Basic', status: 'Active', joinDate: '2025-06-18', expiry: '2026-09-18', attendance: 14, trainer: 'Unassigned', avatar: 'NM', phone: '+1 555-0107' },
  { id: 'M-008', name: 'Olivia Taylor', email: 'olivia@example.com', plan: 'Premium', status: 'Active', joinDate: '2025-07-01', expiry: '2026-10-01', attendance: 20, trainer: 'Tom Flex', avatar: 'OT', phone: '+1 555-0108' },
  { id: 'M-009', name: 'Liam Anderson', email: 'liam@example.com', plan: 'Standard', status: 'Active', joinDate: '2025-01-22', expiry: '2026-07-22', attendance: 25, trainer: 'Mike Stone', avatar: 'LA', phone: '+1 555-0109' },
  { id: 'M-010', name: 'Ava Thomas', email: 'ava@example.com', plan: 'VIP', status: 'Active', joinDate: '2024-11-15', expiry: '2026-11-15', attendance: 40, trainer: 'Sarah Fit', avatar: 'AT', phone: '+1 555-0110' },
];

export const trainers = [
  { id: 'T-001', name: 'Mike Stone', specialty: 'Strength & Conditioning', experience: '8 years', clients: 24, rating: 4.9, status: 'Active', schedule: 'Mon-Fri 6AM-2PM', avatar: 'MS', email: 'mike@gymforce.com', certifications: ['NASM-CPT', 'CSCS', 'CrossFit L2'] },
  { id: 'T-002', name: 'Sarah Fit', specialty: 'Yoga & Flexibility', experience: '6 years', clients: 18, rating: 4.8, status: 'Active', schedule: 'Tue-Sat 8AM-4PM', avatar: 'SF', email: 'sarah@gymforce.com', certifications: ['RYT-500', 'NASM-CPT'] },
  { id: 'T-003', name: 'Tom Flex', specialty: 'HIIT & Cardio', experience: '5 years', clients: 20, rating: 4.7, status: 'Active', schedule: 'Mon-Fri 2PM-10PM', avatar: 'TF', email: 'tom@gymforce.com', certifications: ['ACE-CPT', 'TRX'] },
  { id: 'T-004', name: 'Lisa Power', specialty: 'Nutrition & Weight Loss', experience: '10 years', clients: 30, rating: 5.0, status: 'Active', schedule: 'Mon-Sat 7AM-3PM', avatar: 'LP', email: 'lisa@gymforce.com', certifications: ['RD', 'NASM-CPT', 'PN1'] },
  { id: 'T-005', name: 'Chris Bulk', specialty: 'Bodybuilding', experience: '7 years', clients: 15, rating: 4.6, status: 'On Leave', schedule: 'Mon-Thu 12PM-8PM', avatar: 'CB', email: 'chris@gymforce.com', certifications: ['ISSA-CPT', 'NSCA'] },
];

export const attendanceLog = [
  { id: 1, member: 'Alex Johnson', date: '2026-08-19', checkIn: '06:15', checkOut: '07:45', duration: '1h 30m', area: 'Weight Room' },
  { id: 2, member: 'Sophia Lee', date: '2026-08-19', checkIn: '07:00', checkOut: '08:30', duration: '1h 30m', area: 'Cardio Zone' },
  { id: 3, member: 'Emma Davis', date: '2026-08-19', checkIn: '08:20', checkOut: '09:20', duration: '1h 0m', area: 'Yoga Studio' },
  { id: 4, member: 'Noah Martinez', date: '2026-08-19', checkIn: '09:00', checkOut: '10:15', duration: '1h 15m', area: 'Weight Room' },
  { id: 5, member: 'Maria Garcia', date: '2026-08-19', checkIn: '17:30', checkOut: '19:00', duration: '1h 30m', area: 'Group Class' },
  { id: 6, member: 'Olivia Taylor', date: '2026-08-19', checkIn: '18:00', checkOut: '19:30', duration: '1h 30m', area: 'Weight Room' },
  { id: 7, member: 'Liam Anderson', date: '2026-08-18', checkIn: '06:30', checkOut: '08:00', duration: '1h 30m', area: 'Cardio Zone' },
  { id: 8, member: 'Ava Thomas', date: '2026-08-18', checkIn: '09:15', checkOut: '10:45', duration: '1h 30m', area: 'Yoga Studio' },
];

export const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: '/month',
    color: 'gray',
    features: ['Access to main gym floor', 'Locker room access', 'Free Wi-Fi', '2 guest passes/month'],
    notIncluded: ['Group classes', 'Personal trainer', 'Nutrition consultation', 'Spa access'],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 59,
    period: '/month',
    color: 'blue',
    features: ['Everything in Basic', 'Unlimited group classes', '1 PT session/month', 'Nutrition guide', '5 guest passes/month'],
    notIncluded: ['Personal trainer', 'Spa access'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 89,
    period: '/month',
    color: 'green',
    features: ['Everything in Standard', '4 PT sessions/month', 'Nutrition consultation', 'Spa & sauna access', 'Priority booking', 'Towel service'],
    notIncluded: [],
    popular: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    period: '/month',
    color: 'orange',
    features: ['Everything in Premium', 'Unlimited PT sessions', 'Dedicated locker', 'Guest passes unlimited', 'Priority 24/7 support', 'Meal planning'],
    notIncluded: [],
    popular: false,
  },
];

export const notifications = [
  { id: 1, type: 'payment', title: 'Payment Failed', message: 'David Brown\'s payment of $89 failed.', time: '5 min ago', read: false, severity: 'error' },
  { id: 2, type: 'member', title: 'New Member Joined', message: 'Chris Lane signed up for Standard plan.', time: '1 hour ago', read: false, severity: 'success' },
  { id: 3, type: 'expiry', title: 'Membership Expiring', message: '12 memberships expire within 7 days.', time: '2 hours ago', read: false, severity: 'warning' },
  { id: 4, type: 'attendance', title: 'Peak Attendance Alert', message: 'Gym capacity at 95% — 6PM slot.', time: '3 hours ago', read: true, severity: 'info' },
  { id: 5, type: 'trainer', title: 'Trainer Unavailable', message: 'Chris Bulk is on leave Aug 20-25.', time: '1 day ago', read: true, severity: 'warning' },
  { id: 6, type: 'payment', title: 'Revenue Milestone', message: 'Monthly revenue crossed $48K target!', time: '2 days ago', read: true, severity: 'success' },
];

export const testimonials = [
  { id: 1, name: 'Marcus T.', role: 'Gym Owner, FitLife Studios', rating: 5, text: 'GymForce completely transformed how we manage our 800+ members. The dashboard is intuitive and our staff loves the attendance tracking system.', avatar: 'MT' },
  { id: 2, name: 'Rachel K.', role: 'Operations Manager, PowerZone', rating: 5, text: 'We cut admin time by 60% in the first month. The billing automation alone paid for itself within weeks. Highly recommend to any gym.', avatar: 'RK' },
  { id: 3, name: 'Derek M.', role: 'Personal Trainer & Studio Owner', rating: 5, text: 'Finally a gym software that understands trainers. Managing clients, schedules, and sessions has never been this seamless.', avatar: 'DM' },
  { id: 4, name: 'Priya S.', role: 'Fitness Director, Apex Health', rating: 5, text: 'The analytics helped us identify peak hours and optimize staffing. Revenue is up 23% since switching to GymForce.', avatar: 'PS' },
  { id: 5, name: 'Tony R.', role: 'Owner, Iron Brotherhood Gym', rating: 5, text: 'Best investment I\'ve made for my gym. Members get automated reminders and the app makes everything frictionless.', avatar: 'TR' },
];

export const features = [
  { icon: '👥', title: 'Member Management', desc: 'Complete member profiles, membership tracking, and automated renewal reminders all in one place.' },
  { icon: '📊', title: 'Smart Analytics', desc: 'Real-time dashboards with revenue trends, attendance patterns, and growth metrics at a glance.' },
  { icon: '💳', title: 'Billing & Payments', desc: 'Automated invoicing, payment tracking, failed payment alerts, and multi-plan support.' },
  { icon: '📅', title: 'Attendance Tracking', desc: 'QR-code or RFID check-ins with daily/weekly/monthly attendance reports.' },
  { icon: '🏋️', title: 'Trainer Management', desc: 'Assign clients, track sessions, manage schedules, and monitor trainer performance.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Automated emails and SMS for renewals, class reminders, and promotional offers.' },
];

export const roadmapPhase2 = [
  { title: 'Mobile App (iOS & Android)', desc: 'Native apps for members to book classes, track workouts, and manage memberships.', eta: 'Q1 2027', status: 'planned' },
  { title: 'AI Workout Recommendations', desc: 'Personalized workout plans powered by member goals, history, and trainer feedback.', eta: 'Q2 2027', status: 'planned' },
  { title: 'Class Scheduling System', desc: 'Full class booking with waitlists, capacity management, and instructor assignments.', eta: 'Q1 2027', status: 'in-progress' },
  { title: 'POS & Retail Integration', desc: 'Sell supplements, merchandise, and services directly from the platform.', eta: 'Q3 2027', status: 'planned' },
  { title: 'Multi-Location Support', desc: 'Manage multiple gym branches from a single admin dashboard.', eta: 'Q2 2027', status: 'planned' },
  { title: 'Wearables & IoT Integration', desc: 'Sync with Apple Watch, Fitbit, and gym equipment for automatic tracking.', eta: 'Q4 2027', status: 'planned' },
];
