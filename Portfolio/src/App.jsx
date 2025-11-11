import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ChevronDown, Code, Briefcase, Lightbulb, Music, Zap } from 'lucide-react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'experience', 'other'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.1)'
    },
    navInner: {
      maxWidth: '1152px',
      margin: '0 auto',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #38bdf8, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    navLinks: {
      display: 'flex',
      gap: '1.5rem'
    },
    navButton: {
      fontSize: '0.875rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s',
      color: '#94a3b8'
    },
    navButtonActive: {
      color: '#38bdf8'
    },
    section: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 1.5rem',
      position: 'relative'
    },
    heroContent: {
      textAlign: 'center',
      maxWidth: '896px'
    },
    avatar: {
      width: '128px',
      height: '128px',
      margin: '0 auto 1.5rem',
      background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      boxShadow: '0 0 40px rgba(56, 189, 248, 0.3)'
    },
    heroTitle: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #38bdf8, #60a5fa, #38bdf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    heroSubtitle: {
      fontSize: '1.5rem',
      color: '#cbd5e1',
      marginBottom: '2rem'
    },
    socialLinks: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: '3rem'
    },
    socialButton: {
      padding: '0.75rem',
      background: 'rgba(56, 189, 248, 0.1)',
      border: '1px solid rgba(56, 189, 248, 0.2)',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: 'white'
    },
    chevron: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      animation: 'bounce 1s infinite',
      color: '#38bdf8'
    },
    sectionTitle: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    card: {
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
      backdropFilter: 'blur(4px)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      transition: 'all 0.3s',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      fontSize: '1.125rem'
    },
    label: {
      color: '#38bdf8',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    value: {
      color: '#e2e8f0'
    },
    description: {
      marginTop: '2rem',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(56, 189, 248, 0.15)',
      color: '#cbd5e1',
      lineHeight: '1.625'
    },
    projectCard: {
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
      backdropFilter: 'blur(4px)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      marginBottom: '4rem',
      transition: 'all 0.3s',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    },
    projectTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#38bdf8'
    },
    projectDescription: {
      color: '#cbd5e1',
      marginBottom: '1.5rem',
      lineHeight: '1.625'
    },
    tags: {
      marginBottom: '1rem'
    },
    tag: {
      display: 'inline-block',
      background: 'rgba(56, 189, 248, 0.15)',
      color: '#7dd3fc',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
      border: '1px solid rgba(56, 189, 248, 0.3)'
    },
    videoContainer: {
      borderRadius: '0.5rem',
      overflow: 'hidden',
      background: 'black',
      border: '1px solid rgba(56, 189, 248, 0.2)'
    },
    video: {
      width: '100%',
      display: 'block'
    },
    experienceHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    experienceTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#38bdf8'
    },
    experienceCompany: {
      fontSize: '1.25rem',
      color: '#e2e8f0'
    },
    experienceDate: {
      color: '#94a3b8'
    },
    bulletList: {
      marginBottom: '1.5rem'
    },
    bullet: {
      display: 'flex',
      alignItems: 'start',
      gap: '0.5rem',
      color: '#cbd5e1',
      marginBottom: '0.75rem'
    },
    bulletPoint: {
      color: '#38bdf8',
      marginTop: '0.25rem'
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    image: {
      width: '100%',
      borderRadius: '0.5rem',
      border: '1px solid rgba(56, 189, 248, 0.2)'
    },
    physicsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    physicsImage: {
      width: '100%',
      height: '256px',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      border: '1px solid rgba(56, 189, 248, 0.2)'
    },
    physicsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#38bdf8',
      marginBottom: '0.5rem'
    },
    footer: {
      background: 'rgba(10, 10, 10, 0.9)',
      borderTop: '1px solid rgba(56, 189, 248, 0.1)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: '#64748b'
    }
  };

  const goToGithub = () => {
    window.open("https://github.com/tyk326/projects", "_blank");
  };
  const goToLinkedin = () => {
    window.open("https://www.linkedin.com/in/tylerkim04/", "_blank");
  };
  const gotToGmail = () => {
    window.open("https://gmail.com", "_blank");
  };
  

  return (
    <div style={styles.container}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <h1 style={styles.logo}>TK</h1>
          <div style={styles.navLinks}>
            {['About', 'Projects', 'Experience', 'Other'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                style={{
                  ...styles.navButton,
                  ...(activeSection === item.toLowerCase() ? styles.navButtonActive : {})
                }}
                onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                onMouseLeave={(e) => e.target.style.color = activeSection === item.toLowerCase() ? '#38bdf8' : '#94a3b8'}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" style={styles.section}>
        <div style={styles.heroContent}>
          <div style={styles.avatar}>TK</div>
          <h1 style={styles.heroTitle}>Tyler Kim</h1>
          <p style={styles.heroSubtitle}>Computer Science Student • Developer • Problem Solver</p>
          <div style={styles.socialLinks}>
            <button
              style={styles.socialButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => goToGithub()}
            >
              <Github size={24} />
            </button>
            <button
              style={styles.socialButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => goToLinkedin()}
            >
              <Linkedin size={24} />
            </button>
            <button
              style={styles.socialButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => gotToGmail()}
            >
              <Mail size={24} />
            </button>
          </div>
          <button onClick={() => scrollToSection('about')} style={styles.chevron}>
            <ChevronDown size={32} />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ ...styles.section, padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '896px', width: '100%' }}>
          <h2 style={styles.sectionTitle}>
            <Code size={36} color="#38bdf8" />
            About Me
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <p style={styles.label}>School</p>
                <p style={styles.value}>Lehigh University</p>
              </div>
              <div>
                <p style={styles.label}>Major</p>
                <p style={styles.value}>Computer Science</p>
              </div>
              <div>
                <p style={styles.label}>Year</p>
                <p style={styles.value}>Senior</p>
              </div>
              <div>
                <p style={styles.label}>Graduation</p>
                <p style={styles.value}>May 2026</p>
              </div>
            </div>
            <div style={styles.description}>
              <p>
                I'm a senior at Lehigh University passionate about artificial intelligence, game development, and building interactive experiences.
                My work spans from implementing complex algorithms like A* pathfinding to creating engaging game mechanics and contributing to
                real-world web applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>
            <Zap size={36} color="#38bdf8" />
            Projects & Coursework
          </h2>

          {/* A* Pathfinding */}
          <div
            style={styles.projectCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            <h3 style={styles.projectTitle}>A* Pathfinding Algorithm</h3>
            <p style={styles.projectDescription}>
              Implemented A* pathfinding for dynamic environments with moving obstacles. The system uses navigation meshes
              to guide an agent through a gate-filled world where walls randomly spawn and move. The algorithm handles
              real-time replanning when paths become blocked, ensuring the agent can collect resources efficiently while
              navigating around dynamic barriers.
            </p>
            <div style={styles.tags}>
              <span style={styles.tag}>Python</span>
              <span style={styles.tag}>Pygame</span>
              <span style={styles.tag}>AI Algorithms</span>
            </div>
            <div style={styles.videoContainer}>
              <video style={styles.video} controls loop autoPlay muted>
                <source src="/AStar_portfolio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Behavior Trees */}
          <div
            style={styles.projectCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            <h3 style={styles.projectTitle}>MOBA Hero AI - Behavior Trees</h3>
            <p style={styles.projectDescription}>
              Designed and implemented AI decision-making for Hero agents in a MOBA-style game using behavior trees.
              The system balances strategic objectives like hunting enemies, leveling up by defeating minions, managing
              health through base retreats, and choosing between ranged attacks and area-effect abilities. Heroes gain
              experience and power through combat, with the AI optimizing for damage output against enemy heroes.
            </p>
            <div style={styles.tags}>
              <span style={styles.tag}>Python</span>
              <span style={styles.tag}>Pygame</span>
              <span style={styles.tag}>Game AI</span>
            </div>
            <div style={styles.videoContainer}>
              <video style={styles.video} controls loop autoPlay muted>
                <source src="/BehaviorTree_portfolio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Mario Game */}
          <div
            style={styles.projectCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            <h3 style={styles.projectTitle}>Mario-Style Platformer</h3>
            <p style={styles.projectDescription}>
              Created a Mario-inspired platformer game with custom character animations, power-up systems, and enemy AI.
              Players navigate through levels, collect power-ups to gain abilities, and defeat pig enemies. The game features
              smooth character movement, collision detection, and classic platforming mechanics.
            </p>
            <div style={styles.tags}>
              <span style={styles.tag}>Lua</span>
              <span style={styles.tag}>Game Development</span>
            </div>
            <div style={styles.videoContainer}>
              <video style={styles.video} controls loop autoPlay muted>
                <source src="/Mario_portfolio.mov" type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Zelda Game */}
          <div
            style={styles.projectCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            <h3 style={styles.projectTitle}>Zelda-Style Adventure Game</h3>
            <p style={styles.projectDescription}>
              Developed a top-down adventure game inspired by classic 2D Zelda titles. Features a room-based navigation
              system where each room has unique designs, obstacles, and dangers. Players explore an interconnected world,
              solving puzzles and overcoming challenges as they progress through different areas.
            </p>
            <div style={styles.tags}>
              <span style={styles.tag}>Lua</span>
              <span style={styles.tag}>Game Development</span>
            </div>
            <div style={styles.videoContainer}>
              <video style={styles.video} controls loop autoPlay muted>
                <source src="/Zelda_portfolio.mov" type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" style={{ minHeight: '100vh', padding: '5rem 1.5rem', background: 'rgba(10, 10, 10, 0.5)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>
            <Briefcase size={36} color="#38bdf8" />
            Experience
          </h2>

          <div style={styles.card}>
            <div style={styles.experienceHeader}>
              <div>
                <h3 style={styles.experienceTitle}>Software Development Engineer Intern</h3>
                <p style={styles.experienceCompany}>Lifeway Christian Resources</p>
              </div>
              <span style={styles.experienceDate}>Jun 2025 – Aug 2025</span>
            </div>

            <div style={styles.bulletList}>
              <p style={styles.bullet}>
                <span style={styles.bulletPoint}>•</span>
                <span>Contributed to the frontend development of Ministry Grid, Lifeway's church training platform used by thousands of ministry leaders nationwide</span>
              </p>
              <p style={styles.bullet}>
                <span style={styles.bulletPoint}>•</span>
                <span>Completed 14+ backlog tasks, building and modifying responsive UI components with React, TypeScript, and CSS</span>
              </p>
              <p style={styles.bullet}>
                <span style={styles.bulletPoint}>•</span>
                <span>Strengthened reliability with Jest and Playwright testing, accelerating feature delivery and reducing regressions</span>
              </p>
              <p style={styles.bullet}>
                <span style={styles.bulletPoint}>•</span>
                <span>Collaborated in an Agile development environment through daily stand-ups and retrospectives</span>
              </p>
            </div>

            <div style={styles.tags}>
              <span style={styles.tag}>React</span>
              <span style={styles.tag}>TypeScript</span>
              <span style={styles.tag}>Jest</span>
              <span style={styles.tag}>Playwright</span>
            </div>

            <div style={styles.imageGrid}>
              <img
                src="/Ministrygrid.jpeg"
                alt="Ministry Grid Platform"
                style={styles.image}
              />
              <img
                src="/Lifeway.png"
                alt="Lifeway Logo"
                style={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Other Section */}
      <section id="other" style={{ minHeight: '100vh', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>
            <Lightbulb size={36} color="#38bdf8" />
            Beyond Code
          </h2>

          {/* Music */}
          <div style={{ ...styles.card, marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Music size={24} color="#38bdf8" />
              Classical Music
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '1.125rem' }}>
              My favorite classical piano piece is <span style={{ color: '#38bdf8', fontWeight: '600' }}>Songs Without Words Op. 67 No. 2</span> by Felix Mendelssohn.
              This beautiful Romantic-era piece showcases Mendelssohn's gift for creating lyrical, singing melodies on the piano.
            </p>
          </div>

          {/* Physics Labs */}
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={24} color="#38bdf8" />
              Physics Experiments
            </h3>
            <div style={styles.physicsGrid}>
              <div>
                <img
                  src="/Electron_portfolio.jpg"
                  alt="Mass of Electron Experiment"
                  style={styles.physicsImage}
                />
                <h4 style={styles.physicsTitle}>Measuring the Mass of an Electron</h4>
                <p style={{ color: '#cbd5e1' }}>
                  Laboratory experiment using a cathode ray tube with a blue coil to determine the mass-to-charge ratio of an electron.
                </p>
              </div>
              <div>
                <img
                  src="/Field_portfolio.jpg"
                  alt="Electric Field Experiment"
                  style={styles.physicsImage}
                />
                <h4 style={styles.physicsTitle}>Equipotential Lines in Electric Fields</h4>
                <p style={{ color: '#cbd5e1' }}>
                  Mapping equipotential lines to visualize electric field patterns and understand electrostatic principles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Tyler Kim</p>
      </footer>
    </div>
  );
}