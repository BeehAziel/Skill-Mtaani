/* ============================================
   SKILL MTAANI – App JavaScript
   Full functionality with localStorage
   ============================================ */

// Color palette for random card colors
const COLORS = ['lime', 'orange', 'sky', 'purple'];
const TAG_COLORS = ['tag-lime', 'tag-orange', 'tag-sky', 'tag-purple'];

// Mock data for initial skills
const INITIAL_SKILLS = [
  {
    id: 1,
    name: "Graphic Design Mastery",
    instructor: "Kev Design",
    ward: "Kasarani",
    category: "Creative Arts",
    description: "Learn Adobe Photoshop, Illustrator & Figma. Portfolio building included.",
    phone: "+254701234567",
    price: 500,
    rating: 4.8,
    reviews: 12,
    availability: "Weekdays",
    emoji: "🎨"
  },
  {
    id: 2,
    name: "Web Development (Beginner)",
    instructor: "Alex Code",
    ward: "Baba Dogo",
    category: "Tech & Digital",
    description: "HTML, CSS, JavaScript from zero to hero. Build real projects!",
    phone: "+254702345678",
    price: 600,
    rating: 4.9,
    reviews: 28,
    availability: "Weekends",
    emoji: "💻"
  },
  {
    id: 3,
    name: "Photography Basics",
    instructor: "Jane Capture",
    ward: "Njiru",
    category: "Photography",
    description: "Learn composition, lighting, editing. Bring your own camera or phone.",
    phone: "+254703456789",
    price: 400,
    rating: 4.7,
    reviews: 15,
    availability: "Flexible",
    emoji: "📸"
  },
  {
    id: 4,
    name: "Professional Tailoring",
    instructor: "Mama Fashion",
    ward: "Roysambu",
    category: "Fashion & Beauty",
    description: "Design, cut, and sew custom clothes. Pattern making included.",
    phone: "+254704567890",
    price: 800,
    rating: 4.9,
    reviews: 35,
    availability: "Daily",
    emoji: "✂️"
  },
  {
    id: 5,
    name: "Music Production 101",
    instructor: "DJ Beats",
    ward: "Kasarani",
    category: "Music & Audio",
    description: "Produce beats using FL Studio. From MIDI to mastering.",
    phone: "+254705678901",
    price: 750,
    rating: 4.6,
    reviews: 18,
    availability: "Evenings",
    emoji: "🎵"
  },
  {
    id: 6,
    name: "Cooking & Catering",
    instructor: "Chef Paul",
    ward: "Clayworks",
    category: "Food & Catering",
    description: "Learn professional cooking, menu planning & event catering.",
    phone: "+254706789012",
    price: 900,
    rating: 4.8,
    reviews: 22,
    availability: "Weekends",
    emoji: "🍳"
  },
  {
    id: 7,
    name: "Fitness & Personal Training",
    instructor: "Coach Mike",
    ward: "Kasarani",
    category: "Health & Fitness",
    description: "Custom workout plans, nutrition guidance, online or in-person.",
    phone: "+254707890123",
    price: 550,
    rating: 4.9,
    reviews: 41,
    availability: "Daily",
    emoji: "🏋️"
  },
  {
    id: 8,
    name: "Social Media Marketing",
    instructor: "Grace Digital",
    ward: "Kware",
    category: "Tech & Digital",
    description: "Grow Instagram, TikTok, Facebook. Get clients. Make money.",
    phone: "+254708901234",
    price: 650,
    rating: 4.7,
    reviews: 19,
    availability: "Flexible",
    emoji: "📱"
  }
];

// Mock data for mentors
const INITIAL_MENTORS = [
  {
    id: 1,
    name: "James Kariuki",
    skill: "Web Development",
    emoji: "💻",
    years: 8,
    tags: ["Expert", "Patient", "Certified"]
  },
  {
    id: 2,
    name: "Sarah Mwangi",
    skill: "Graphic Design",
    emoji: "🎨",
    years: 6,
    tags: ["Creative", "Industry", "Portfolio"]
  },
  {
    id: 3,
    name: "David Omondi",
    skill: "Business Strategy",
    emoji: "📊",
    years: 12,
    tags: ["Entrepreneur", "Advisor", "Network"]
  },
  {
    id: 4,
    name: "Amina Hassan",
    skill: "Digital Marketing",
    emoji: "📢",
    years: 5,
    tags: ["Results-driven", "Practical", "Updated"]
  }
];

