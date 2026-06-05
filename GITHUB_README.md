# Skill Mtaani - Kasarani Youth Skill Hub Platform 🚀

![Platform](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## 📱 About the Project

**Skill Mtaani** is a fully functional, interactive web platform that connects youth in Kasarani Constituency, Nairobi, Kenya to share skills, find mentors, and build community.

> *"Learn. Teach. Grow Pamoja."* 🌟

### 🎯 Purpose

- Post and discover skills within the community
- Connect with mentors and learners
- Build a vibrant youth skill-sharing ecosystem
- Support entrepreneurship and skill development

## ✨ Key Features

### 🎨 Core Functionality
- ✅ **Browse & Search Skills** - Real-time search across 80+ skills
- ✅ **Post Your Skills** - Share what you know with the community
- ✅ **Filter by Category** - 8+ skill categories with live counts
- ✅ **Senior Mentors** - Connect with experienced guides
- ✅ **Community Wall** - Engage with community posts
- ✅ **User Profiles** - Complete profile management
- ✅ **WhatsApp Integration** - Direct contact with instructors

### 🔐 Authentication
- ✅ **User Registration** - Secure signup with validation
- ✅ **User Login** - Email/username with password
- ✅ **Session Management** - "Remember Me" functionality
- ✅ **Profile Dashboard** - Manage your skills & profile
- ✅ **Data Persistence** - All data saved to localStorage

### 🎨 Design & UX
- ✅ **Dark Modern Theme** - Beautiful UI with lime green accents
- ✅ **Smooth Animations** - 15+ animations & transitions
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Toast Notifications** - Real-time user feedback
- ✅ **Modal Windows** - Interactive detail views
- ✅ **Color-Coded Cards** - Visual skill categorization

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (Vanilla)** - No frameworks, pure functionality
- **LocalStorage API** - Client-side data persistence
- **Node.js** - Local development server

### Browser Compatibility
- ✅ Chrome / Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📦 Project Structure

```
skill-mtaani/
├── index.html          # Main HTML file
├── app.js              # JavaScript logic (600+ lines)
├── styles.css          # CSS styling & animations (26+ KB)
├── server.js           # Local development server
├── README.md           # GitHub README
├── AUTH_GUIDE.md       # Authentication documentation
├── .gitignore          # Git ignore rules
└── (other docs)
```

## 🚀 Quick Start

### Option 1: Run Locally (Recommended for Development)

**Prerequisites:**
- Node.js v14+ installed
- OR Python 3.x installed

**Steps:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skill-mtaani.git
   cd skill-mtaani
   ```

2. **Start the development server**
   
   Using Node.js:
   ```bash
   node server.js
   ```
   
   Or using Python:
   ```bash
   python -m http.server 8080
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

### Option 2: Open Directly

Simply double-click `index.html` to open in your default browser.

### Option 3: Deploy Live (See Deployment section below)

## 👤 Demo Account

Try the platform with the demo account:

| Credential | Value |
|-----------|-------|
| Email | demo@example.com |
| Username | demouser |
| Password | Demo@123 |

## 🎓 How to Use

### Browse Skills
1. Visit the platform
2. Use **Search box** to find specific skills
3. Click **Category chips** to filter by category
4. Click **"Learn More"** on any skill to view details

### Post a Skill
1. Click **"+ Post Skill"** in navigation
2. Fill in skill details (name, category, description, price)
3. Click **"Post My Skill 🚀"**
4. Skill appears instantly on platform

### Create Account
1. Click **👤** button (top right)
2. Click **"Create one"**
3. Fill in registration form
4. Click **"Create Account"**
5. Auto-login & start using platform

### View Profile
1. Click **👤** button
2. Click **"My Profile"**
3. See all your information
4. View your posted skills
5. Manage account settings

## 📊 Sample Data Included

### Pre-loaded Skills (8)
- Graphic Design Mastery
- Web Development
- Photography Basics
- Professional Tailoring
- Music Production
- Cooking & Catering
- Fitness & Personal Training
- Social Media Marketing

### Senior Mentors (4)
- James Kariuki (Web Development)
- Sarah Mwangi (Graphic Design)
- David Omondi (Business Strategy)
- Amina Hassan (Digital Marketing)

## 🌐 Live Demo

**Coming Soon!** We're setting up live deployment on:
- GitHub Pages
- Netlify
- Vercel

Check back soon for live link!

## 🔧 Configuration

### Change Port
Edit `server.js`:
```javascript
const PORT = 3000; // Change from 8080
```

### Modify Styles
Edit `styles.css` to customize:
- Colors in `:root` CSS variables
- Animations & transitions
- Responsive breakpoints

### Add More Skills
Edit `INITIAL_SKILLS` array in `app.js`

### Add Categories
Update category list in HTML and `getEmojiForCategory()` in `app.js`

## 📚 Documentation

- [README.md](./README.md) - Main documentation
- [AUTH_GUIDE.md](./AUTH_GUIDE.md) - Authentication system guide
- [SETUP_COMPLETE.txt](./SETUP_COMPLETE.txt) - Setup instructions
- [LOGIN_FEATURES_SUMMARY.txt](./LOGIN_FEATURES_SUMMARY.txt) - Login features

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free)
```bash
# Push to main branch
git push origin main

# Enable GitHub Pages in repository settings
# Select "main branch" as source
```

