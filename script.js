// Initialize EmailJS (disabled for skeleton demo)
// emailjs.init("YOUR_PUBLIC_KEY_HERE");

let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Calendar functionality
function initCalendar() {
    // Only render when calendar exists on the page
    if (!document.getElementById("calendarDays")) return;
    renderCalendar(currentMonth, currentYear);
}

function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const prevDays = prevLastDay.getDate() - firstDay.getDay() + 1;
    const nextDays = 7 - lastDay.getDay() - 1;

    // Update month/year display
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthYearEl = document.getElementById("monthYear");
    if (monthYearEl) {
        monthYearEl.textContent = `${monthNames[month]} ${year}`;
    }

    const calendarDaysContainer = document.getElementById("calendarDays");
    calendarDaysContainer.innerHTML = "";

    // Previous month's days
    for (let i = prevDays; i <= prevLastDay.getDate(); i++) {
        const dayElement = createDayElement(i, "other-month");
        calendarDaysContainer.appendChild(dayElement);
    }

    // Current month's days
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        const dayElement = createDayElement(i, null);

        // Disable past dates
        if (date < today && date.toDateString() !== today.toDateString()) {
            dayElement.classList.add("disabled");
        } else {
            dayElement.addEventListener("click", () => selectDate(dayElement, i, month, year));
        }

        calendarDaysContainer.appendChild(dayElement);
    }

    // Next month's days
    for (let i = 1; i <= nextDays; i++) {
        const dayElement = createDayElement(i, "other-month");
        calendarDaysContainer.appendChild(dayElement);
    }
}

function createDayElement(day, className) {
    const dayElement = document.createElement("div");
    dayElement.className = `calendar-day ${className || ""}`;
    dayElement.textContent = day;
    return dayElement;
}

function selectDate(element, day, month, year) {
    // Remove previous selection
    document.querySelectorAll(".calendar-day.selected").forEach(el => {
        el.classList.remove("selected");
    });

    // Add selection to clicked element
    element.classList.add("selected");

    // Store selected date
    selectedDate = new Date(year, month, day);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = selectedDate.toLocaleDateString("en-US", options);
    document.getElementById("displayDate").textContent = formattedDate;
}

// Previous/Next month buttons
const prevMonthEl = document.getElementById("prevMonth");
if (prevMonthEl) {
    prevMonthEl.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
}

const nextMonthEl = document.getElementById("nextMonth");
if (nextMonthEl) {
    nextMonthEl.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
}

// Form submission
const bookingFormEl = document.getElementById("bookingForm");
if (bookingFormEl) bookingFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate date selection
    if (!selectedDate) {
        showMessage("Please select a date from the calendar", "error");
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const therapyType = document.getElementById("therapyType").value;
    const sessionTime = document.getElementById("sessionTime").value;
    const message = document.getElementById("message").value.trim();

    // Validate all fields
    if (!fullName || !email || !phone || !therapyType || !sessionTime) {
        showMessage("Please fill in all required fields", "error");
        return;
    }

    // Format the date for display
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = selectedDate.toLocaleDateString("en-US", options);

    // Show loading message
    showMessage("Sending your appointment details...", "loading");

    try {
        // Send email using EmailJS
        const emailParams = {
            to_email: email, // Send to user's email
            user_name: fullName,
            user_email: email,
            user_phone: phone,
            therapy_type: therapyType,
            appointment_date: formattedDate,
            appointment_time: sessionTime,
            user_message: message || "No additional notes provided"
        };

        // Also send a copy to your Gmail (configure this in EmailJS)
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailParams);

        // Success message
        showMessage("✓ Appointment booked successfully! Check your email for confirmation.", "success");

        // Reset form
        setTimeout(() => {
            document.getElementById("bookingForm").reset();
            document.querySelectorAll(".calendar-day.selected").forEach(el => {
                el.classList.remove("selected");
            });
            document.getElementById("displayDate").textContent = "Not selected";
            selectedDate = null;
        }, 1500);

    } catch (error) {
        console.error("Error sending email:", error);
        showMessage("Error booking appointment. Please try again or contact support.", "error");
    }
});

function showMessage(text, type) {
    const messageEl = document.getElementById("formMessage");
    messageEl.textContent = text;
    messageEl.className = `form-message ${type}`;

    if (type === "success" || type === "error") {
        setTimeout(() => {
            messageEl.className = "form-message";
        }, 5000);
    }
}

// Initialize calendar on page load
document.addEventListener("DOMContentLoaded", initCalendar);

// Smooth scroll for navigation links
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});