// Global state
let allSkills = [];
let currentUser = null;
let currentFilter = '';
let currentSearch = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadApp();
  setupScrollFadeObserver();
  setupTickerAnimation();
});

// Main app initialization
function loadApp() {
  // Load or initialize skills
  const storedSkills = localStorage.getItem('skills');
  allSkills = storedSkills ? JSON.parse(storedSkills) : INITIAL_SKILLS;
  
  // Load user if exists (check remembered first, then current)
  let storedUser = localStorage.getItem('rememberedUser');
  if (!storedUser) {
    storedUser = localStorage.getItem('currentUser');
  }
  
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    updateUserUI();
  }

  // Initialize users database if empty
  if (!localStorage.getItem('users')) {
    // Create sample users for demo
    const sampleUsers = [
      {
        id: 'user_demo1',
        fullName: 'Demo User',
        email: 'demo@example.com',
        username: 'demouser',
        phone: '+254701234567',
        ward: 'Kasarani',
        password: 'Demo@123',
        joinDate: new Date().toISOString(),
        avatar: '#C5F135',
        skills: [],
        bookmarks: [],
        bio: 'Welcome to Skill Mtaani!',
        verified: true
      }
    ];
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }

  // Render initial UI
  renderSkills();
  renderMentors();
  renderCommunityWall();
  updateCategoryCounts();
  updateUserUI();
}

// ============================================
//   RENDERING FUNCTIONS
// ============================================

function renderSkills() {
  const container = document.getElementById('skillsGrid');
  container.innerHTML = '';

  let filtered = allSkills;

  // Apply category filter
  if (currentFilter) {
    filtered = filtered.filter(s => s.category === currentFilter);
  }

  // Apply search filter
  if (currentSearch) {
    const search = currentSearch.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.description.toLowerCase().includes(search) ||
      s.instructor.toLowerCase().includes(search)
    );
  }

  // Show/hide no results message
  document.getElementById('noResults').style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach(skill => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const tagColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

    const card = document.createElement('div');
    card.className = `skill-card ${color}`;
    card.innerHTML = `
      <div class="card-top">
        <span class="card-emoji">${skill.emoji}</span>
        <span class="card-tag ${tagColor}">${skill.category}</span>
      </div>
      <div class="card-title">${skill.name}</div>
      <div class="card-person">
        <div class="avatar">${skill.instructor.charAt(0).toUpperCase()}</div>
        <div class="card-name">${skill.instructor}</div>
      </div>
      <div class="card-desc">${skill.description}</div>
      <div class="card-footer">
        <div class="card-meta">⭐ ${skill.rating} (${skill.reviews} reviews)</div>
        <button class="btn-learn" onclick="viewSkillDetails(${skill.id})">Learn More</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderMentors() {
  const container = document.getElementById('mentorsGrid');
  container.innerHTML = '';

  INITIAL_MENTORS.forEach(mentor => {
    const avatarColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    const card = document.createElement('div');
    card.className = 'mentor-card';
    card.innerHTML = `
      <div class="mentor-avatar" style="background: rgba(197,241,53,.12); color: #C5F135;">${mentor.emoji}</div>
      <div class="mentor-name">${mentor.name}</div>
      <div class="mentor-skill">${mentor.skill}</div>
      <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">
        ${mentor.years}+ years experience
      </div>
      <div class="mentor-tags">
        ${mentor.tags.map(tag => `<span class="mtag" style="background: rgba(197,241,53,.12); color: #C5F135;">${tag}</span>`).join('')}
      </div>
      <button class="btn-learn" style="margin-top: 0.75rem;" onclick="contactMentor('${mentor.name}')">Connect</button>
    `;
    container.appendChild(card);
  });
}

function renderCommunityWall() {
  const container = document.getElementById('wallGrid');
  container.innerHTML = '';

  // Get posts from localStorage
  const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');

  if (posts.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 2rem;">No posts yet. Be the first to share! 🎉</div>';
    return;
  }

  posts.forEach((post, index) => {
    const avatarColors = ['#C5F135', '#FF5C28', '#3AAFFF', '#8B5CF6'];
    const avatarColor = avatarColors[index % avatarColors.length];

    const card = document.createElement('div');
    card.className = 'post-item';
    card.innerHTML = `
      <div class="post-author">
        <div class="post-av" style="background: ${avatarColor}20; color: ${avatarColor};">${post.author.charAt(0).toUpperCase()}</div>
        <div style="flex: 1;">
          <div class="post-uname">${post.author}</div>
          <div style="font-size: 0.7rem; color: #555;">${post.ward}</div>
        </div>
        <div class="post-time">${getTimeAgo(post.timestamp)}</div>
      </div>
      <div class="post-text">${post.text}</div>
      <div style="font-size: 0.8rem; color: #888; margin-bottom: 0.6rem;">
        <span style="background: rgba(197,241,53,.12); color: #C5F135; padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.7rem;">
          ${post.category}
        </span>
      </div>
      <div class="post-actions">
        <button class="post-act" onclick="likePost(${index})">👍 Like</button>
        <button class="post-act" onclick="replyPost(${index})">💬 Reply</button>
        <button class="post-act" onclick="sharePost(${index})">🔗 Share</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ============================================
//   FORM & SUBMISSION
// ============================================

function submitSkill() {
  if (!currentUser) {
    showToast('⚠️ Please login to post a skill!');
    setTimeout(() => openLoginModal(), 500);
    return;
  }

  const name = document.getElementById('f-name').value.trim();
  const ward = document.getElementById('f-ward').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const location = document.getElementById('f-location').value.trim();
  const skill = document.getElementById('f-skill').value.trim();
  const category = document.getElementById('f-cat').value.trim();
  const description = document.getElementById('f-desc').value.trim();
  const price = parseInt(document.getElementById('f-price').value) || 0;
  const availability = document.getElementById('f-availability').value.trim();

  // Validation
  if (!name || !ward || !skill || !category || !description || !phone) {
    showToast('⚠️ Please fill in all required fields!');
    return;
  }

  if (!/^\+254\d{9}$|^0\d{9}$|^7\d{8}$/.test(phone)) {
    showToast('⚠️ Please enter a valid phone number!');
    return;
  }

  // Create new skill
  const newSkill = {
    id: Math.max(...allSkills.map(s => s.id), 0) + 1,
    name,
    instructor: currentUser.fullName || name,
    instructorId: currentUser.id,
    ward,
    category,
    description,
    phone: phone || currentUser.phone,
    price,
    rating: 5,
    reviews: 1,
    availability: availability || 'Flexible',
    emoji: getEmojiForCategory(category),
    postedDate: new Date().toISOString(),
    verified: currentUser.verified || false
  };

  allSkills.push(newSkill);
  localStorage.setItem('skills', JSON.stringify(allSkills));

  // Update user's skills
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex].skills = users[userIndex].skills || [];
    users[userIndex].skills.push(newSkill.id);
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Create community post
  addCommunityPost(
    currentUser.fullName || name, 
    ward, 
    `Just posted: "${skill}" - ${description.substring(0, 80)}...`, 
    category
  );

  showToast('✅ Skill posted successfully! 🎉');
  resetForm();
  renderSkills();
  updateCategoryCounts();
  
  // Scroll to skills
  setTimeout(() => {
    document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
  }, 500);
}

