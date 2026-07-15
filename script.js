const form = document.getElementById('planner-form');
const scheduleContainer = document.getElementById('schedule-container');
const downloadBtn = document.getElementById('download-btn');
let currentPlanText = '';

// Map each study goal to a set of tailored session topics.
const goalTopics = {
  'DSA': [
    'Arrays & Strings',
    'Linked Lists',
    'Stacks & Queues',
    'Trees & Graphs',
    'Dynamic Programming',
    'Sorting Algorithms'
  ],
  'MLH Challenges': [
    'Build challenge concept',
    'API integration',
    'Project debugging',
    'User experience polish',
    'Deployment checklist',
    'Performance review'
  ],
  'College Studies': [
    'Lecture review',
    'Core assignment work',
    'Textbook reading',
    'Practice problems',
    'Quiz revision',
    'Group discussion prep'
  ],
  'AI/ML': [
    'Model fundamentals',
    'Data preprocessing',
    'Neural network design',
    'Training experiments',
    'Evaluation metrics',
    'Research reading'
  ],
  'Web Development': [
    'HTML/CSS layout',
    'JavaScript logic',
    'Framework exploration',
    'API integration',
    'Responsive testing',
    'Deployment setup'
  ],
  'Interview Preparation': [
    'Behavioral review',
    'Coding challenges',
    'System design sketching',
    'Resume polish',
    'Mock interviews',
    'Concept flashcards'
  ]
};

// Build a timetable based on hours available and the selected goal.
function generateStudyPlan(name, hours, goal) {
  const topics = goalTopics[goal] || [];
  const sessions = [];

  // Generate between 3 and 6 sessions depending on available hours.
  const sessionCount = Math.min(Math.max(Math.ceil(hours / 1.5), 3), 6);
  const baseDuration = Math.max(1, Math.floor(hours / sessionCount));
  let remainingHours = hours;

  for (let index = 0; index < sessionCount; index += 1) {
    const duration = index === sessionCount - 1 ? remainingHours : baseDuration;
    const topic = topics[index % topics.length] || 'Focused study session';

    sessions.push({
      title: `Session ${index + 1}`,
      topic,
      duration,
      note: `Focus on ${topic.toLowerCase()} with a clear goal.`
    });

    remainingHours -= duration;
  }

  return {
    heading: `Study Plan for ${name}`,
    goal,
    hours,
    sessions
  };
}

// Render the schedule cards in the UI.
function renderSchedule(plan) {
  scheduleContainer.innerHTML = '';

  plan.sessions.forEach((session) => {
    const card = document.createElement('article');
    card.className = 'schedule-card';
    card.innerHTML = `
      <h3>${session.title}</h3>
      <p><strong>Topic:</strong> ${session.topic}</p>
      <p><strong>Duration:</strong> ${session.duration} hour${session.duration > 1 ? 's' : ''}</p>
      <p>${session.note}</p>
    `;

    scheduleContainer.appendChild(card);
  });
}

// Create the downloadable text content for the study plan.
function buildPlanText(plan) {
  const lines = [];
  lines.push(plan.heading);
  lines.push(`Goal: ${plan.goal}`);
  lines.push(`Available Hours: ${plan.hours}`);
  lines.push('');
  lines.push('Recommended timetable:');

  plan.sessions.forEach((session) => {
    lines.push(`- ${session.title}: ${session.topic} (${session.duration} hour${session.duration > 1 ? 's' : ''})`);
  });

  lines.push('');
  lines.push('Stay consistent, take breaks, and iterate based on your progress.');
  return lines.join('\n');
}

// Download the current study plan as a text file.
function downloadPlan(text) {
  const file = new Blob([text], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(file);
  anchor.download = 'study_plan.txt';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(anchor.href);
}

// Show a validation or status message when there is no schedule yet.
function showPlaceholder() {
  scheduleContainer.innerHTML = '<p class="empty-state">Generate a study plan to see your schedule here.</p>';
  downloadBtn.disabled = true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const hours = Number(document.getElementById('hours').value);
  const goal = document.getElementById('goal').value;

  if (!name || !goal || Number.isNaN(hours) || hours < 1) {
    alert('Please enter a valid name and at least 1 hour of study time.');
    return;
  }

  const plan = generateStudyPlan(name, hours, goal);
  renderSchedule(plan);
  currentPlanText = buildPlanText(plan);
  downloadBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
  if (!currentPlanText) {
    return;
  }
  downloadPlan(currentPlanText);
});

showPlaceholder();
