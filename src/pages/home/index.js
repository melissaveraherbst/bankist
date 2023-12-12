// ---------------------------------------------------------------------------------------
// SELECTED DOM ELEMENTS
// ---------------------------------------------------------------------------------------
// container divs
const header = document.querySelector(".header");
const sections = document.querySelectorAll(".section");
const section1 = document.querySelector("#section--1");

// header: navbar
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav__link");
const navList = document.querySelector(".nav__list");

// cookie
const cookieMessage = document.createElement("div");

// section 1: features
const images = document.querySelectorAll(".features__img");

// section 2: operations/tabs
const tabsContainer = document.querySelector(".operations__tab--container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContents = document.querySelectorAll(".operations__content");

// section 3: slider
const dotsContainer = document.querySelector(".dots");
const slides = document.querySelectorAll(".slide");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");

// open account/modal popup
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

// ---------------------------------------------------------------------------------------
// A. OPEN ACCOUNT / MODAL POPUP
// ---------------------------------------------------------------------------------------
const openModal = function () {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) {
		closeModal();
	}
});

// ---------------------------------------------------------------------------------------
// B. COOKIE MESSAGE POPUP
// ---------------------------------------------------------------------------------------
cookieMessage.classList.add("cookie-message");
cookieMessage.innerHTML =
	"<p>This site uses cookies to provide you with a great user experience and to analyze our site traffic. By continuing to use our site you consent to our cookies.</p><button class='btn btn--text btn--close-cookie'>OK</button>";

header.append(cookieMessage);

document.querySelector(".btn--close-cookie").addEventListener("click", function () {
	cookieMessage.remove();
});

// ---------------------------------------------------------------------------------------
// C. IMPLEMENTING SMOOTH SCROLLING
// ---------------------------------------------------------------------------------------
document.querySelector(".btn--scroll-to").addEventListener("click", function (e) {
	e.preventDefault();
	section1.scrollIntoView({ behavior: "smooth" });
});

// ** Note: Smooth Scrolling can be implemeted via CSS. This exercise is for getting to use event delegation in the following sections below

// ---------------------------------------------------------------------------------------
// D. PAGE NAVIGATION: Using event delegation
// ---------------------------------------------------------------------------------------
// 1. Attach the event listener to the parent element
navList.addEventListener("click", function (e) {
	// e.preventDefault();
	// 2. Matching strategy: use event.target to select the target elements
	if (e.target.classList.contains("nav__link")) {
		const hrefID = e.target.getAttribute("href");
		document.querySelector(hrefID).scrollIntoView({ behavior: "smooth" });
	}
});

// ---------------------------------------------------------------------------------------
// E. TABBED COMPONENT: Using DOM traversing
// ---------------------------------------------------------------------------------------
tabsContainer.addEventListener("click", function (e) {
	// Remove any starting active classes
	tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
	tabsContents.forEach((content) => content.classList.remove("operations__content--active"));

	// Element.closest() returns the element itself, or it's closest ancestor element, whichever first matches the specified CSS selector. Returns null if no match is found.
	const clickedTab = e.target.closest(".operations__tab");
	if (clickedTab) {
		clickedTab.classList.add("operations__tab--active");
		document
			.querySelector(`.operations__content--${clickedTab.dataset.tab}`)
			.classList.add("operations__content--active");
	} else {
		return
	}
});

// ---------------------------------------------------------------------------------------
// F. NAV-BAR TEXT FADE EFFECT
// ---------------------------------------------------------------------------------------
// New: Passing args to event handlers
const handleTextFade = function (e, opacity) {
	if (e.target.classList.contains("nav__link")) {
		const clickedLink = e.target;
		navLinks.forEach((link) => {
			if (link !== clickedLink) {
				link.style.opacity = opacity;
			}
		});
	}
};

nav.addEventListener("mouseover", function (e) {
	handleTextFade(e, 0.35);
});
nav.addEventListener("mouseout", function (e) {
	handleTextFade(e, 1);
});

// Better alternative using the bind() method
/*
nav.addEventListener("mouseover", handleTextFade.bind(0.45))
nav.addEventListener("mouseout", handleTextFade.bind(1))
*/