function resetForm() {
  document.getElementById('f-name').value = '';
  document.getElementById('f-ward').value = '';
  document.getElementById('f-phone').value = '';
  document.getElementById('f-location').value = '';
  document.getElementById('f-skill').value = '';
  document.getElementById('f-cat').value = '';
  document.getElementById('f-desc').value = '';
  document.getElementById('f-price').value = '';
  document.getElementById('f-availability').value = '';
}

// ============================================
//   SEARCH & FILTER
// ============================================

function handleSearch() {
  const input = document.getElementById('searchInput');
  currentSearch = input.value;
  document.getElementById('filterTag').innerHTML = currentSearch 
    ? `Searching for: <strong>"${currentSearch}"</strong>` 
    : '';
  renderSkills();
}

function filterByCategory(category) {
  currentFilter = category;
  currentSearch = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('filterTag').innerHTML = category
    ? `Category: <strong>${category}</strong> <a style="cursor: pointer; color: #C5F135;" onclick="filterByCategory('')">✕</a>`
    : '';
  renderSkills();
  document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
}

function updateCategoryCounts() {
  const categories = ['Creative Arts', 'Tech & Digital', 'Food & Catering', 'Fashion & Beauty', 'Music & Audio', 'Health & Fitness', 'Photography', 'Transport & Trade'];

  categories.forEach(cat => {
    const count = allSkills.filter(s => s.category === cat).length;
    const elem = document.getElementById(`count-${cat}`);
    if (elem) {
      elem.textContent = count + ' skill' + (count !== 1 ? 's' : '');
    }
  });
}

