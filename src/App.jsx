import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-cyan-400 pointer-events-none z-[100] mix-blend-screen flex justify-center items-center shadow-[0_0_15px_rgba(34,211,238,0.5)] hidden md:flex"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
    </motion.div>
  );
};

const BackgroundOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#030305]">
    <motion.div
      animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, -50, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/40 blur-[120px]"
    />
    <motion.div
      animate={{ scale: [1, 1.5, 1], x: [0, -80, 0], y: [0, 80, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/30 blur-[150px]"
    />
    <div className="absolute inset-0 bg-black/60 mesh-overlay"></div>
  </div>
);

const ProjectCard = ({ title, stack, desc, links, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="w-full flex"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full flex flex-col rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="p-8 flex flex-col h-full z-10 relative" style={{ transform: "translateZ(60px)" }}>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{title}</h3>
          
          <div className="flex gap-2 mb-4 bg-white/5 w-max px-3 py-1.5 rounded-lg">
            {links && links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">
                [{link.label}]
              </a>
            ))}
            {!links && <span className="text-gray-500 text-xs uppercase tracking-widest">Confidential / Internal</span>}
          </div>

          <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{desc}</p>
          <div className="flex gap-2 flex-wrap mt-auto">
            {stack.map((tech, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full top-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 shadow-2xl relative">
        <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2 z-50">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          MRUDHUL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">P.</span>
        </div>
        
        <ul className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold text-gray-400">
          <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-white transition-colors">Skills</a></li>
          <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>
          <li><a href="#work" className="hover:text-white transition-colors">Work</a></li>
          <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
        </ul>
        
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white font-bold tracking-widest text-sm z-50 focus:outline-none"
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>

        {/* Mobile Menu Overlay */}
        <motion.div 
          initial={false}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          className="absolute top-full mt-4 right-0 w-full md:hidden bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          style={{ pointerEvents: menuOpen ? "auto" : "none" }}
        >
          <ul className="flex flex-col text-sm uppercase tracking-widest font-semibold text-gray-300 p-6 gap-6 text-center">
            <li><a href="#home" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors block w-full">Home</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors block w-full">Skills</a></li>
            <li><a href="#experience" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors block w-full">Experience</a></li>
            <li><a href="#work" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors block w-full">Work</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors block w-full">Contact</a></li>
          </ul>
        </motion.div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center relative px-6 z-10 overflow-hidden pt-20">
      <motion.div className="text-center z-10 w-full max-w-5xl flex flex-col items-center">
        
        {/* Profile Picture Placeholder */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full z-20 group"
        >
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 bg-cyan-400/20 blur-md group-hover:blur-xl transition-all duration-300"></div>
          <div className="absolute inset-2 rounded-full overflow-hidden border border-white/20 bg-[#030305] flex items-center justify-center">
             <img 
               src="/profile.jpg" 
               alt="MRUDHUL P" 
               className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
               onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/notionists/svg?seed=Mrudhul&backgroundColor=transparent"; }}
             />
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
        >
          MCA Graduate • Kannur, Kerala
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tighter text-white leading-[0.9] mb-6"
        >
          MERN STACK <br className="md:hidden" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            DEVELOPER
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 font-light tracking-wide mb-10 leading-relaxed"
        >
          MCA graduate with a solid foundation in MongoDB, Express.js, React.js, and Node.js. 
          Experienced in developing scalable, high-performance web applications with a focus on clean architecture and efficient problem-solving.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4 justify-center items-center mb-10 flex-wrap"
        >
           <a href="https://www.linkedin.com/in/mrudhul-p" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a66c2]/20 text-[#0a66c2] border border-[#0a66c2]/50 hover:bg-[#0a66c2] hover:text-white transition-all font-bold uppercase tracking-widest text-xs">
              LinkedIn
           </a>
           <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all font-bold uppercase tracking-widest text-xs">
              GitHub
           </a>
           <a href="/Mrudhul_P_Resume.pdf" download="Mrudhul_P_Resume.pdf" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-white transition-all font-bold uppercase tracking-widest text-xs">
              Resume 
           </a>
        </motion.div>

      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] border border-white/[0.03] rounded-full absolute"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="w-[140vw] h-[140vw] md:w-[80vw] md:h-[80vw] border border-white/[0.02] rounded-full absolute border-dashed"
        />
      </div>
    </section>
  );
};

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="py-32 px-6 relative z-10 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20">
          
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2">TECHNICAL <span className="text-stroke-transparent">ARSENAL</span></motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mb-10"></motion.div>
            
            <div className="space-y-6">
              {[
                { title: 'Frontend', tech: 'HTML, CSS, JavaScript, React.js, Tailwind CSS, Bootstrap' },
                { title: 'Backend', tech: 'Node.js, Express.js, RESTful APIs, MVC Architecture' },
                { title: 'Database', tech: 'MongoDB, Mongoose' },
                { title: 'Tools', tech: 'Git, GitHub, Postman, MongoDB Compass, VS Code, JWT, Vite' }
              ].map((group, i) => (
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} key={i} className="bg-white/[0.02] border border-white/10 hover:border-cyan-400/50 rounded-2xl p-6 backdrop-blur-md transition-all">
                  <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-3">{group.title}</h4>
                  <p className="text-gray-300 leading-relaxed font-light">{group.tech}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2">ACADEMICS <span className="text-stroke-transparent">& AWARDS</span></motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mb-10"></motion.div>
            
            <div className="space-y-6 mb-10">
               <motion.div variants={itemVariants} whileHover={{ x: 10 }} className="border-l-2 border-purple-500 pl-6 transition-transform">
                 <h4 className="font-bold text-white text-xl mb-1">Master of Computer Applications</h4>
                 <p className="text-purple-400 uppercase tracking-widest text-xs mb-2">Kannur University, Kerala | Jul 2022 - Sep 2024</p>
               </motion.div>
               <motion.div variants={itemVariants} whileHover={{ x: 10 }} className="border-l-2 border-cyan-500 pl-6 transition-transform">
                 <h4 className="font-bold text-white text-xl mb-1">Bachelor of Computer Applications</h4>
                 <p className="text-cyan-400 uppercase tracking-widest text-xs mb-2">University of Mysore | Aug 2018 - Mar 2021</p>
               </motion.div>
            </div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 hover:border-purple-500/50 rounded-2xl p-8 backdrop-blur-md transition-all">
              <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Achievements
              </h4>
              <ul className="text-gray-400 space-y-4 font-light text-sm">
                 <li className="flex gap-3">
                   <span className="text-purple-500">▹</span> Software Testing – Luminar Technolab
                 </li>
                 <li className="flex gap-3">
                   <span className="text-purple-500">▹</span> Work Readiness Programme – ASAP Kerala (Kerala Knowledge Economy Mission)
                 </li>
              </ul>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const exps = [
    {
      role: "MERN Stack Developer",
      company: "Euphoricoders Pvt. Ltd.",
      date: "October 2025 – April 2026",
      desc: [
        "Developed scalable full-stack applications using the MERN stack with RESTful API integration.",
        "Implemented secure authentication and authorization using JWT and role-based access control."
      ]
    },
    {
      role: "Frontend Developer Intern",
      company: "Vonnue Innovations Pvt. Ltd.",
      date: "October 2024 – January 2025",
      desc: [
        "Developed pixel-perfect, responsive interfaces using HTML, CSS, and JavaScript with cross-browser compatibility.",
        "Improved UI/UX by refining layouts, maintaining consistency, and optimizing performance."
      ]
    }
  ];

  return (
    <section id="experience" className="py-32 px-6 relative z-10 w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">PROFESSIONAL <span className="text-stroke-transparent">TIMELINE</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
        </motion.div>

        <div className="relative border-l border-white/20 pl-8 md:pl-16 space-y-20">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-[-1px] top-0 w-[2px] bg-gradient-to-b from-cyan-400 to-purple-500"
          ></motion.div>

          {exps.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.3 }}
              className="relative group"
            >
               <div className="absolute -left-[41px] md:-left-[73px] top-0 w-5 h-5 rounded-full bg-[#030305] border-4 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:scale-150 transition-transform"></div>
               <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{exp.role}</h3>
               <h4 className="text-lg md:text-xl text-purple-400 font-medium mb-2">{exp.company}</h4>
               <p className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs uppercase tracking-widest text-cyan-300 font-bold mb-6">{exp.date}</p>
               <ul className="space-y-3">
                 {exp.desc.map((point, idx) => (
                    <li key={idx} className="flex gap-4 text-gray-300 font-light leading-relaxed">
                      <span className="text-purple-500 font-bold mt-1">▹</span> {point}
                    </li>
                 ))}
               </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Work = () => {
  const projects = [
    {
      title: "Civil Acquire Employee Web App",
      desc: "Live production portal enabling staff to manage and fulfill client requests (estimations, 2D, 3D, interior plans). Streamlined workflows for task tracking and timely delivery.",
      stack: ["React.js", "Tailwind CSS"],
      links: null
    },
    {
      title: "E-Commerce Web Application",
      desc: "Full stack e-commerce app with product, cart, and order management. Implemented JWT based authentication and built a responsive UI with RESTful API integration.",
      stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
      links: [{ label: "GitHub", url: "#" }]
    },
    {
      title: "Job Portal Web Application",
      desc: "Full-stack job portal with search, applications, resume upload, and recruiter features. Role-based access with JWT authentication and REST APIs.",
      stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
      links: [{ label: "Live", url: "#" }, { label: "GitHub", url: "#" }]
    },
    {
      title: "Azure Cloud Clone",
      desc: "Built a responsive, pixel-perfect Azure cloud platform clone with consistent UI across devices.",
      stack: ["HTML", "CSS"],
      links: [{ label: "Live", url: "#" }, { label: "GitHub", url: "#" }]
    },
    {
      title: "Airbnb Clone",
      desc: "Developed an Airbnb clone, replicating layout and creating a responsive user interface.",
      stack: ["HTML", "CSS"],
      links: [{ label: "Live", url: "#" }, { label: "GitHub", url: "#" }]
    },
    {
      title: "DoorDash Clone",
      desc: "Developed a DoorDash clone, creating responsive user interface and consistent UI.",
      stack: ["HTML", "CSS"],
      links: [{ label: "Live", url: "#" }, { label: "GitHub", url: "#" }]
    }
  ];

  return (
    <section id="work" className="py-32 px-6 relative z-10 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">DEPLOYED <span className="text-stroke-transparent">SYSTEMS</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
          </div>
          <p className="text-gray-400 max-w-sm text-right">Production ready applications, clones, and complex full-stack solutions.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {projects.map((proj, i) => (
            <ProjectCard key={i} index={i} {...proj} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6 relative z-10 w-full flex justify-center">
      <div className="max-w-4xl w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.5)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </motion.div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">LET'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CONNECT</span></h2>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl font-light">My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center w-full">
           <motion.a 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:mrudhulp7@gmail.com" 
              className="flex items-center justify-center gap-4 bg-white/[0.02] border border-white/10 hover:border-cyan-400/50 px-10 py-6 rounded-2xl transition-all shadow-xl group hover:bg-white/[0.05]"
           >
              <span className="text-3xl group-hover:scale-110 transition-transform">📧</span> 
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email Me</p>
                <p className="text-cyan-400 font-bold tracking-wide text-lg">mrudhulp7@gmail.com</p>
              </div>
           </motion.a>
           
           <motion.a 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+919074421374"
              className="flex items-center justify-center gap-4 bg-white/[0.02] border border-white/10 hover:border-purple-400/50 px-10 py-6 rounded-2xl transition-all shadow-xl group hover:bg-white/[0.05]"
           >
              <span className="text-3xl group-hover:scale-110 transition-transform">📞</span> 
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Call Me</p>
                <p className="text-purple-400 font-bold tracking-wide text-lg">+91 9074421374</p>
              </div>
           </motion.a>
        </div>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="font-sans antialiased text-white selection:bg-cyan-500/30 selection:text-cyan-200 scroll-smooth">
      <CustomCursor />
      <BackgroundOrbs />
      <NavBar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Contact />
      </main>
      <footer className="text-center py-10 border-t border-white/10 text-gray-500 uppercase tracking-widest text-xs z-10 relative bg-black/50 backdrop-blur-md">
        <p>SYS.LOG // {new Date().getFullYear()} © MRUDHUL P. MERN STACK DEVELOPER.</p>
        <p className="mt-2 text-gray-600">KANNUR | KERALA</p>
      </footer>
    </div>
  );
}

export default App;