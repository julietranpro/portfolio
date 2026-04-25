const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const carousels = document.querySelectorAll("[data-carousel]");
const progressBar = document.querySelector(".scroll-progress-bar");
const heroVisual = document.querySelector(".hero-visual");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuToggle.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    threshold: 0.35,
    rootMargin: "-15% 0px -35% 0px"
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const updateScrollProgress = () => {
  if (!progressBar) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
};

const updateHeroParallax = () => {
  if (!heroVisual) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 28);
  heroVisual.style.transform = `translateY(${offset}px)`;
};

window.addEventListener("scroll", () => {
  updateScrollProgress();
  updateHeroParallax();
});

updateScrollProgress();
updateHeroParallax();

carousels.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".challenge-slide"));
  const track = carousel.querySelector("[data-carousel-track]");
  const viewport = carousel.querySelector(".challenge-viewport");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const currentLabel = carousel.querySelector("[data-carousel-current]");
  const totalLabel = carousel.querySelector("[data-carousel-total]");
  const titleLabel = carousel.querySelector("[data-carousel-title]");
  const reflectionLabel = carousel.querySelector("[data-carousel-reflection]");

  if (!slides.length || !track || !viewport || !prevButton || !nextButton || !currentLabel || !totalLabel || !titleLabel) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const syncViewportHeight = () => {
    const activeSlide = slides[activeIndex];

    if (!activeSlide) {
      return;
    }

    viewport.style.height = `${activeSlide.offsetHeight}px`;
  };

  const renderCarousel = () => {
    const activeSlide = slides[activeIndex];

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    carousel.classList.toggle(
      "compact-reflection-active",
      Boolean(activeSlide?.classList.contains("challenge-slide-reflection-tight"))
    );
    titleLabel.classList.add("is-updating");
    window.setTimeout(() => {
      titleLabel.textContent = activeSlide?.dataset.slideTitle || "";
      titleLabel.classList.remove("is-updating");
    }, 180);
    if (reflectionLabel) {
      reflectionLabel.textContent = activeSlide?.dataset.slideReflection || "";
    }
    currentLabel.textContent = String(activeIndex + 1);
    totalLabel.textContent = String(slides.length);
    window.requestAnimationFrame(syncViewportHeight);
  };

  prevButton.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    renderCarousel();
  });

  nextButton.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % slides.length;
    renderCarousel();
  });

  renderCarousel();
  window.addEventListener("resize", syncViewportHeight);
});
