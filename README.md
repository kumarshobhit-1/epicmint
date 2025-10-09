# 🎨 EpicMint - NFT Marketplace & Story Platform

![EpicMint Banner](https://picsum.photos/seed/epicmint/1200/400)

## 🌟 Overview

EpicMint is a comprehensive NFT marketplace and story platform that allows users to create, mint, trade, and share digital stories as NFTs. Built with modern web technologies, it provides a seamless experience for creators and collectors in the Web3 space.

## ✨ Features

### 🎯 Core Features
- **NFT Creation & Minting**: Create unique digital stories and mint them as NFTs
- **Marketplace**: Buy, sell, and trade NFTs with integrated Web3 wallet support
- **Story Platform**: Rich text editor for creating immersive digital stories
- **AI Integration**: AI-powered content generation for stories and descriptions
- **Admin Panel**: Complete administrative control for managing submissions and users
- **Contact System**: User support and feedback system with email integration

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure user registration and login
- **Wallet Integration**: MetaMask and other Web3 wallet connectivity
- **Protected Routes**: Role-based access control for admin features

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching capability
- **Real-time Updates**: Live data synchronization
- **Interactive UI**: Modern, intuitive interface components

## 🛠 Tech Stack & Dependencies

### Frontend Framework & Core
- **Next.js 15.5.3** - React framework with App Router and Turbopack
- **React 18.3.1** - UI library with latest features
- **React DOM 18.3.1** - React renderer for web
- **TypeScript 5.x** - Type-safe development

### AI Integration
- **@genkit-ai/googleai 1.14.1** - Google AI integration for content generation
- **@genkit-ai/next 1.14.1** - Next.js integration for AI features
- **genkit 1.14.1** - AI toolkit for application development
- **genkit-cli 1.14.1** - Command line tools for AI development

### UI Components & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI Components** - Complete accessible component library:
  - `@radix-ui/react-accordion` - Collapsible content sections
  - `@radix-ui/react-alert-dialog` - Modal dialogs for confirmations
  - `@radix-ui/react-avatar` - User profile pictures
  - `@radix-ui/react-checkbox` - Form checkboxes
  - `@radix-ui/react-collapsible` - Expandable content
  - `@radix-ui/react-dialog` - Modal windows
  - `@radix-ui/react-dropdown-menu` - Context menus
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-menubar` - Navigation menus
  - `@radix-ui/react-popover` - Floating content
  - `@radix-ui/react-progress` - Progress indicators
  - `@radix-ui/react-radio-group` - Radio button groups
  - `@radix-ui/react-scroll-area` - Custom scrollbars
  - `@radix-ui/react-select` - Dropdown selects
  - `@radix-ui/react-separator` - Visual dividers
  - `@radix-ui/react-slider` - Range inputs
  - `@radix-ui/react-slot` - Component composition
  - `@radix-ui/react-switch` - Toggle switches
  - `@radix-ui/react-tabs` - Tab navigation
  - `@radix-ui/react-toast` - Notification system
  - `@radix-ui/react-tooltip` - Hover information

### Styling Utilities
- **class-variance-authority 0.7.1** - Component variant management
- **clsx 2.1.1** - Conditional className utilities
- **tailwind-merge 3.0.1** - Merge Tailwind classes intelligently
- **tailwindcss-animate 1.0.7** - Animation utilities for Tailwind

### Icons & Visual Elements
- **Lucide React 0.475.0** - Modern icon library with 1000+ icons
- **Embla Carousel React 8.6.0** - Touch-friendly carousel component

### Backend & Database
- **Firebase 11.9.1** - Complete backend solution:
  - Firestore Database - NoSQL document database
  - Firebase Authentication - User management
  - Firebase Storage - File storage
  - Firebase Hosting - Web hosting

### Web3 & Blockchain
- **Ethers.js 6.15.0** - Ethereum wallet and contract interaction
  - Wallet connectivity (MetaMask, WalletConnect)
  - Smart contract interactions
  - Transaction management
  - ENS domain support

### Form Management
- **React Hook Form 7.54.2** - Performant form library
- **@hookform/resolvers 4.1.3** - Validation resolvers
- **Zod 3.24.2** - TypeScript-first schema validation

### Date & Time
- **date-fns 3.6.0** - Modern date utility library
- **react-day-picker 8.10.1** - Date picker component

### Data Visualization
- **Recharts 2.15.1** - Chart library for React
  - Line charts, bar charts, pie charts
  - Analytics dashboard components
  - Responsive chart design

### External Services Integration
- **EmailJS 3.2.0** - Client-side email service
  - Contact form submissions
  - Admin notification system
  - Template-based emails
- **Axios 1.7.2** - HTTP client for API requests

### Development Tools
- **@types/node** - Node.js type definitions
- **@types/react** - React type definitions  
- **@types/react-dom** - React DOM type definitions
- **PostCSS 8.x** - CSS processing tool
- **patch-package 8.0.0** - Package patching utility
- **dotenv 16.5.0** - Environment variable management

## 📁 Project Structure

```
epicmint/
├── apphosting.yaml              # Firebase App Hosting configuration
├── components.json              # Shadcn/UI components configuration
├── next.config.ts               # Next.js configuration with Turbopack
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── src/
    ├── ai/                     # AI Integration
    │   ├── dev.ts              # AI development configuration
    │   ├── genkit.ts           # Google Genkit setup
    │   └── flows/
    │       └── generate-content-with-ai.ts  # AI content generation
    ├── app/                    # Next.js App Router
    │   ├── globals.css         # Global styles
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx            # Home page
    │   ├── providers.tsx       # Context providers
    │   ├── about/              # About page
    │   ├── admin/              # Admin panel
    │   │   ├── layout.tsx      # Admin layout
    │   │   ├── page.tsx        # Admin dashboard
    │   │   └── contact-submissions/  # Contact form management
    │   ├── api/                # API routes
    │   │   ├── admin/submissions/    # Admin submission endpoints
    │   │   └── contact/        # Contact form endpoint
    │   ├── contract/           # Smart contract interaction
    │   ├── create/             # NFT creation
    │   ├── create-ai/          # AI-powered NFT creation
    │   ├── nft/[hash]/         # Dynamic NFT pages
    │   ├── profile/            # User profiles
    │   ├── signin/             # Authentication
    │   └── signup/             # User registration
    ├── components/             # React Components
    │   ├── auth/               # Authentication components
    │   ├── profile/            # Profile-specific components
    │   └── ui/                 # Reusable UI components (40+ components)
    ├── contexts/               # React Contexts
    │   ├── auth-context.tsx    # Authentication state
    │   ├── theme-context.tsx   # Theme management
    │   └── wallet-context.tsx  # Web3 wallet state
    ├── hooks/                  # Custom React Hooks
    │   ├── use-is-client.ts    # Client-side detection
    │   ├── use-mobile.tsx      # Mobile responsive hook
    │   ├── use-nft-store.ts    # NFT state management
    │   └── use-toast.ts        # Toast notifications
    └── lib/                    # Utility Libraries
        ├── firebase.ts         # Firebase configuration
        ├── types.ts            # TypeScript type definitions
        ├── utils.ts            # General utilities
        ├── web3.ts             # Web3 integration
        └── [additional utilities]
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore enabled
- MetaMask or compatible Web3 wallet
- ImgBB API key (for image uploads)
- EmailJS account (for email services)

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Image Upload Service
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Email Service (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id

# Web3 Configuration
NEXT_PUBLIC_ETHEREUM_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your_nft_contract_address

# Admin Page
NEXT_PUBLIC_ADMIN_USERNAME=Admin_username
NEXT_PUBLIC_ADMIN_PASSWORD=Set_admin_page_password
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd epicmint
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Add your domain to authorized domains

4. **Setup EmailJS**
   - Sign up at [EmailJS](https://emailjs.com)
   - Create email service and template
   - Configure template variables: `{to_name}`, `{original_message}`, `{admin_reply}`

5. **Setup ImgBB**
   - Get API key from [ImgBB API](https://api.imgbb.com)
   - Add to environment variables

6. **Run development server**
```bash
npm run dev
```

## 📋 Available Scripts

### Development Scripts
- **`npm run dev`** - Start development server with Turbopack (faster builds)
- **`npm run genkit:dev`** - Start AI development server with Genkit
- **`npm run genkit:watch`** - Start AI server with file watching
- **`npm run type-check`** - Run TypeScript type checking in watch mode

### Build & Production
- **`npm run build`** - Create production build
- **`npm run start`** - Start production server
- **`npm run analyze`** - Analyze bundle size (requires ANALYZE=true)

### Code Quality
- **`npm run lint`** - Run ESLint for code linting
- **`npm run lint:fix`** - Fix ESLint issues automatically
- **`npm run typecheck`** - Run TypeScript type checking (one-time)
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check code formatting

### Testing & Maintenance
- **`npm run test`** - Run tests (currently placeholder)
- **`npm run test:watch`** - Run tests in watch mode
- **`npm run clean`** - Clean build directories (.next, out, dist)
- **`npm run postinstall`** - Apply package patches after install

7. **Open application**
   - Visit `http://localhost:3000`

## 🔧 Configuration

### Firebase Setup
1. **Firestore Collections**:
   - `nfts` - NFT metadata and information
   - `users` - User profiles and data
   - `comments` - User comments on NFTs
   - `reviews` - NFT reviews and ratings

2. **Security Rules** (example):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /nfts/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### EmailJS Template Configuration
Template should include these variables:
- `{to_name}` - Recipient name
- `{original_message}` - Original user message
- `{admin_reply}` - Admin response
- `{from_name}` - Sender name

## 📊 Features Deep Dive

### NFT Marketplace
- **Create NFTs**: Upload images, add metadata, mint to blockchain
- **Browse NFTs**: Filter by category, price, popularity
- **Trading**: Buy/sell with Web3 wallet integration
- **Favorites**: Save and organize favorite NFTs

### Admin Panel
- **Contact Management**: View and respond to user inquiries
- **User Management**: Monitor user activity and stats
- **Content Moderation**: Review and manage NFT submissions
- **Analytics**: Track platform metrics and performance

### Story Creation
- **Rich Editor**: Advanced text formatting and styling
- **AI Assistance**: Generate content ideas and descriptions
- **Media Integration**: Embed images and multimedia
- **Collaboration**: Share drafts with other users

## 🔐 Security Features

### Authentication
- Firebase Authentication with email/password
- JWT token validation
- Protected API routes
- Role-based access control

### Data Protection
- Input validation and sanitization
- CORS configuration for API security
- Environment variable protection
- Secure file uploads

## 🚀 Deployment

### Firebase Hosting
1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login and initialize**
```bash
firebase login
firebase init hosting
```

3. **Build and deploy**
```bash
npm run build
firebase deploy
```

### Vercel Deployment
1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

### Environment Setup for Production
- Configure all environment variables in hosting platform
- Update Firebase security rules for production
- Set up custom domain and SSL certificates

## 📱 API Documentation

### Contact API
- `POST /api/contact` - Submit contact form
- `GET /api/admin/submissions` - Get all submissions (admin)
- `PATCH /api/admin/submissions` - Update submission status
- `DELETE /api/admin/submissions` - Delete submission

### Authentication Flow
1. User registers/logs in via Firebase Auth
2. JWT token stored in browser
3. Protected routes validate token
4. API calls include authentication headers

## 🎨 Component Library

### UI Components (Radix UI based)
- Button, Input, Textarea
- Dialog, Sheet, Popover
- Card, Badge, Avatar
- Toast notifications
- Form components

### Custom Components
- NFT Card display
- Wallet connection button
- Search and filter components
- Admin dashboard widgets

## 🔍 SEO & Performance

### Optimization Features
- Next.js App Router for optimal performance
- Image optimization with Next.js Image component
- Meta tags and OpenGraph support
- Sitemap generation
- Performance monitoring utilities

### Search Features
- Real-time search with debouncing
- Filter by category, price, date
- Performance monitoring for search queries
- Cached results for improved speed

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use ESLint configuration
3. Write descriptive commit messages
4. Test all functionality before submitting
5. Update documentation for new features

### Code Style
- Use Prettier for formatting
- Follow React and Next.js conventions
- Implement proper error handling
- Write clear, commented code

## 📊 Analytics & Monitoring

### Performance Tracking
- Search performance monitoring
- Page load time tracking
- User interaction analytics
- Error logging and reporting

### User Analytics
- User registration and activity
- NFT creation and trading metrics
- Popular content tracking
- Conversion funnel analysis

## 🔒 Privacy & Compliance

### Data Protection
- GDPR compliance measures
- User data encryption
- Secure data transmission
- Privacy policy implementation

### Terms of Service
- Clear usage guidelines
- Intellectual property protection
- Dispute resolution procedures
- Platform liability limitations

## 🛠 Troubleshooting

### Common Issues
1. **Wallet Connection Issues**
   - Check MetaMask installation
   - Verify network configuration
   - Clear browser cache

2. **Firebase Connection**
   - Verify environment variables
   - Check Firebase project settings
   - Review security rules

3. **Email Service**
   - Validate EmailJS configuration
   - Check template variables
   - Verify API keys

### Debug Mode
Enable development logging by setting:
```env
NODE_ENV=development
```

## 📞 Support

### Getting Help
- Documentation: Check `/docs` folder
- Issues: Create GitHub issue
- Email: Use contact form in application
- Community: Join Discord/Telegram

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://radix-ui.com)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Radix UI for accessible components
- Tailwind CSS for styling utilities
- OpenAI for AI integration possibilities
- Web3 community for blockchain integration

---

**Built with ❤️ by the EpicMint Team**

*Creating the future of digital storytelling and NFT experiences*