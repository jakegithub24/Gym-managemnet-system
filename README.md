# Gym Management System

A complete role-based gym management platform for managing members, trainers, staff, reception, enquiries, payments, products, equipment, and analytics.

## Project Overview

This system is designed to simplify gym operations by providing one centralized dashboard for all roles:
- Master Admin
- Trainer
- Staff
- Receptionist
- Member/User

It supports:
- Login/registration
- Role-based access
- Member management
- Enquiry handling
- Payment tracking
- Workout and diet plans
- Products and equipment management
- Analytics and AI integration

## Key Modules

### 1. Authentication & Authorization
- Secure login/logout
- Role-based access control
- Validation for every panel
- Protected routes and session handling

### 2. Member Management
- Member registration
- Approval flow
- Profile details
- Joining date
- Height, weight, status
- Progress tracking

### 3. Trainer Management
- Trainer profiles
- Photos and certifications
- Assigned members
- Availability and specialization

### 4. Receptionist Module
- Enquiry list
- Notification handling
- Follow-up management
- Text message enquiry support

### 5. Payment Management
- Monthly, quarterly, half-yearly, yearly plans
- Pending and paid history
- INR currency support
- Invoice and receipt tracking

### 6. Product Management
- Gym products and buying items
- Pricing and stock
- Sales tracking

### 7. Equipment Management
- Equipment list
- Condition and availability
- Maintenance tracking

### 8. Dashboard & Analytics
- Separate dashboard for each role
- Charts and summaries
- Member count
- Payment stats
- Enquiry stats
- Product and equipment insights

### 9. AI Integration
- Smart suggestions
- Member progress insights
- Workout and diet recommendations
- Automated summaries

## Tech Stack

- Frontend: React
- Backend: Node.js / Express
- Database: MongoDB / MySQL
- Authentication: JWT / session-based auth
- UI: Responsive dashboard components
- Charts: Analytics libraries for reports

## System Flow

1. User opens the system
2. User logs in based on role
3. New members register and submit enquiry
4. Receptionist receives enquiry notification
5. Payment is confirmed
6. Member profile is created
7. Trainer updates workout, diet, and progress
8. Admin monitors reports and analytics
9. User logs out securely

## Security Features

- Role-based access
- Input validation
- Secure logout
- Protected pages
- Permission control
- Clean session/token handling

## Future Enhancements

- AI-based workout recommendations
- WhatsApp/SMS enquiry integration
- Attendance tracking
- Mobile app support
- Advanced reporting
- Automated reminders

## Conclusion

This system provides a complete gym management solution with modern UI, secure access, and scalable design.
