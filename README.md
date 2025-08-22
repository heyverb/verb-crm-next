# VERB CRM - School Management System

A comprehensive school management system built with Next.js, TypeScript, and Appwrite.

## Features

### Core Modules
- **Student Management**: Complete student lifecycle management from admission to graduation
- **Teacher Management**: Teacher profiles, qualifications, and assignments
- **Class & Section Management**: Organize classes, sections, and subjects
- **Enrollment Management**: Handle student enrollments and transfers
- **Attendance System**: Daily attendance tracking for students
- **Examination Management**: Schedule exams, manage results, and generate reports
- **Fee Management**: Track fees, payments, and generate receipts
- **Academic Year Management**: Manage academic sessions

### User Roles
- **Admin**: Full system access and management capabilities
- **Teacher**: Class management, attendance, grades, and student information
- **Student**: View grades, attendance, fees, and assignments
- **Parent**: Monitor child's progress, fees, and attendance

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Appwrite (BaaS)
- **State Management**: Redux Toolkit, React Query
- **Forms**: React Hook Form, Zod validation
- **Authentication**: Appwrite Auth

## Prerequisites

- Node.js 18+ and npm/yarn
- Appwrite instance (cloud or self-hosted)
- Email service for notifications (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/verb-crm-next.git
cd verb-crm-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Appwrite credentials and collection IDs.

5. Set up Appwrite:
   - Create a new project in Appwrite
   - Create a database
   - Create the following collections with appropriate attributes:
     - Users
     - Schools
     - Students
     - Teachers
     - Classes
     - Sections
     - Subjects
     - Enrollments
     - Academic Years
     - Attendance
     - Exams
     - Exam Schedules
     - Results
     - Fees
     - Fee Payments
     - Admissions
     - Enquiries

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── appwrite/              # Appwrite configuration and services
│   ├── config.ts          # Appwrite client configuration
│   ├── interface/         # TypeScript interfaces
│   ├── schema/           # Zod schemas for validation
│   └── services/         # Service functions for API calls
├── components/           # Reusable React components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── providers/           # React context providers
└── store/              # Redux store configuration
```

## Key Features Implementation

### Authentication
- Multi-step registration process
- Role-based authentication
- Session management

### Student Management
- Student admission with detailed information
- Parent/Guardian details
- Academic history tracking
- Document management

### Class Management
- Dynamic class and section creation
- Subject assignment
- Teacher allocation
- Strength management

### Attendance System
- Daily attendance marking
- Bulk attendance operations
- Attendance reports and statistics

### Examination System
- Exam scheduling
- Result management
- Grade calculation
- Report card generation

### Fee Management
- Fee structure definition
- Payment tracking
- Receipt generation
- Due fee alerts

## Development

### Running Tests
```bash
npm run test
# or
yarn test
```

### Building for Production
```bash
npm run build
# or
yarn build
```

### Code Quality
```bash
npm run lint
npm run type-check
```

## Deployment

The application can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS
- Docker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@verbcrm.com or join our Discord channel.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Backend powered by [Appwrite](https://appwrite.io/)
