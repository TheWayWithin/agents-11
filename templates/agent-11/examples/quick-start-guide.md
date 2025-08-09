# Agent-11 Quick Start Guide

Get productive with Agent-11 in 15 minutes. This guide shows you the essential patterns for maximum impact.

## 🚀 Your First 5 Minutes

### 1. Test Single Agent (2 minutes)
```bash
@developer What technologies do you specialize in?
```
**Expected Response**: List of technologies and capabilities

### 2. Test Coordination (3 minutes)
```bash
@coordinator I need help planning a simple website project with user authentication and a dashboard. What agents would you recommend and in what order?
```
**Expected Response**: Project breakdown with agent recommendations

## 🎯 Essential Patterns

### Pattern 1: Simple Tasks → Single Agent
When you need focused work in one domain:

```bash
# Code fixes
@developer Fix the login validation bug - users can submit empty forms

# Design feedback  
@designer Review this user registration flow for UX improvements

# Documentation
@documenter Create API documentation for my user authentication endpoints
```

### Pattern 2: Complex Projects → Coordinator
When you need multiple skills working together:

```bash
@coordinator Build complete user onboarding system:
- Email verification and welcome sequence
- User profile setup with avatar upload
- Dashboard tour and feature introduction
- Analytics tracking for conversion optimization
Timeline: 1 week, focus on conversion rate optimization
```

### Pattern 3: Mission Templates → Structured Workflows
When you want proven processes:

```bash
@coordinator Use MISSION-BUILD to add payment processing to my SaaS

@coordinator Use MISSION-OPTIMIZE to improve my app's performance

@coordinator Use MISSION-SECURITY to audit my application for vulnerabilities
```

## 💼 Real-World Examples

### Solopreneur Building SaaS MVP

**Day 1: Foundation**
```bash
@coordinator Plan MVP for project management SaaS:
- User auth with email verification
- Project creation and basic task management
- Simple dashboard with project overview
- Mobile-responsive design
- Must launch in 10 days for beta users
```

**Day 5: First Feature Addition**
```bash
@developer Add team collaboration features:
- Invite team members to projects
- Real-time activity feed
- Basic role permissions (admin/member)
- Email notifications for activity
```

**Day 8: Pre-Launch Polish**
```bash
@tester Comprehensive testing before beta launch:
- All user flows working correctly
- Mobile responsiveness validated
- Performance under expected load
- Security basics covered
```

### Agency Project Workflow

**Client Discovery Phase**
```bash
@strategist Analyze client requirements for e-commerce redesign:
- Current site performance and conversion issues
- Target customer analysis and user journeys
- Competitive landscape and best practices
- Technical constraints and integration needs
- Recommended approach with timeline and budget
```

**Technical Planning**
```bash
@architect Design scalable e-commerce architecture:
- Modern headless commerce approach
- Integration with existing ERP and inventory
- Performance optimization for mobile
- SEO and conversion optimization
- Security and PCI compliance requirements
```

**Development Execution**
```bash
@coordinator Execute e-commerce redesign project:
Phase 1: Core functionality (2 weeks)
Phase 2: Advanced features (2 weeks)  
Phase 3: Testing and optimization (1 week)
Full team coordination with weekly client updates
```

## 🔧 Power User Tips

### Batch Related Tasks
Instead of separate requests, batch similar work:

```bash
@developer Complete authentication system:
1. Email/password registration with validation
2. Login with remember me functionality
3. Password reset flow with secure tokens
4. Email verification for new accounts
5. Basic profile management page
Include unit tests and error handling throughout
```

### Provide Rich Context
Help agents deliver better results with context:

```bash
@designer Design user dashboard for B2B SaaS:

Context: 
- Users: Operations managers at 50-500 person companies
- Primary use: Monitor team performance and project status
- Device: Primarily desktop, some tablet usage
- Brand: Professional, trustworthy, efficient (not flashy)
- Constraints: Must work with existing component library

Key metrics to display:
- Team productivity trends
- Project completion rates  
- Budget vs actual spending
- Upcoming deadlines and risks
```

### Chain Agent Work
Use output from one agent as input for another:

```bash
# Step 1: Strategy
@strategist Create user stories for customer support ticketing system

# Step 2: Architecture (after reviewing strategy output)
@architect Design technical architecture for the ticketing system requirements from the strategist analysis above

# Step 3: Implementation (after reviewing architecture)
@developer Implement the ticketing system based on the architecture plan above
```

## ❌ Common Mistakes to Avoid

### Mistake 1: Vague Requests
```bash
# Too vague
@developer Make my app better

# Better
@developer Optimize the dashboard loading speed - it currently takes 3-5 seconds, target is under 1 second
```

### Mistake 2: Wrong Agent Selection
```bash
# Wrong - asking technical agent for business strategy
@developer What features should I build next?

# Right - asking strategic agent for business decisions
@strategist Based on user feedback and market analysis, what features should I prioritize for next quarter?
```

### Mistake 3: Overwhelming Single Agent
```bash
# Too complex for single agent
@developer Build complete social media platform with authentication, posts, comments, messaging, notifications, analytics, and admin dashboard

# Better - use coordinator for complex projects
@coordinator Build social media platform MVP with core features, organized into development phases
```

## 🎯 Success Checklist

After 1 week of using Agent-11, you should be able to:

- [ ] Get specific help from individual agents for focused tasks
- [ ] Use @coordinator effectively for multi-step projects  
- [ ] Reference mission templates for structured workflows
- [ ] Provide clear context and requirements in your requests
- [ ] Chain agent outputs for complex workflows
- [ ] Distinguish when to use single agents vs coordination

## 📈 Scaling Your Usage

### Week 1: Individual Agents
Focus on learning each agent's strengths and getting comfortable with direct requests.

### Week 2: Basic Coordination
Start using @coordinator for projects requiring 2-3 agents working together.

### Week 3: Mission Templates
Explore mission templates for common workflows like MISSION-BUILD and MISSION-OPTIMIZE.

### Week 4: Advanced Workflows
Create custom workflows combining multiple agents and mission templates for your specific business needs.

## 🆘 When Things Don't Work

### Agent Scope Issues
If an agent says a task is outside their scope:
1. Check the agent's SCOPE BOUNDARIES in their documentation
2. Use @coordinator to orchestrate multiple agents
3. Try breaking the request into smaller, focused tasks

### Quality Issues
If output doesn't meet your standards:
1. Provide more specific requirements and context
2. Request code review from @tester before implementation
3. Ask for incremental delivery with validation checkpoints

### Coordination Problems
If multi-agent projects get confusing:
1. Always start with @coordinator for complex projects
2. Provide clear timeline and priority constraints
3. Ask for regular status updates and milestone validation

---

**Ready to level up?** Try the [Advanced Workflows Guide](advanced-workflows.md) for complex multi-agent orchestration patterns.