// ============================================
//   MODAL & DETAIL VIEWS
// ============================================

function viewSkillDetails(skillId) {
  const skill = allSkills.find(s => s.id === skillId);
  if (!skill) return;

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">${skill.emoji}</div>
      <h3>${skill.name}</h3>
      <p style="color: #888; margin-bottom: 1rem;">${skill.category}</p>
    </div>
    <div style="background: #1a1a1a; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Instructor</div>
        <div style="font-weight: 600;">${skill.instructor}</div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Location</div>
        <div>${skill.ward}</div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Price</div>
        <div>KES ${skill.price}/session</div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Rating</div>
        <div>⭐ ${skill.rating} (${skill.reviews} reviews)</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Availability</div>
        <div>${skill.availability}</div>
      </div>
    </div>
    <div style="margin-bottom: 1rem;">
      <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">About this skill</div>
      <p style="font-size: 0.9rem; line-height: 1.6;">${skill.description}</p>
    </div>
    <div class="modal-contact">
      <button class="contact-opt" onclick="copyPhone('${skill.phone}')">📞 Copy Phone: ${skill.phone}</button>
      <button class="contact-opt" onclick="openWhatsApp('${skill.phone}', '${skill.name}')">💬 WhatsApp Message</button>
      <button class="contact-opt" onclick="sendEmail('${skill.instructor}')">📧 Send Email</button>
    </div>
  `;

  document.getElementById('modal').classList.add('active');
}

function viewSkillDetails(skillId) {
  const skill = allSkills.find(s => s.id === skillId);
  if (!skill) return;

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">${skill.emoji}</div>
      <h3>${skill.name}</h3>
      <p style="color: #888; margin-bottom: 1rem;">${skill.category}</p>
    </div>
    <div style="background: #1a1a1a; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Instructor</div>
        <div style="font-weight: 600;">${skill.instructor}</div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Location</div>
        <div>${skill.ward}</div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Price</div>
        <div>KES ${skill.price}/session</div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Rating</div>
        <div>⭐ ${skill.rating} (${skill.reviews} reviews)</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Availability</div>
        <div>${skill.availability}</div>
      </div>
    </div>
    <div style="margin-bottom: 1rem;">
      <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">About this skill</div>
      <p style="font-size: 0.9rem; line-height: 1.6;">${skill.description}</p>
    </div>
    <div class="modal-contact">
      <button class="contact-opt" onclick="copyPhone('${skill.phone}')">📞 Copy Phone: ${skill.phone}</button>
      <button class="contact-opt" onclick="openWhatsApp('${skill.phone}', '${skill.name}')">💬 WhatsApp Message</button>
      <button class="contact-opt" onclick="sendEmail('${skill.instructor}')">📧 Send Email</button>
    </div>
  `;

  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

function copyPhone(phone) {
  navigator.clipboard.writeText(phone);
  showToast('📋 Phone copied!');
}

function openWhatsApp(phone, skillName) {
  const text = `Hi! I'm interested in learning "${skillName}". Can you tell me more?`;
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
}

function sendEmail(instructor) {
  const subject = 'Interested in Your Skill';
  const body = 'Hi! I\'d like to learn more about your skill offering.';
  window.location.href = `mailto:${instructor}@kasarani.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function contactMentor(mentorName) {
  showToast(`✨ Connected with ${mentorName}!`);
}

// ============================================
//   COMMUNITY WALL
// ============================================

function addCommunityPost(author, ward, text, category) {
  let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
  
  posts.unshift({
    author,
    ward,
    text,
    category,
    timestamp: new Date().toISOString(),
    likes: 0
  });

  // Keep only last 50 posts
  posts = posts.slice(0, 50);
  localStorage.setItem('communityPosts', JSON.stringify(posts));
  renderCommunityWall();
}

function likePost(index) {
  let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
  if (posts[index]) {
    posts[index].likes = (posts[index].likes || 0) + 1;
    localStorage.setItem('communityPosts', JSON.stringify(posts));
    showToast('👍 Post liked!');
    renderCommunityWall();
  }
}

function replyPost(index) {
  showToast('💬 Reply feature coming soon!');
}

function sharePost(index) {
  showToast('🔗 Post shared!');
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ============================================
//   USER MANAGEMENT & AUTHENTICATION
// ============================================

function openLoginModal() {
  document.getElementById('authModal').classList.add('active');
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('registerForm').classList.remove('active');
}

function openRegisterModal() {
  document.getElementById('authModal').classList.add('active');
  document.getElementById('registerForm').classList.add('active');
  document.getElementById('loginForm').classList.remove('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function toggleAuthForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (formType === 'register') {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
  } else {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
  }
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  // Validation
  if (!email || !password) {
    showToast('⚠️ Please fill in all fields!');
    return;
  }

  if (password.length < 6) {
    showToast('⚠️ Password must be at least 6 characters!');
    return;
  }

  // Check if user exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => 
    (u.email === email || u.username === email) && 
    u.password === password
  );

  if (!user) {
    showToast('❌ Invalid email or password!');
    return;
  }

  // Login successful
  currentUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    phone: user.phone,
    ward: user.ward,
    joinDate: user.joinDate,
    avatar: generateAvatar(user.fullName),
    loginTime: new Date().toISOString()
  };

  if (rememberMe) {
    localStorage.setItem('rememberedUser', JSON.stringify(currentUser));
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  closeAuthModal();
  updateUserUI();
  showToast(`✅ Welcome back, ${user.fullName}! 🎉`);
}

function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById('regFullName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const username = document.getElementById('regUsername').value.trim().toLowerCase();
  const phone = document.getElementById('regPhone').value.trim();
  const ward = document.getElementById('regWard').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;

  // Validation
  if (!fullName || !email || !username || !phone || !ward || !password) {
    showToast('⚠️ Please fill in all fields!');
    return;
  }

  if (password.length < 8) {
    showToast('⚠️ Password must be at least 8 characters!');
    return;
  }

  if (password !== confirmPassword) {
    showToast('⚠️ Passwords do not match!');
    return;
  }

  if (!agreeTerms) {
    showToast('⚠️ Please agree to terms & conditions!');
    return;
  }

  // Check if email/username already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.email === email)) {
    showToast('⚠️ Email already registered!');
    return;
  }

  if (users.some(u => u.username === username)) {
    showToast('⚠️ Username already taken!');
    return;
  }

  // Validate phone format
  if (!/^\+254\d{9}$|^0\d{9}$|^7\d{8}$/.test(phone)) {
    showToast('⚠️ Invalid phone number format!');
    return;
  }

  // Create new user
  const newUser = {
    id: generateUserId(),
    fullName,
    email,
    username,
    phone,
    ward,
    password, // In production, hash this!
    joinDate: new Date().toISOString(),
    avatar: generateAvatar(fullName),
    skills: [],
    bookmarks: [],
    bio: '',
    verified: false
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto-login after registration
  currentUser = {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    username: newUser.username,
    phone: newUser.phone,
    ward: newUser.ward,
    joinDate: newUser.joinDate,
    avatar: newUser.avatar
  };

  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Add community post
  addCommunityPost(fullName, ward, `Just joined Skill Mtaani! Excited to share and learn skills! 🚀`, 'Community');

  closeAuthModal();
  updateUserUI();
  showToast(`✅ Account created successfully! Welcome ${fullName}! 🎉`);

  // Clear form
  event.target.reset();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('rememberedUser');
  document.getElementById('userMenu').style.display = 'none';
  updateUserUI();
  showToast('👋 Logged out successfully!');
}

function updateUserUI() {
  const userBtn = document.getElementById('userBtn');
  const userMenu = document.getElementById('userMenu');

  if (currentUser) {
    userBtn.textContent = currentUser.fullName.charAt(0).toUpperCase();
    userBtn.style.background = '#C5F135';
    userBtn.style.color = '#0E0E0E';
    userBtn.title = currentUser.fullName;
  } else {
    userBtn.textContent = '👤';
    userBtn.style.background = '#1a1a1a';
    userBtn.style.color = 'white';
    userBtn.title = 'Login / Register';
  }
}

function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function viewMyProfile() {
  if (!currentUser) {
    openLoginModal();
    return;
  }

  const modalBody = document.getElementById('modal-body');
  const userSkills = allSkills.filter(s => s.instructor === currentUser.fullName);
  
  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="width: 80px; height: 80px; border-radius: 50%; background: #C5F135; color: #0E0E0E; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;">
        ${currentUser.fullName.charAt(0).toUpperCase()}
      </div>
      <h3>${currentUser.fullName}</h3>
      <p style="color: #888; margin-bottom: 0.5rem;">@${currentUser.username}</p>
      <p style="color: #666; font-size: 0.85rem;">📍 ${currentUser.ward}</p>
    </div>

    <div style="background: #1a1a1a; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;">
      <div style="margin-bottom: 0.75rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Email</div>
        <div style="font-size: 0.9rem;">${currentUser.email}</div>
      </div>
      <div style="margin-bottom: 0.75rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Phone</div>
        <div style="font-size: 0.9rem;">${currentUser.phone}</div>
      </div>
      <div style="margin-bottom: 0.75rem;">
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Member Since</div>
        <div style="font-size: 0.9rem;">${new Date(currentUser.joinDate).toLocaleDateString()}</div>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.2rem;">Skills Posted</div>
        <div style="font-size: 0.9rem; color: #C5F135; font-weight: 700;">${userSkills.length} skills</div>
      </div>
    </div>

    ${userSkills.length > 0 ? `
      <div style="margin-bottom: 1rem;">
        <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem;">Your Skills:</div>
        ${userSkills.map(skill => `
          <div style="background: #1a1a1a; padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid #C5F135;">
            <div style="font-weight: 600; font-size: 0.9rem;">${skill.emoji} ${skill.name}</div>
            <div style="font-size: 0.8rem; color: #666;">${skill.category}</div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="text-align: center; color: #666; padding: 1rem; margin-bottom: 1rem;">
        <p>No skills posted yet!</p>
      </div>
    `}

    <button class="contact-opt" onclick="editProfile()">✏️ Edit Profile</button>
    <button class="contact-opt" onclick="logout(); closeModal()">🚪 Logout</button>
  `;

  document.getElementById('modal').classList.add('active');
}

function editProfile() {
  showToast('📝 Profile editing coming soon!');
}

function viewMySkills() {
  if (!currentUser) {
    openLoginModal();
    return;
  }

  const userSkills = allSkills.filter(s => s.instructor === currentUser.fullName);
  
  if (userSkills.length === 0) {
    showToast('📋 You haven\'t posted any skills yet!');
    return;
  }

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Your Skills (${userSkills.length})</h3>
    ${userSkills.map(skill => `
      <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${skill.emoji} ${skill.name}</div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 0.2rem;">${skill.category}</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-learn" onclick="editSkill(${skill.id})">Edit</button>
            <button class="btn-learn" style="border-color: #FF5C28; color: #FF5C28;" onclick="deleteSkill(${skill.id})">Delete</button>
          </div>
        </div>
        <div style="font-size: 0.85rem; color: #888; margin-top: 0.5rem;">${skill.description.substring(0, 100)}...</div>
      </div>
    `).join('')}
  `;

  document.getElementById('modal').classList.add('active');
}

function editSkill(skillId) {
  showToast('✏️ Skill editing coming soon!');
}

function deleteSkill(skillId) {
  if (confirm('Are you sure you want to delete this skill?')) {
    allSkills = allSkills.filter(s => s.id !== skillId);
    localStorage.setItem('skills', JSON.stringify(allSkills));
    renderSkills();
    showToast('🗑️ Skill deleted!');
    closeModal();
  }
}

function loginWithGoogle() {
  showToast('🔄 Google login coming soon!');
}

function loginWithWhatsApp() {
  showToast('🔄 WhatsApp login coming soon!');
}

// ============================================
//   HELPER FUNCTIONS
// ============================================

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

function generateAvatar(name) {
  const colors = ['#C5F135', '#FF5C28', '#3AAFFF', '#8B5CF6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ============================================
//   UTILITY FUNCTIONS
// ============================================

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function getEmojiForCategory(category) {
  const emojiMap = {
    'Creative Arts': '🎨',
    'Tech & Digital': '💻',
    'Food & Catering': '🍳',
    'Fashion & Beauty': '✂️',
    'Music & Audio': '🎵',
    'Health & Fitness': '🏋️',
    'Photography': '📸',
    'Transport & Trade': '🚗',
    'Other': '🌟'
  };
  return emojiMap[category] || '🌟';
}

// ============================================
//   SCROLL ANIMATIONS
// ============================================

function setupScrollFadeObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-fade').forEach(el => {
    observer.observe(el);
  });
}

function setupTickerAnimation() {
  const ticker = document.getElementById('ticker');
  if (ticker) {
    // Animation is CSS-based, just ensure it's working
    ticker.style.animationPlayState = 'running';
  }
}

// ============================================
//   WINDOW CLOSE HANDLERS
// ============================================

// Close menus when clicking outside
document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('userMenu');
  const userBtn = document.getElementById('userBtn');
  
  if (!userBtn.contains(event.target) && !userMenu.contains(event.target)) {
    userMenu.style.display = 'none';
  }
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});