// ---------------------------------------------------------------------------------------
// G. STICKY NAVIGATION: The Intersection Observer API
// ---------------------------------------------------------------------------------------
// ** Note: A "scroll" event exists but using it should be avoided. It has poor performance because scroll events can fire at a high rate.
const applyStickyNav = function (entries) {
	const entry = entries[0];
	if (!entry.isIntersecting) {
		nav.classList.add("sticky");
	} else {
		nav.classList.remove("sticky");
	}
};

const headerObserver = new IntersectionObserver(applyStickyNav, {
	root: null,
	rootMargin: `-${nav.getBoundingClientRect().height}px`,
	threshold: 0
});

headerObserver.observe(header);

// ---------------------------------------------------------------------------------------
// H. REVEALING SECTIONS ON SCROLL: The Intersection Observer API continued
// ---------------------------------------------------------------------------------------
const revealSections = function (entries, observer) {
	const entry = entries[0];
	if (entry.isIntersecting) {
		entry.target.classList.remove("section--hidden");
		observer.unobserve(entry.target);
	}
};

const sectionsObserver = new IntersectionObserver(revealSections, {
	root: null,
	threshold: 0.15
});

sections.forEach((section) => {
	section.classList.add("section--hidden");
	sectionsObserver.observe(section);
});

// ---------------------------------------------------------------------------------------
// I. LOADING IMAGES ON SCROLL: The Intersection Observer API continued
// ---------------------------------------------------------------------------------------
const loadHighResImage = function (entries) {
	const entry = entries[0];
	if (entry.isIntersecting) {
		// replace image "scr" with "data-src"
		entry.target.src = entry.target.dataset.src;
		// remove blurring effect class
		entry.target.classList.remove("lazy-img");
		observer.unobserve(entry.target);
	}
};

const imageObserver = new IntersectionObserver(loadHighResImage, {
	root: null,
	threshold: 0.4
});

images.forEach((image) => imageObserver.observe(image));

// ---------------------------------------------------------------------------------------
// J. SLIDER SECTION
// ---------------------------------------------------------------------------------------
slides.forEach((slide, i) => {
	slide.style.transform = `translateX(${i}00%)`;
});

let currentSlide = 0;
let lastSlide = slides.length - 1;

const nextSlide = function () {
	if (currentSlide === lastSlide) {
		currentSlide = 0;
	} else {
		currentSlide++;
	}
	slides.forEach((slide, i) => (slide.style.transform = `translateX(${i - currentSlide}00%)`));
	applyActiveDot(currentSlide);
};

const previousSlide = function () {
	if (currentSlide === 0) {
		currentSlide = lastSlide;
	} else {
		currentSlide--;
	}
	slides.forEach((slide, i) => {
		slide.style.transform = `translateX(${i - currentSlide}00%)`;
	});
	applyActiveDot(currentSlide);
};

const createDots = function () {
	slides.forEach((_, i) => {
		dotsContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide=${i}></button>`);
	});
};

const applyActiveDot = function (currentSlide) {
	document.querySelectorAll(".dots__dot").forEach((dot) => {
		dot.classList.remove("dots__dot--active");
	});
	const activeDot = document.querySelector(`.dots__dot[data-slide="${currentSlide}"]`);
	activeDot.classList.add("dots__dot--active");
};

createDots();
applyActiveDot(currentSlide);

// button events
sliderBtnRight.addEventListener("click", nextSlide);
sliderBtnLeft.addEventListener("click", previousSlide);

// keyboard events
document.addEventListener("keydown", function (e) {
	if (e.key === "ArrowRight") {
		nextSlide();
	}
	if (e.key === "ArrowLeft") {
		previousSlide();
	}
	applyActiveDot(currentSlide);
});

// click on a dot event
dotsContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("dots__dot")) {
		const currentSlide = e.target.dataset.slide;
		slides.forEach((slide, i) => {
			slide.style.transform = `translateX(${i - currentSlide}00%)`;
		});
		applyActiveDot(currentSlide);
	}
});