### Option 2: Netlify (Free, Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub repository
4. Deploy with one click!

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub project
3. Deploy instantly!

## 🛡️ Security Features

- ✅ Form validation on all inputs
- ✅ Email uniqueness checking
- ✅ Username uniqueness checking
- ✅ Password strength validation
- ✅ Phone format validation
- ✅ CSRF protection ready
- ✅ Input sanitization
- ✅ Session management

**Note:** Passwords are not hashed in this version (demo). For production, implement:
- bcrypt for password hashing
- JWT for tokens
- HTTPS enforcement
- Rate limiting

## 🔄 Future Enhancements

### Backend Integration
- [ ] Real database (MongoDB/Firebase)
- [ ] Secure authentication (JWT)
- [ ] Password hashing (bcrypt)
- [ ] Email verification
- [ ] API rate limiting

### Advanced Features
- [ ] Payment processing (M-Pesa/Stripe)
- [ ] Image uploads for skills
- [ ] Rating & review system
- [ ] Live messaging
- [ ] Map view of nearby skills
- [ ] Video tutorials
- [ ] Admin dashboard
- [ ] Email notifications

### Social Features
- [ ] Social media logins
- [ ] Followers/Following system
- [ ] Skill recommendations
- [ ] Direct messaging
- [ ] User reputation system

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Kill process on port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or use different port
# Edit server.js: const PORT = 3000;
```

### Data Not Saving
- Check if localStorage is enabled
- Try non-incognito/private browser mode
- Clear browser cache
- Check browser console for errors

### Can't Login
- Use demo credentials: demo@example.com / Demo@123
- Check password (minimum 8 characters)
- Verify email exists
- Clear browser storage: `localStorage.clear()`

## 📝 License

MIT License - Feel free to use, modify, and distribute!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or feedback:
- 📱 WhatsApp: Available on platform
- 💬 GitHub Issues: [Report here](https://github.com/yourusername/skill-mtaani/issues)
- 📧 Email: support@skillmtaani.com

## 🙏 Acknowledgments

Built with ❤️ for the Youth of **Kasarani Constituency**, Nairobi, Kenya.

Special thanks to:
- The Kasarani youth community
- All skill instructors
- The mentors
- Everyone using the platform

---

## 📊 Statistics

- **Lines of Code:** 2000+
- **Features:** 30+
- **Animations:** 15+
- **Categories:** 8
- **Sample Skills:** 8
- **Demo Mentors:** 4
- **File Size:** ~70 KB

---

**Made with 💚 for Kasarani Youth**

Last Updated: June 2026
Version: 1.0.0

---

### Quick Links
- [Live Demo](#) (Coming Soon)
- [Documentation](./README.md)
- [Report Issues](https://github.com/yourusername/skill-mtaani/issues)
- [Star on GitHub](https://github.com/yourusername/skill-mtaani) ⭐
