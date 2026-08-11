document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Animations with Intersection Observer
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // 2. Navbar Scroll Effect & Active Link Highlight
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Dynamic Navbar opacity on scroll
    if (window.scrollY > 50) {
      navbar.style.padding = '12px 0';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
    } else {
      navbar.style.padding = '18px 0';
      navbar.style.boxShadow = 'none';
    }

    // Scroll spy for navigation items
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navLinksContainer.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 4. Project Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. Contact Form Submission Handler (Mailto + Feedback UI)
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');

  if (contactForm && formToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparando envio...';

      // Criar o link mailto pré-preenchido
      const targetEmail = 'douglasleone09@gmail.com';
      const mailtoSubject = encodeURIComponent(`[Portfólio] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Olá Douglas,\n\nMeu nome é ${name} (${email}).\n\nMensagem:\n${message}\n\n--- \nEnviado através do seu Portfólio Pessoal.`
      );

      const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        formToast.className = 'form-toast success';
        formToast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Abrindo seu leitor de e-mail... Mensagem enviada para envio!';

        // Disparar abertura do cliente de e-mail
        window.location.href = mailtoUrl;

        contactForm.reset();

        setTimeout(() => {
          formToast.style.display = 'none';
        }, 6000);
      }, 800);
    });
  }

  // 6. Real-time GitHub Data Fetch (Live API)
  async function fetchGitHubLiveStats() {
    try {
      const userRes = await fetch('https://api.github.com/users/DouglasLeone');
      if (userRes.ok) {
        const userData = await userRes.json();
        
        // Repositórios públicos reais
        const reposEl = document.getElementById('ghRepos');
        if (reposEl) reposEl.textContent = userData.public_repos;

        // Seguidores reais
        const followersEl = document.getElementById('ghFollowers');
        if (followersEl) followersEl.textContent = userData.followers;

        // Anos de atividade no GitHub calculados dinamicamente
        const createdYear = new Date(userData.created_at).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsDiff = Math.max(1, currentYear - createdYear);
        const yearsEl = document.getElementById('ghYears');
        if (yearsEl) yearsEl.textContent = `${yearsDiff}+`;
      }

      // Stars em todos os repositórios
      const reposRes = await fetch('https://api.github.com/users/DouglasLeone/repos?per_page=100');
      if (reposRes.ok) {
        const reposList = await reposRes.json();
        const totalStars = reposList.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        const starsEl = document.getElementById('ghStars');
        if (starsEl) starsEl.textContent = totalStars > 0 ? totalStars : '3+';
      }
    } catch (error) {
      console.warn('Fallback ativado para estatísticas do GitHub:', error);
    }
  }

  fetchGitHubLiveStats();
});
