import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

function makeSlug(title: string, shortId: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + shortId
}

async function main() {
  // Users
  const passwordHash = await bcrypt.hash('password123', 10)

  const alice = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      passwordHash,
      displayName: 'Alice Chen',
      bio: 'Senior engineer, ex-BigTech. Navigating the post-layoff life. DMs open.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
  })
  const bob = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      passwordHash,
      displayName: 'Bob Martinez',
      bio: 'Product manager turned career coach. I help people land their next role.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
  })
  const carol = await prisma.user.create({
    data: {
      username: 'carol',
      email: 'carol@example.com',
      passwordHash,
      displayName: 'Carol Kim',
      bio: 'Frontend dev. Remote-first advocate. Writing about WLB & salary transparency.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    },
  })
  const dave = await prisma.user.create({
    data: {
      username: 'dave',
      email: 'dave@example.com',
      passwordHash,
      displayName: 'Dave Okonkwo',
      bio: 'Laid off after 6 years. Rebuilding in public. Startup founder now.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
    },
  })
  const eve = await prisma.user.create({
    data: {
      username: 'eve',
      email: 'eve@example.com',
      passwordHash,
      displayName: 'Eve Tanaka',
      bio: 'Recruiter @ Series B startup. Ask me anything about the hiring process.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    },
  })

  const users = [alice, bob, carol, dave, eve]

  // Topics
  const topicsData = [
    { name: 'Layoffs', slug: 'layoffs' },
    { name: 'Tech Careers', slug: 'tech-careers' },
    { name: 'Work-Life Balance', slug: 'wlb' },
    { name: 'Salary', slug: 'salary' },
    { name: 'Interviews', slug: 'interviews' },
    { name: 'Remote Work', slug: 'remote-work' },
  ]
  const topics = await Promise.all(
    topicsData.map(t => prisma.topic.create({ data: t }))
  )
  const [tLayoffs, tTechCareers, tWLB, tSalary, tInterviews, tRemote] = topics

  // Posts
  const postsData = [
    // THOUGHTs
    {
      authorId: alice.id,
      type: 'THOUGHT',
      body: 'Got laid off this morning. 5 years, two promotions, one reorg, and a Slack message. That\'s how it ends.',
      slug: 'got-laid-off-this-morning-a1b2',
      topicIds: [tLayoffs.id, tTechCareers.id],
    },
    {
      authorId: bob.id,
      type: 'THOUGHT',
      body: 'Hot take: the best interview prep is doing actual work. Side projects > LeetCode grinding every time.',
      slug: 'hot-take-best-interview-prep-b2c3',
      topicIds: [tInterviews.id, tTechCareers.id],
    },
    {
      authorId: carol.id,
      type: 'THOUGHT',
      body: 'Remote-first companies have better eng culture. Fight me. The overlap hours thing is a solved problem.',
      slug: 'remote-first-companies-better-culture-c3d4',
      topicIds: [tRemote.id, tWLB.id],
    },
    {
      authorId: dave.id,
      type: 'THOUGHT',
      body: 'Day 30 post-layoff: turned down a FAANG return offer to keep building my startup. Best decision I\'ve made.',
      slug: 'day-30-post-layoff-turned-down-d4e5',
      topicIds: [tLayoffs.id, tTechCareers.id],
    },
    {
      authorId: eve.id,
      type: 'THOUGHT',
      body: 'PSA: ghosting candidates after final rounds is not okay. We remember. The talent market is cyclical.',
      slug: 'psa-ghosting-candidates-final-rounds-e5f6',
      topicIds: [tInterviews.id, tTechCareers.id],
    },
    {
      authorId: alice.id,
      type: 'THOUGHT',
      body: 'Salary negotiation tip: never give the first number. "I\'m flexible, what\'s budgeted for this role?" works every time.',
      slug: 'salary-negotiation-never-first-number-a2b3',
      topicIds: [tSalary.id],
    },
    {
      authorId: bob.id,
      type: 'THOUGHT',
      body: 'Three months into my job search. 40 applications, 8 phone screens, 2 onsites, 0 offers. Keeping the streak alive.',
      slug: 'three-months-job-search-b3c4',
      topicIds: [tTechCareers.id, tInterviews.id],
    },
    {
      authorId: carol.id,
      type: 'THOUGHT',
      body: '"Work-life balance" is a lie companies tell you before the first sprint planning. It\'s work-life integration at best.',
      slug: 'wlb-lie-companies-tell-c4d5',
      topicIds: [tWLB.id],
    },
    {
      authorId: dave.id,
      type: 'THOUGHT',
      body: 'Unpopular opinion: mandatory return-to-office is just a quiet firing strategy. The numbers don\'t lie.',
      slug: 'rto-quiet-firing-strategy-d5e6',
      topicIds: [tRemote.id, tLayoffs.id],
    },
    {
      authorId: eve.id,
      type: 'THOUGHT',
      body: 'Just placed three candidates from the same layoff cohort into better roles. Sometimes getting cut is the push you needed.',
      slug: 'placed-three-candidates-same-layoff-e6f7',
      topicIds: [tLayoffs.id, tTechCareers.id],
    },
    {
      authorId: alice.id,
      type: 'THOUGHT',
      body: 'Your comp history is irrelevant. Your market value is determined by what companies are willing to pay NOW.',
      slug: 'comp-history-irrelevant-market-value-a3b4',
      topicIds: [tSalary.id],
    },
    {
      authorId: bob.id,
      type: 'THOUGHT',
      body: 'If your "culture fit" bar eliminates everyone who challenges assumptions, you don\'t have culture, you have a cult.',
      slug: 'culture-fit-bar-eliminates-b4c5',
      topicIds: [tTechCareers.id],
    },
    // ARTICLEs
    {
      authorId: alice.id,
      type: 'ARTICLE',
      title: 'What Nobody Tells You About Being Laid Off From Big Tech',
      body: `Getting laid off from a large tech company feels like falling off a cliff you didn't know was there. One day you're in sprint planning arguing about story points, the next day your badge doesn't work and your laptop remotely wipes itself. I went through this six months ago, and I want to share what I wish someone had told me.

The first thing that hits you isn't financial panic — it's identity. So much of who I was had become synonymous with my employer. I introduced myself at parties by company name. My sense of competence was tied to my team's OKRs. Without that scaffolding, you feel unmoored in a way that's genuinely disorienting.

The practical advice everyone gives you — update your LinkedIn, activate your network, start applying immediately — is correct but incomplete. What they don't tell you is to grieve first. Give yourself two weeks. Don't force productivity. The people who burn out hardest during job searches are the ones who treated day one like day one of a new job.

The second thing: your skills are more portable than you think, and the market outside Big Tech is hungry for them. I landed at a mid-stage startup at 20% more base salary with meaningful equity. The "prestige" of my previous employer helped exactly once — in the first conversation with a recruiter. After that, what mattered was what I had actually built.`,
      slug: makeSlug('What Nobody Tells You About Being Laid Off From Big Tech', 'a4b5'),
      topicIds: [tLayoffs.id, tTechCareers.id],
    },
    {
      authorId: carol.id,
      type: 'ARTICLE',
      title: 'The Real Cost of Return-to-Office Mandates',
      body: `When my previous employer announced a three-days-a-week in-office requirement, they framed it as "investing in collaboration." What they didn't account for was a two-hour daily commute multiplied across hundreds of engineers. I did the math: 500 hours per year, roughly 12 working weeks, gone.

The productivity argument for in-office work has never been convincingly demonstrated for knowledge workers. Every study I've seen either has methodological issues or was funded by commercial real estate interests. Meanwhile, the evidence for autonomous, flexible work is robust: lower attrition, higher output quality, and meaningfully better scores on engagement surveys.

What RTO mandates actually do is create a two-tier workforce: those who can afford to live close to expensive urban offices, and those who cannot. This disproportionately affects caregivers, people with disabilities, and early-career workers who haven't yet accumulated enough savings to absorb the cost increase.

If you're a manager reading this, I'm not saying in-person time has zero value. Offsites, team launches, and critical whiteboarding sessions benefit from physical presence. But mandatory seat-warming five days a week is a relic of factory-floor management applied to knowledge work, and the best engineers in your organization know it.`,
      slug: makeSlug('The Real Cost of Return-to-Office Mandates', 'c5d6'),
      topicIds: [tRemote.id, tWLB.id],
    },
    {
      authorId: bob.id,
      type: 'ARTICLE',
      title: 'How to Negotiate a 40% Salary Increase Without Lying',
      body: `I've coached over 200 professionals through salary negotiations and the single biggest mistake I see is going in without data. Not vibes about what you "deserve" — actual market data. Levels.fyi, Glassdoor, Blind, LinkedIn Salary, and your own network are your tools. Triangulate across at least three sources before you walk into any conversation.

The second mistake is negotiating against your current or previous salary. That number is irrelevant to your market value. Employers know this, which is why many jurisdictions have banned salary history questions. If a recruiter asks, say: "I'd prefer to focus on what this role is worth in the current market." Then pivot to your research.

Technique: always negotiate via email after verbal offers. This gives you time to think, creates a paper trail, and removes the social pressure of real-time conversation. Write something like: "I'm really excited about this opportunity. Based on my research and the scope of the role, I was expecting something closer to $X. Is there flexibility there?" Simple, professional, and it works.

The third point: salary is only one lever. Signing bonuses, equity grants, additional PTO, remote flexibility, and accelerated review timelines are all negotiable. I've helped people get $40K signing bonuses when base was maxed out. Never accept that "the number is final" without testing every other dimension first.`,
      slug: makeSlug('How to Negotiate a 40% Salary Increase Without Lying', 'b5c6'),
      topicIds: [tSalary.id, tTechCareers.id],
    },
    {
      authorId: dave.id,
      type: 'ARTICLE',
      title: 'Six Months of Building in Public: What I Learned',
      body: `When I got laid off, a friend told me to start a newsletter and share my journey publicly. I thought it was self-indulgent nonsense. Six months later, that newsletter has 4,000 subscribers, two of whom are now my co-founders.

Building in public forces a kind of discipline that private building doesn't. When you know you'll have to explain your decisions to an audience, you make better decisions. You slow down before pivoting. You document your reasoning. You ask for feedback earlier than feels comfortable.

The counterintuitive thing about vulnerability online is that it attracts the people you actually want in your corner. My first ten subscribers were people I'd never met who reached out after I wrote about failing to close a seed check. They didn't pity me — they offered introductions, advice, and in one case, a co-working space for free.

If I could go back and change one thing, I'd have started earlier. The stigma of layoffs is dissolving. Nobody reads "built in stealth" on a founder profile and thinks strength anymore. They think fear. Transparency isn't just personally cathartic — it's a competitive advantage when you're trying to build trust with customers, investors, and teammates.`,
      slug: makeSlug('Six Months of Building in Public What I Learned', 'd6e7'),
      topicIds: [tLayoffs.id, tTechCareers.id],
    },
    {
      authorId: eve.id,
      type: 'ARTICLE',
      title: 'Inside the Hiring Process: What Recruiters Actually Think',
      body: `I've been a recruiter for eight years. I've reviewed tens of thousands of resumes, scheduled thousands of interviews, and delivered hundreds of offers and rejections. Here's what I actually think when I'm looking at your application.

Your resume has 7 seconds. Not a figure of speech — eye-tracking studies confirm it. The single most valuable thing you can do is lead with impact, not responsibility. "Reduced API latency by 60%, improving p95 response time from 800ms to 320ms" is infinitely more interesting than "responsible for backend performance optimization." Employers buy outcomes, not activities.

On interviews: the best interviewers are trying to disqualify themselves from rejecting you. We want to hire — open positions are painful. When a candidate struggles, a good interviewer pivots to an easier angle or asks clarifying questions. If you feel like your interviewer is rooting against you, that's signal about the team culture, not your performance.

On ghosting: it's a systemic failure, not a personal slight. Most ATS systems don't enforce follow-up SLAs. Recruiters carry 40+ open roles. None of that excuses the behavior — we should do better — but it's not about you. Always follow up twice. After the second unanswered follow-up, you have your answer.`,
      slug: makeSlug('Inside the Hiring Process What Recruiters Actually Think', 'e7f8'),
      topicIds: [tInterviews.id, tTechCareers.id],
    },
    {
      authorId: carol.id,
      type: 'ARTICLE',
      title: 'Burnout Is Not a Badge of Honor',
      body: `Somewhere in the last decade of tech culture, working yourself into the ground became aspirational. "I only slept four hours" became a flex. Responding to Slack at 11pm became a sign of commitment rather than a sign of dysfunction. I participated in this culture for six years and paid for it with a three-month medical leave.

Burnout isn't just tiredness. It's a specific physiological and psychological state characterized by exhaustion, cynicism, and reduced efficacy. The cruel irony is that the people most susceptible to burnout are the most conscientious — the ones who care most about doing good work. Companies that cultivate burnout culture are, over the long run, consuming their best people.

Recovery from burnout doesn't look like a vacation. It looks like restructuring your relationship with work at a fundamental level. For me, that meant setting hard stops, being ruthless about meeting quality, and learning to measure my contribution in outcomes rather than hours. It also meant accepting that a job that requires my burnout doesn't deserve my best work.

The systemic fix has to come from leadership, not individuals. But while we're waiting for that, here's what I tell every early-career engineer I mentor: protect your capacity as aggressively as you protect your codebase. Technical debt and personal debt compound the same way.`,
      slug: makeSlug('Burnout Is Not a Badge of Honor', 'c6d7'),
      topicIds: [tWLB.id, tTechCareers.id],
    },
  ]

  const posts = await Promise.all(
    postsData.map(({ topicIds, ...postData }) =>
      prisma.post.create({
        data: {
          ...postData,
          topics: {
            create: topicIds.map(topicId => ({ topicId })),
          },
        },
      })
    )
  )

  // Comments
  const commentsData = [
    // Post 0 (alice layoff thought)
    { postId: posts[0].id, authorId: bob.id, body: 'This hit hard. I\'m sorry. Sending DM.' },
    { postId: posts[0].id, authorId: carol.id, body: 'The Slack message thing is brutal. Companies need to do better.' },
    { postId: posts[0].id, authorId: dave.id, body: 'Been there. It gets better faster than you expect.' },
    // Post 1 (bob interview thought)
    { postId: posts[1].id, authorId: alice.id, body: 'Partially agree but LeetCode is table stakes at many companies still.' },
    { postId: posts[1].id, authorId: eve.id, body: 'As a recruiter: the portfolio matters more than you think in initial screens.' },
    // Post 2 (carol remote thought)
    { postId: posts[2].id, authorId: dave.id, body: '100%. Async-first is a superpower when done right.' },
    // Post 3 (dave day 30)
    { postId: posts[3].id, authorId: alice.id, body: 'Love this. What\'s the startup building?' },
    { postId: posts[3].id, authorId: bob.id, body: 'Bold move. Rooting for you.' },
    // Post 4 (eve ghosting PSA)
    { postId: posts[4].id, authorId: alice.id, body: 'Thank you for saying this publicly. It\'s not a small thing.' },
    { postId: posts[4].id, authorId: carol.id, body: 'I once waited 6 weeks only to find out the role was canceled. No communication. Never applied there again.' },
    // Article: alice layoff
    { postId: posts[12].id, authorId: bob.id, body: 'The identity point is something more people need to talk about. We are not our employers.' },
    { postId: posts[12].id, authorId: dave.id, body: 'I literally had the same experience. Startup life has been so much more clarifying.' },
    { postId: posts[12].id, authorId: carol.id, body: 'The grieving step is underrated. I rushed past it and paid the price.' },
    { postId: posts[12].id, authorId: eve.id, body: 'I send this article to every candidate I work with who just got laid off.' },
    // Article: carol RTO
    { postId: posts[13].id, authorId: alice.id, body: 'The two-tier workforce point is so real and so rarely acknowledged.' },
    { postId: posts[13].id, authorId: bob.id, body: 'My company went hybrid and attrition dropped by a third. The data is clear.' },
    // Article: bob salary
    { postId: posts[14].id, authorId: alice.id, body: 'The email negotiation tip changed my life. Used it last month. Got $15k more.' },
    { postId: posts[14].id, authorId: carol.id, body: 'The signing bonus lever is real. Companies have more flexibility there than on base.' },
    { postId: posts[14].id, authorId: dave.id, body: 'Saved this. Sharing with everyone I know in job search mode.' },
    // Article: dave building in public
    { postId: posts[15].id, authorId: alice.id, body: 'The co-founders finding you through the newsletter is such a great outcome.' },
    { postId: posts[15].id, authorId: eve.id, body: 'Building in public also helps candidates stand out. I notice it every time.' },
    // Article: eve hiring process
    { postId: posts[16].id, authorId: alice.id, body: 'The 7 seconds thing is terrifying and useful in equal measure.' },
    { postId: posts[16].id, authorId: bob.id, body: 'The "rooting against you" signal about culture is something I\'ve experienced. Wish I\'d trusted it.' },
    { postId: posts[16].id, authorId: carol.id, body: 'Appreciate the honesty about ghosting being systemic. Helps to know it\'s not personal.' },
    // Article: carol burnout
    { postId: posts[17].id, authorId: alice.id, body: 'This should be required reading for every new manager.' },
    { postId: posts[17].id, authorId: dave.id, body: 'The technical debt analogy is perfect. Stealing that.' },
    { postId: posts[17].id, authorId: bob.id, body: 'Three month medical leave took courage to share. Thank you for writing this.' },
    // Some thought posts with extra comments
    { postId: posts[5].id, authorId: bob.id, body: 'Anchored by the first number is one of the oldest tricks. Smart.' },
    { postId: posts[8].id, authorId: carol.id, body: 'The quiet firing framing is exactly right. They know what they\'re doing.' },
    { postId: posts[10].id, authorId: eve.id, body: 'Trying to explain this to candidates constantly. Current salary = irrelevant.' },
  ]

  const comments = await Promise.all(
    commentsData.map(c => prisma.comment.create({ data: c }))
  )

  // Add some replies
  await prisma.comment.create({
    data: {
      postId: posts[0].id,
      authorId: alice.id,
      body: 'Thank you all. Honestly needed this today.',
      parentId: comments[0].id,
    },
  })
  await prisma.comment.create({
    data: {
      postId: posts[12].id,
      authorId: alice.id,
      body: 'Really means a lot. Writing it helped me process it too.',
      parentId: comments[13].id,
    },
  })
  await prisma.comment.create({
    data: {
      postId: posts[14].id,
      authorId: bob.id,
      body: 'That\'s an amazing outcome! What industry?',
      parentId: comments[16].id,
    },
  })

  // Likes — ~50 spread across users and posts
  const likeData: { userId: string; postId: string }[] = []
  const addLike = (userId: string, postId: string) => {
    if (!likeData.find(l => l.userId === userId && l.postId === postId)) {
      likeData.push({ userId, postId })
    }
  }

  // Everyone likes the top articles
  users.forEach(u => addLike(u.id, posts[12].id)) // alice layoff article
  users.forEach(u => addLike(u.id, posts[13].id)) // carol RTO article
  users.forEach(u => addLike(u.id, posts[14].id)) // bob salary article
  // Mix of thought likes
  ;[alice, bob, carol].forEach(u => addLike(u.id, posts[0].id))
  ;[alice, dave, eve].forEach(u => addLike(u.id, posts[1].id))
  ;[bob, carol, dave].forEach(u => addLike(u.id, posts[2].id))
  ;[alice, carol, eve].forEach(u => addLike(u.id, posts[3].id))
  ;[alice, bob, carol, dave].forEach(u => addLike(u.id, posts[4].id))
  ;[bob, carol, dave].forEach(u => addLike(u.id, posts[5].id))
  ;[alice, carol].forEach(u => addLike(u.id, posts[6].id))
  ;[dave, eve].forEach(u => addLike(u.id, posts[7].id))
  ;[alice, bob, eve].forEach(u => addLike(u.id, posts[8].id))
  ;[bob, carol].forEach(u => addLike(u.id, posts[9].id))
  // Articles
  ;[alice, bob].forEach(u => addLike(u.id, posts[15].id))
  ;[carol, dave, eve].forEach(u => addLike(u.id, posts[16].id))
  ;[alice, bob, carol, dave].forEach(u => addLike(u.id, posts[17].id))

  await Promise.all(likeData.map(l => prisma.like.create({ data: l })))

  // Follows
  const followData = [
    { followerId: alice.id, followingId: bob.id },
    { followerId: alice.id, followingId: carol.id },
    { followerId: alice.id, followingId: eve.id },
    { followerId: bob.id, followingId: alice.id },
    { followerId: bob.id, followingId: dave.id },
    { followerId: carol.id, followingId: alice.id },
    { followerId: carol.id, followingId: eve.id },
    { followerId: dave.id, followingId: alice.id },
    { followerId: dave.id, followingId: bob.id },
    { followerId: dave.id, followingId: carol.id },
    { followerId: eve.id, followingId: bob.id },
    { followerId: eve.id, followingId: carol.id },
  ]
  await Promise.all(followData.map(f => prisma.follow.create({ data: f })))

  console.log('Seed complete:')
  console.log(`  Users: ${users.length}`)
  console.log(`  Topics: ${topics.length}`)
  console.log(`  Posts: ${posts.length}`)
  console.log(`  Comments: ${commentsData.length + 3} (including replies)`)
  console.log(`  Likes: ${likeData.length}`)
  console.log(`  Follows: ${followData.length}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
