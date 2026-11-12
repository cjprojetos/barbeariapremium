const WHATSAPP_NUMBER = "5511987654321"; // Altere para o WhatsApp oficial da barbearia.

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Destaca o item do menu correspondente à seção visível.
const sections = [...document.querySelectorAll("main section[id], main section.hero, #contato")];
const navLinks = [...document.querySelectorAll(".nav a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id || "inicio";
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => observer.observe(section));

const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,10);
dateInput.min = localDate;

function populateTimes() {
  const selectedDate = dateInput.value;
  timeSelect.innerHTML = '<option value="">Selecione o horário</option>';
  if (!selectedDate) return;
  const [year, month, day] = selectedDate.split("-").map(Number);
  const chosen = new Date(year, month - 1, day);
  const weekday = chosen.getDay();
  if (weekday === 0) {
    timeSelect.innerHTML = '<option value="">Fechado aos domingos</option>';
    return;
  }
  for (let hour = 9; hour < 20; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 19 && minute === 30) continue;
      const value = `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      timeSelect.appendChild(option);
    }
  }
}
dateInput.addEventListener("change", populateTimes);

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".service-card").forEach(item => item.classList.remove("chosen"));
    card.classList.add("chosen");
    document.getElementById("service").value = card.dataset.service;
    document.getElementById("agendamento").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const service = document.getElementById("service").value;
  const date = dateInput.value;
  const time = timeSelect.value;
  if (!service || !date || !time) return;
  const [y,m,d] = date.split("-");
  const message = `Olá! Gostaria de solicitar um agendamento na The Barber.%0A%0A*Serviço:* ${encodeURIComponent(service)}%0A*Data:* ${d}/${m}/${y}%0A*Horário desejado:* ${encodeURIComponent(time)}%0A%0APodem confirmar a disponibilidade?`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener");
  document.getElementById("formNote").textContent = "Solicitação encaminhada! Finalize o envio da mensagem no WhatsApp.";
});

const track = document.getElementById("testimonialTrack");
const dots = [...document.querySelectorAll("#carouselDots button")];
let current = 0;
function moveCarousel(next) {
  current = (next + 3) % 3;
  if (window.matchMedia("(max-width: 650px)").matches) {
    track.scrollTo({ left: current * track.clientWidth, behavior: "smooth" });
  } else {
    // Em telas maiores, alterna a ordem dos cartões para dar navegação ao carrossel.
    const cards = [...track.children];
    cards.forEach((card, index) => card.style.order = (index - current + 3) % 3);
  }
  dots.forEach((dot, index) => dot.classList.toggle("selected", index === current));
}
document.querySelector(".prev").addEventListener("click", () => moveCarousel(current - 1));
document.querySelector(".next").addEventListener("click", () => moveCarousel(current + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => moveCarousel(index)));
window.addEventListener("resize", () => moveCarousel(current));

const backTop = document.querySelector(".back-top");
window.addEventListener("scroll", () => backTop.classList.toggle("visible", window.scrollY > 350));
document.getElementById("year").textContent = new Date().getFullYear();
