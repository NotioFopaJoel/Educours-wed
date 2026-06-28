const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

const EDUCATION_SYSTEMS = {
  ANGLOPHONE: 'anglophone',
  FRANCOPHONE: 'francophone',
};

const ANGLOPHONE_LEVELS = [
  'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5',
  'Lower Sixth', 'Upper Sixth',
];

const FRANCOPHONE_LEVELS = [
  '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale',
];

const TEACHER_YEARS = ['1st year', '2nd year'];

const TEACHER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  SUSPENDED: 'suspended',
};

const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SUSPENDED: 'suspended',
};

const TRANSACTION_TYPES = {
  COURSE_PAYMENT: 'course_payment',
  TEACHER_PAYOUT: 'teacher_payout',
};

const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

const PAYMENT_PROVIDERS = {
  MESOMB: 'MeSomb',
};

const PAYMENT_SERVICES = {
  MTN: 'MTN',
  ORANGE: 'ORANGE',
};

const LESSON_TYPES = {
  VIDEO: 'video',
  PDF: 'pdf',
  TEXT: 'text',
  LIVE: 'live',
};

const LANGUAGES = {
  EN: 'en',
  FR: 'fr',
};

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

const FONT_SIZES = {
  NORMAL: 'normal',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

const TICKET_CATEGORIES = {
  PAYMENT: 'Paiement',
  TECHNICAL: 'Technique',
  COURSE: 'Cours',
  ACCOUNT: 'Compte',
  OTHER: 'Autre',
};

const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

const PLATFORM_COMMISSION_PERCENT = parseInt(process.env.PLATFORM_COMMISSION_PERCENT, 10) || 40;
const TEACHER_COMMISSION_PERCENT = 100 - PLATFORM_COMMISSION_PERCENT;

module.exports = {
  ROLES,
  EDUCATION_SYSTEMS,
  ANGLOPHONE_LEVELS,
  FRANCOPHONE_LEVELS,
  TEACHER_YEARS,
  TEACHER_STATUS,
  ENROLLMENT_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  PAYMENT_PROVIDERS,
  PAYMENT_SERVICES,
  LESSON_TYPES,
  LANGUAGES,
  THEMES,
  FONT_SIZES,
  TICKET_CATEGORIES,
  TICKET_STATUS,
  PLATFORM_COMMISSION_PERCENT,
  TEACHER_COMMISSION_PERCENT,
};
