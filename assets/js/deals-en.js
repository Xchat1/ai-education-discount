/**
 * AI Student Deals · English Deal Translations (DEALS_EN)
 * Comprehensive English data for all 40 curated deals
 */

const DEALS_EN = {
  'gemini': {
    name: 'Google Gemini for Students',
    duration: 'Free for 12 Months',
    value: '$239.88',
    tags: ['12 Months', '5TB Storage', 'Deep Research'],
    summary: 'US college students get 12 months of Google AI Pro free; outside the US in 140+ countries/regions, Google AI Plus student perks are available.',
    highlights: [
      '🇺🇸 Free 12 months Google AI Pro ($19.99/mo value × 12)',
      'Advanced Gemini models + Higher rate limits + Deep Research',
      '5TB Google One cloud storage (US) / 400GB (Global)',
      'Built-in Google AI across Gmail, Docs, Sheets & Slides',
      'Study tools: Study Notebook, Flashcards, and Practice Quizzes',
      'Standardized test prep quizzes (ACT, AP, GRE, LSAT, MCAT, SAT, etc. with The Princeton Review)',
      'Interactive 3D visuals generated in Gemini and Google Search to explain complex STEM concepts'
    ],
    notes: 'Re-opened Aug 19, 2026. US students must redeem by 2026-12-31. Requirements: 18+, enrolled in accredited college, student verification, valid payment method on file (no upfront charge). ⚠️ Auto-renews at standard price ($19.99/mo in US) after free period ends; set a calendar reminder to cancel if needed.'
  },
  'chatgpt': {
    name: 'ChatGPT Plus Student Discount',
    duration: 'Free for 4 Months',
    value: '$80',
    tags: ['4 Months', '$20/mo Value', 'SheerID'],
    summary: 'Eligible US undergraduate and graduate students can get 4 months of ChatGPT Plus free via SheerID verification before Oct 31, 2026.',
    highlights: [
      'Free 4 months of ChatGPT Plus (4 × $20 = $80 value)',
      'Available for full-time and part-time undergraduate and graduate students',
      'Requires eligible US institution + SheerID student verification',
      'ChatGPT account email does not need to match your school .edu email',
      'If your university provides ChatGPT Edu, you already have free Plus-level access'
    ],
    notes: '⚠️ Conflicting reports: OpenAI Help Center lists back-to-school student offers, but several third-party reports indicate regular standalone student tiers may vary by region. Always confirm on official page before applying.'
  },
  'codex': {
    name: 'ChatGPT Codex Student Credits',
    duration: '12 Months Validity',
    value: '$100',
    tags: ['$100 Credits', '2,500 Credits', 'US & Canada'],
    summary: 'Eligible college students in the US and Canada can receive $100 Codex Credits (approx. 2,500 credits) for AI coding and Agent tasks.',
    highlights: [
      '$100 Codex usage credits (approx. 2,500 credits)',
      'Applicable for Codex, AI pair programming, code refactoring, and agentic workflows',
      'In-product ChatGPT/Codex credits (distinct from standard OpenAI API credits)',
      'Valid for 12 months after redemption'
    ],
    notes: 'Currently restricted to accredited students in 🇺🇸 US and 🇨🇦 Canada. Highly recommended for computer science and software engineering students.'
  },
  'claude': {
    name: 'Claude Student Opportunities',
    duration: 'Campaign-based',
    value: '—',
    tags: ['Promotional', 'Edu Programs'],
    summary: 'Anthropic does not offer a permanent global student discount, but provides educational partnership programs and startup grants.',
    highlights: [
      'World-class long-form reasoning, paper polishing, and codebase refactoring',
      'Look out for campus partnership programs and back-to-school windows',
      'Students with university Claude for Education agreements get free access',
      'Pay-as-you-go API is very affordable for light personal projects ($3–$5/month)'
    ],
    notes: '⚠️ Anthropic currently maintains uniform standard pricing for Pro ($20/mo). Educational access primarily comes through institutional Claude for Education agreements or Claude for Startups.'
  },
  'perplexity': {
    name: 'Perplexity Student Plan',
    duration: 'Regional / Campaign-based',
    value: '—',
    tags: ['Deep Search', 'Citations', 'Student Promo'],
    summary: 'An essential tool for research, literature review, and fact-checking. Student discounts are offered regionally or during promotional seasons.',
    highlights: [
      'Academic citation search with inline source verification',
      'Deep Research autonomous investigation mode',
      'All-in-one search across news, academic papers, and technical docs'
    ],
    notes: 'Perks vary by campaign. Education Pro has been offered at approx. $10/month or $4.99/month with SheerID verification (regular $20/mo). Check the official Perplexity Students page for active offers.'
  },
  'github-pack': {
    name: 'GitHub Student Developer Pack',
    duration: 'Valid for Student Career',
    value: '$400+ Perks',
    tags: ['80+ Perks', 'King of Freebies', '2-Yr Recheck'],
    summary: 'The undisputed gold standard of student perks. Includes 80+ developer tools, free cloud credits, domain names, and developer subscriptions.',
    highlights: [
      '80+ developer tools and partner company perks',
      'Includes access to Copilot, Notion, Overleaf, free domains, and cloud credits',
      'Valid for approx. 2 years per verification round',
      'Most university emails worldwide are approved within minutes',
      'DigitalOcean $200 credits, Azure $100 credits, Namecheap free .me domain + SSL',
      '1Password free for 1 year, Educative 6-month access, MongoDB Atlas credits'
    ],
    notes: 'Official terms: verification valid for 2 years; re-verify upon expiration. Open to students aged 13+ enrolled in degree/diploma courses. If domain is unlisted, upload dated student ID or enrollment letter.'
  },
  'github-pro': {
    name: 'GitHub Pro (Free for Students)',
    duration: 'Free While Student',
    value: '$48/yr',
    tags: ['Private Repos', 'Codespaces', 'Actions'],
    summary: 'Free GitHub Pro upgrade for verified students, unlocking advanced private repo features, Codespaces, and GitHub Actions minutes.',
    highlights: [
      'Advanced tools for private repositories',
      'Generous GitHub Codespaces cloud dev environment quota',
      'Additional monthly GitHub Actions build minutes',
      'Enhanced pull request code review and collaboration features'
    ],
    notes: 'Activated automatically when your GitHub Student Developer Pack is approved.'
  },
  'copilot': {
    name: 'GitHub Copilot for Students',
    duration: 'Free While Student',
    value: '$120+/yr',
    tags: ['Unlimited Completion', 'Agent Mode', 'AI Credits'],
    summary: 'One of the most valuable perks in the Student Pack: unlimited code completions + Copilot Chat + multi-file edits + GitHub AI Credits.',
    highlights: [
      'Unlimited code completions in VS Code, JetBrains, and Xcode',
      'Copilot Chat with multi-file code editing and codebase context understanding',
      'Autonomous Agent capabilities and automated debugging',
      'Monthly allocation of GitHub AI Credits for advanced models',
      'Code completions and next-edit suggestions do not consume AI credits'
    ],
    notes: 'Requires verified GitHub Education student status. Teachers and popular open-source maintainers are also eligible for free access.'
  },
  'cursor': {
    name: 'Cursor Student Plan',
    duration: 'Student Perks',
    value: '$100',
    tags: ['AI IDE', 'Agent Coding', 'Dynamic'],
    summary: 'The benchmark AI-first code editor: Autonomous Agent, multi-file code generation, codebase indexing, and instant debugging.',
    highlights: [
      'AI Coding with full Agent execution mode',
      'Multi-file editing with deep codebase context',
      'AI Debugging and automatic error resolution'
    ],
    notes: '⚠️ Verification policies change frequently. Check cursor.com/students for current availability. Alternative options include Windsurf, AWS Kiro, and GitHub Copilot.'
  },
  'jetbrains': {
    name: 'JetBrains Student License',
    duration: 'Free While Student',
    value: '$200+/yr',
    tags: ['Full Suite', 'Free License', 'Annual Renewal'],
    summary: 'Free student license covering JetBrains complete professional IDE pack: IntelliJ IDEA, PyCharm, WebStorm, GoLand, CLion, DataGrip, and Rider.',
    highlights: [
      'Full commercial editions of all JetBrains IDEs',
      'Covers Java, Python, Web, Go, C++, SQL, Rust, and .NET development',
      'Instant approval with university email or official student ID'
    ],
    notes: 'Renewable annually as long as you maintain active student status.'
  },
  'replit': {
    name: 'Replit Education',
    duration: 'Dynamic Student Perks',
    value: '—',
    tags: ['Cloud IDE', 'Instant Deploy', 'Agent'],
    summary: 'Cloud-based AI IDE with built-in Agent and zero-config deployment. Ideal for hackathons, web apps, and AI SaaS prototypes.',
    highlights: [
      'Browser-based collaborative IDE with zero installation',
      'Replit Agent for full-stack app prototyping from prompts',
      'One-click deployment to custom domains'
    ],
    notes: 'Educational features and student tiers are dynamically adjusted. Visit replit.com/education for current terms.'
  },
  'azure': {
    name: 'Azure for Students',
    duration: '12 Months Validity',
    value: '$100',
    tags: ['$100 Credits', 'No Credit Card', 'Azure OpenAI'],
    summary: '$100 in Azure credits valid for 12 months with no credit card required. Perfect for hosting web apps, APIs, AI agents, databases, and Docker containers.',
    highlights: [
      '$100 Azure cloud credits valid for 1 year',
      'Zero credit card required at registration',
      '20+ always-free services + 65+ permanent free tier resources',
      'Can be used for Azure OpenAI, Virtual Machines, Cosmos DB, Functions, and App Services'
    ],
    notes: 'One of the most accessible cloud packages for students. Simply register with your school email.'
  },
  'aws-educate': {
    name: 'AWS Educate',
    duration: 'Always Free',
    value: 'Free',
    tags: ['Free', 'Learning Paths', 'Labs'],
    summary: 'Free learning platform open to anyone, featuring hands-on cloud labs, AWS sandbox training, and certified badge courses.',
    highlights: [
      '100% free with no credit card required',
      'Structured learning paths in Cloud Architecture, AI, and Machine Learning',
      'Hands-on lab environments for EC2, S3, RDS, and DynamoDB'
    ],
    notes: 'Excellent foundation for learning cloud architecture. Pair with Azure $100 credits for live production deployments.'
  },
  'gcp-edu': {
    name: 'Google Cloud Education',
    duration: 'Program-based',
    value: '—',
    tags: ['Cloud Credits', 'Vertex AI', 'BigQuery'],
    summary: 'Google Cloud grants educational credits for university coursework and research, featuring access to Vertex AI and BigQuery.',
    highlights: [
      'Coursework and academic research compute credits',
      'Access to Vertex AI, BigQuery, and Cloud Run',
      'Select research programs provide GPU allocation'
    ],
    notes: 'Check with your academic department or course instructor to see if your university has an active Google Cloud faculty grant.'
  },
  'm365': {
    name: 'Microsoft 365 Student Edition',
    duration: '12-Month Premium / Free Web',
    value: '$120',
    tags: ['12-Mo Premium', 'Copilot Discount', 'Free Web'],
    summary: 'University students can claim 12 months of Microsoft 365 Premium with school email; free web versions of Word, Excel, and PowerPoint are always free.',
    highlights: [
      'Free Microsoft 365 Web apps: Word, Excel, PowerPoint, OneNote',
      'Limited-time: Eligible college students get 12 months Microsoft 365 Premium',
      '50% discount on Microsoft 365 with Copilot in select regions'
    ],
    notes: 'Verify availability via Microsoft Education portal with your school email domain.'
  },
  'notion': {
    name: 'Notion for Education',
    duration: 'Education Plan',
    value: '$60',
    tags: ['Knowledge Base', 'Second Brain', 'AI Workflows'],
    summary: 'Free Plus plan upgrade for students and educators. Build your second brain, course notes, research tracker, and project roadmaps.',
    highlights: [
      'Unlimited pages and blocks with 30-day version history',
      'Full collaboration and workspace sharing capabilities',
      'Course schedules, thesis outlines, and literature management',
      'Accessible directly via GitHub Student Developer Pack'
    ],
    notes: 'Instant activation with an accredited student email. Note: heavy Notion AI usage requires a separate add-on.'
  },
  'overleaf': {
    name: 'Overleaf Student Plan',
    duration: 'Student / Education',
    value: '$40',
    tags: ['LaTeX', 'IEEE/ACM', 'Paper Collab'],
    summary: 'The premier collaborative LaTeX editor for academic research, IEEE/ACM papers, graduate theses, and scientific publications.',
    highlights: [
      'Real-time collaborative LaTeX writing and instant compilation',
      'Huge template library for IEEE, Springer, ACM, and university theses',
      'Included perk entry via GitHub Student Developer Pack'
    ],
    notes: 'High priority for graduate students, postgrads, and STEM researchers.'
  },
  'kaggle': {
    name: 'Kaggle',
    duration: 'Perpetual Free',
    value: 'Free',
    tags: ['Free GPU', 'Datasets', 'Competitions'],
    summary: 'The leading data science and ML community. Provides free interactive Jupyter notebooks with free GPU/TPU hours and public datasets.',
    highlights: [
      'Free weekly GPU (P100/T4) and TPU compute allocation',
      'Tens of thousands of curated open-source datasets',
      'World-class machine learning competitions and structured micro-courses'
    ],
    notes: 'Zero cost and open to everyone worldwide. No academic credentials required.'
  },
  'colab': {
    name: 'Google Colab',
    duration: 'Perpetual Free Tier',
    value: 'Free Tier',
    tags: ['Free GPU', 'Notebooks', 'Cloud Drive'],
    summary: 'The easiest way to run Python code with free GPU acceleration directly in your browser. Seamlessly integrates with Google Drive.',
    highlights: [
      'Free GPU/TPU hardware acceleration',
      'Jupyter Notebook interface in the cloud with zero local configuration',
      'Direct integration with Google Drive and GitHub'
    ],
    notes: 'Usage limits reset dynamically. Ideal for introductory deep learning and coursework.'
  },
  'huggingface': {
    name: 'Hugging Face',
    duration: 'Perpetual / Ongoing',
    value: 'Free / Student',
    tags: ['Model Hub', 'Free Hosting', 'Spaces'],
    summary: 'The GitHub of AI. Host models, deploy interactive Gradio/Streamlit demos on Spaces for free, and download open-weight LLMs.',
    highlights: [
      'Hundreds of thousands of open-source models and datasets',
      'Free Spaces hosting for AI demo applications',
      'Inference API access and active open-source community'
    ],
    notes: 'Essential infrastructure for every AI student and researcher.'
  },
  'datacamp': {
    name: 'DataCamp Student Discount',
    duration: 'Student Discount',
    value: '—',
    tags: ['Data Science', 'Python', 'Certificates'],
    summary: 'Hands-on learning platform for Python, SQL, and AI skills with special student discount pricing.',
    highlights: [
      'Interactive coding tracks in Python, R, SQL, and Machine Learning',
      'Student-specific subscription discounts',
      'Portfolio projects and skill assessments'
    ],
    notes: 'Verify with school email on the DataCamp Education portal.'
  },
  'coursera': {
    name: 'Coursera Student Offers',
    duration: 'Institutional / Regional',
    value: '—',
    tags: ['Top Universities', 'Certificates'],
    summary: 'Learn from leading global universities and top tech companies with free auditing or university-sponsored campus licenses.',
    highlights: [
      'Courses from Stanford, Yale, DeepLearning.AI, and Google',
      'Free access to courses if your university participates in Coursera for Campus',
      'Audit mode available for free across most courses'
    ],
    notes: 'Check if your university email is enrolled in Coursera for Campus for free verified certificates.'
  },
  'edx': {
    name: 'edX',
    duration: 'Audit Free / Discount',
    value: '—',
    tags: ['MIT / Harvard', 'MicroMasters'],
    summary: 'Access university-level courses from MIT, Harvard, and Berkeley. Free auditing is available across almost all courses.',
    highlights: [
      'High-quality academic courses from MIT, Harvard, and Oxford',
      'Free auditing option for lecture videos and readings',
      'Financial aid and student discounts for verified certificates'
    ],
    notes: 'Auditing is free. Financial assistance up to 90% off is available upon application.'
  },
  'nvidia-dli': {
    name: 'NVIDIA Deep Learning Institute',
    duration: 'Select Course Discounts',
    value: '—',
    tags: ['GPU', 'CUDA', 'Certifications'],
    summary: 'Official hands-on training courses for deep learning, accelerated computing (CUDA), LLMs, and robotics.',
    highlights: [
      'Hands-on training directly on NVIDIA GPU cloud instances',
      'Industry-recognized professional competency certificates',
      'Educator and university partnership grants'
    ],
    notes: 'Consult your university department to see if they offer NVIDIA DLI university educator workshop codes.'
  },
  'figma': {
    name: 'Figma Education',
    duration: 'Education Plan',
    value: '$144',
    tags: ['UI/UX', 'Prototypes', 'Free Professional'],
    summary: 'Free upgrade to Figma Professional for verified students and educators. The industry standard for UI/UX design and AI product prototyping.',
    highlights: [
      'Free unlock of Figma Professional plan features',
      'Collaborative design, interactive components, and design systems',
      'Essential for product managers, indie hackers, and SaaS design'
    ],
    notes: 'Valid for 2 years per student verification. Quick approval with university email.'
  },
  'canva': {
    name: 'Canva for Education',
    duration: 'Education Program',
    value: '$120',
    tags: ['Design', 'Magic AI', 'Presentations'],
    summary: 'Full access to Canva premium design suite and Magic Studio AI tools for eligible K-12 and university educators and students.',
    highlights: [
      'Massive library of premium templates, photos, and fonts',
      'Canva Magic Studio generative AI creation tools',
      'Slide decks, visual reports, social graphics, and video editing'
    ],
    notes: 'Check eligibility through your school account.'
  },
  'adobe': {
    name: 'Adobe Creative Cloud Student',
    duration: 'Student Discount (~60% Off)',
    value: '$360+ Saved',
    tags: ['Creative Suite', 'Firefly AI', '60%+ Off'],
    summary: 'Over 60% discount on the complete Adobe Creative Cloud suite, including Photoshop, Illustrator, Premiere Pro, and Firefly AI.',
    highlights: [
      '20+ industry-standard creative desktop and mobile apps',
      'Adobe Firefly generative AI creation credits included',
      '100GB cloud storage, Adobe Fonts, and Behance portfolio'
    ],
    notes: 'Requires active student verification. Renews at standard educational discount rate.'
  },
  'ai-media': {
    name: 'AI Creative Platforms (Runway / Suno / Midjourney)',
    duration: 'Various Free Tiers',
    value: 'Free Tiers',
    tags: ['Video AI', 'Music AI', 'Image Gen'],
    summary: 'Generative media platforms providing free initial credits or monthly quotas for creative exploration.',
    highlights: [
      'Runway Gen-3 video generation free tier',
      'Suno AI free daily generation credits for music and songs',
      'Luma Dream Machine and Hailuo AI free trial credits'
    ],
    notes: 'Leverage free monthly credits across multiple platforms for student multimedia projects.'
  },
  'kiro': {
    name: 'AWS Kiro for Students',
    duration: 'Free for 1 Year',
    value: '$240',
    tags: ['Agent IDE', 'AWS Backed', '1 Year Free'],
    summary: 'Amazon AWS newly launched AI-first Agent IDE, featuring speculative execution and full codebase reasoning, free for 1 year for students.',
    highlights: [
      'Amazon next-gen Agentic development environment',
      'Free 1-year Pro access for verified university students',
      'Deep AWS ecosystem and Bedrock model integration'
    ],
    notes: 'Recently announced in late 2025/2026. Verify with your university email on the AWS developer portal.'
  },
  'doubao': {
    name: 'ByteDance Doubao Student Back-to-School',
    duration: '3 Months Free Pro',
    value: '¥180',
    tags: ['CN Direct', 'Doubao Pro', 'No VPN'],
    summary: 'ByteDance flagship AI Doubao offers 3 months of Pro access for college students, featuring high-speed inference and search.',
    highlights: [
      '3 months of Doubao Pro privileges free of charge',
      'Fast response times and strong Chinese language comprehension',
      'Directly accessible in China with zero network configuration'
    ],
    notes: 'Requires Chinese student verification or .edu.cn campus email inside the Doubao app.'
  },
  'qianwen': {
    name: 'Alibaba Qwen Education Program',
    duration: 'Student Discount / Free Tier',
    value: '¥200',
    tags: ['Qwen Max', 'Alibaba Cloud', 'Direct Access'],
    summary: 'Alibaba Cloud Qwen provides academic subsidies and free tokens for open-weight Qwen 2.5 / Max models for university students.',
    highlights: [
      'Access to Qwen Max and Qwen Coder flagship models',
      'Campus student subsidies and Alibaba Cloud computing vouchers',
      'Direct access in China without foreign credit cards'
    ],
    notes: 'Verify through Alibaba Cloud Student / Education Center.'
  },
  'volc-ark': {
    name: 'Volcengine AI Ark Campus Plan',
    duration: '100M Free Tokens',
    value: '¥500',
    tags: ['100M Tokens', 'DeepSeek', 'Full Spec'],
    summary: 'ByteDance Volcengine AI Ark offers 100 million free model tokens for college students and faculty, including full DeepSeek V3/R1 models.',
    highlights: [
      '100,000,000 free tokens for model API calls',
      'Includes full-weight DeepSeek V3 and R1 reasoning models',
      'High concurrency API endpoints suitable for agent building and research'
    ],
    notes: 'Verify with university email or student ID on the Volcengine platform.'
  },
  'tingwu': {
    name: 'Tongyi Tingwu Student Verification',
    duration: '1 Year Pro Edition',
    value: '¥120',
    tags: ['Audio-to-Text', 'Lecture Notes', 'Alibaba'],
    summary: 'Alibaba AI speech-to-text and meeting transcription tool. Verified students get 1 year of Pro edition with generous audio processing hours.',
    highlights: [
      'Automated lecture recording, audio transcription, and structured notes',
      'AI chapter division, question-answering, and PPT extraction',
      '1 year of Pro membership with expanded monthly hours'
    ],
    notes: 'Verified inside the Tongyi Tingwu web console with student credentials.'
  },
  'dify': {
    name: 'Dify.AI Education Edition',
    duration: 'Educational Tier',
    value: '$120',
    tags: ['LLM Ops', 'Agent Builder', 'RAG'],
    summary: 'The leading open-source LLMOps and Agent application builder, providing free cloud quotas and open-source self-hosting for university teams.',
    highlights: [
      'Visual workflow orchestration for AI Agents and RAG pipelines',
      'Cloud sandbox quotas for student projects and hackathons',
      'Open-source edition free to deploy on university servers'
    ],
    notes: 'Check the Dify community education initiative for student organization benefits.'
  },
  'windsurf': {
    name: 'Codeium Windsurf Student',
    duration: 'Student Discount',
    value: '$80',
    tags: ['AI IDE', 'Cascade Agent', 'Affordable'],
    summary: 'Next-generation AI IDE powered by Codeium Cascade Agent, offering discounted student pricing as an alternative to Cursor.',
    highlights: [
      'Cascade autonomous coding agent with full codebase understanding',
      'Deep context tracking and intelligent multi-file modification',
      'Special discounted tier for verified students (~$6.9/month)'
    ],
    notes: 'Apply on codeium.com/windsurf with educational verification.'
  },
  'comate': {
    name: 'Baidu Comate AI Coding Free Promo',
    duration: 'Limited-time Free',
    value: '¥150',
    tags: ['Code Assistant', '9 Models', 'China Direct'],
    summary: 'Baidu AI coding assistant Comate offers a free test version with unlimited tokens supporting 9 model backends for multi-model comparison.',
    highlights: [
      'Unlimited tokens in the beta release channel',
      'Side-by-side comparison across 9 distinct LLM models',
      'Direct access in mainland China with popular IDE extensions'
    ],
    notes: 'Limited-time promotion. Confirm status inside the Comate IDE extension.'
  },
  'wenxiaoyan': {
    name: 'Baidu Wenxiaoyan Free Ernie 4.0',
    duration: 'Limited-time Free',
    value: '¥20',
    tags: ['Ernie 4.0', 'No Cost', 'China Direct'],
    summary: 'Baidu consumer AI app Wenxiaoyan offers free access to the flagship Ernie 4.0 model series for all users.',
    highlights: [
      'Free access to Ernie 4.0 flagship models',
      'Available for both new and existing registered users',
      'Direct access within China on web and mobile'
    ],
    notes: 'Check the mobile app or web version for ongoing campaign promotions.'
  },
  'undermind': {
    name: 'undermind.ai Research Assistant',
    duration: 'Student Verification (50% Off)',
    value: '$57',
    tags: ['Literature Search', '250M Papers', '50% Off'],
    summary: 'Specialized AI literature discovery engine for researchers and graduate students, offering 50% off Pro with access to 250M+ papers.',
    highlights: [
      'Deep search across 250+ million scientific research papers',
      '50% discount on Pro plans for verified students and researchers',
      'Drastically accelerates literature review and citation gathering'
    ],
    notes: 'Requires student or academic email verification on undermind.ai.'
  },
  'bohrium': {
    name: 'Bohrium Academic AI Platform',
    duration: 'Student Rate',
    value: '¥50/mo Tier',
    tags: ['AI for Science', '300 Photons/Day', 'Paper Tracker'],
    summary: 'DP Technology AI-for-science platform offering daily compute photons and unlimited AI paper subscription feeds for students.',
    highlights: [
      'Daily allocation of 300 compute photons',
      'Unlimited AI-powered academic paper tracking subscriptions',
      'Tailored for scientific computing, chemistry, and materials simulation'
    ],
    notes: 'Verify with university credentials at bohrium.dp.tech.'
  },
  'kimi-coupon': {
    name: 'Moonshot Kimi New User API Credits',
    duration: '3 Months Validity',
    value: '¥15 Credits',
    tags: ['New Users', 'Long Context', 'API Voucher'],
    summary: 'Moonshot AI platform provides initial no-threshold API vouchers for verified accounts; standard web chat is completely free.',
    highlights: [
      'Complimentary API testing voucher upon account verification',
      'Ultra-long context window ideal for parsing books, PDFs, and legal contracts',
      'Free unlimited regular chat via the Kimi web and mobile apps'
    ],
    notes: 'Good entry point for evaluating long-context LLM inference.'
  }
};

if (typeof window !== 'undefined') {
  window.DEALS_EN = DEALS_EN;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEALS_EN;
}
