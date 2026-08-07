const field = document.querySelector('.field');
const moments = [...document.querySelectorAll('.moment')];
const touchLayout = window.matchMedia('(max-width: 600px), (hover: none), (pointer: coarse)');
const dragLayout = window.matchMedia('(hover: hover) and (pointer: fine)');
const detail = document.querySelector('.detail');
const detailNumber = detail.querySelector('.detail-number');
const detailTitle = detail.querySelector('.detail-title');
const detailDescription = detail.querySelector('.detail-description');
const detailSource = detail.querySelector('.detail-source');

let frameId = null;
let pointer = { x: -1000, y: -1000 };
let dragState = null;
let pinnedMoment = null;
let suppressClick = false;

function loadVideo(video) {
  if (!video || video.src) return;
  video.src = video.dataset.src;
  video.load();
}

function playMoment(moment) {
  const video = moment.querySelector('video');
  if (!video) return;

  loadVideo(video);
  video.play().catch(() => {});
}

function pauseMoment(moment) {
  moment.querySelector('video')?.pause();
}

function showDetail(moment) {
  const caption = moment.querySelector('figcaption');
  detailNumber.textContent = `${moment.dataset.index.padStart(2, '0')} / ${moments.length}`;
  detailTitle.textContent = caption.querySelector('.caption-title').textContent;
  detailDescription.textContent = caption.querySelector('.caption-description').textContent;
  detailSource.textContent = caption.querySelector('.caption-source').textContent;
  detail.dataset.index = moment.dataset.index;
  detail.classList.add('is-visible');
}

function activate(moment) {
  if (!touchLayout.matches) {
    const rect = moment.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const originX = centerX < window.innerWidth * 0.28
      ? 'left'
      : centerX > window.innerWidth * 0.72 ? 'right' : 'center';
    const originY = centerY < window.innerHeight * 0.5 ? 'top' : 'bottom';
    moment.style.transformOrigin = `${originX} ${originY}`;
  }

  moments.forEach((item) => {
    const isActive = item === moment;
    item.classList.toggle('is-active', isActive);
    if (!isActive) pauseMoment(item);
  });

  showDetail(moment);
  playMoment(moment);
}

function deactivate(moment) {
  if (touchLayout.matches || dragState?.moment === moment || moment === pinnedMoment) return;
  moment.classList.remove('is-active');
  pauseMoment(moment);
  if (detail.dataset.index === moment.dataset.index) {
    detail.classList.remove('is-visible');
  }
}

function elasticOffset(distance) {
  const limit = 220;
  return Math.sign(distance) * limit * (1 - 1 / (Math.abs(distance) / limit + 1));
}

function startDrag(event, moment) {
  if (
    !dragLayout.matches
    || event.button !== 0
    || moment === pinnedMoment
    || moment.classList.contains('is-returning')
  ) return;

  dragState = {
    moment,
    moved: false,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
  };

  moment.setPointerCapture(event.pointerId);
  moment.classList.add('is-dragging');
  event.preventDefault();
}

function moveDrag(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;

  const deltaX = event.clientX - dragState.startX;
  const deltaY = event.clientY - dragState.startY;
  const x = elasticOffset(deltaX);
  const y = elasticOffset(deltaY);
  dragState.moved ||= Math.hypot(deltaX, deltaY) > 5;
  dragState.moment.style.setProperty('--drag-x', `${x.toFixed(2)}px`);
  dragState.moment.style.setProperty('--drag-y', `${y.toFixed(2)}px`);
}

function releaseDrag(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;

  const { moment, moved } = dragState;
  if (moment.hasPointerCapture(event.pointerId)) {
    moment.releasePointerCapture(event.pointerId);
  }

  dragState = null;
  moment.classList.remove('is-dragging');

  if (!moved) return;

  suppressClick = true;
  moment.classList.add('is-returning');

  requestAnimationFrame(() => {
    moment.style.setProperty('--drag-x', '0px');
    moment.style.setProperty('--drag-y', '0px');
  });

  window.setTimeout(() => {
    moment.classList.remove('is-returning');
    if (!moment.matches(':hover')) deactivate(moment);
  }, 780);
  window.setTimeout(() => { suppressClick = false; }, 0);
}

function pinMoment(moment) {
  if (pinnedMoment || touchLayout.matches) return;

  const fieldRect = field.getBoundingClientRect();
  const centerX = fieldRect.left + moment.offsetLeft + moment.offsetWidth / 2;
  const centerY = fieldRect.top + moment.offsetTop + moment.offsetHeight / 2;
  const stageCenterX = window.innerWidth * 0.36;
  const scale = Math.min(
    window.innerWidth * 0.48 / moment.offsetWidth,
    window.innerHeight * 0.72 / moment.offsetHeight,
    3.2,
  );

  pinnedMoment = moment;
  moment.style.setProperty('--pin-x', `${(stageCenterX - centerX).toFixed(2)}px`);
  moment.style.setProperty('--pin-y', `${(window.innerHeight / 2 - centerY).toFixed(2)}px`);
  moment.style.setProperty('--pin-scale', scale.toFixed(3));
  moment.classList.add('is-pinned');
  document.body.classList.add('has-pinned');
  activate(moment);
}

function unpinMoment() {
  if (!pinnedMoment) return;

  const moment = pinnedMoment;
  pinnedMoment = null;
  moment.classList.add('is-returning');
  moment.classList.remove('is-pinned');
  document.body.classList.remove('has-pinned');
  deactivate(moment);

  requestAnimationFrame(() => {
    moment.style.setProperty('--pin-x', '0px');
    moment.style.setProperty('--pin-y', '0px');
  });

  window.setTimeout(() => moment.classList.remove('is-returning'), 780);
}

function renderProximity() {
  frameId = null;
  const reach = Math.min(360, window.innerWidth * 0.27);

  moments.forEach((moment) => {
    const rect = moment.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const distance = Math.hypot(pointer.x - x, pointer.y - y);
    const proximity = Math.max(0, 1 - distance / reach);

    moment.style.setProperty('--scale', (0.88 + proximity * 0.22).toFixed(3));
    moment.style.setProperty('--lift', `${(-proximity * 9).toFixed(2)}px`);
    moment.style.opacity = (0.52 + proximity * 0.36).toFixed(3);
  });
}

function scheduleProximity(event) {
  if (touchLayout.matches) return;
  pointer = { x: event.clientX, y: event.clientY };
  if (!frameId) frameId = requestAnimationFrame(renderProximity);
}

moments.forEach((moment) => {
  moment.addEventListener('pointerenter', () => activate(moment));
  moment.addEventListener('pointerleave', () => deactivate(moment));
  moment.addEventListener('focus', () => activate(moment));
  moment.addEventListener('blur', () => deactivate(moment));
  moment.addEventListener('pointerdown', (event) => startDrag(event, moment));
  moment.addEventListener('dragstart', (event) => event.preventDefault());
  moment.addEventListener('click', (event) => {
    event.stopPropagation();
    if (suppressClick) return;
    pinMoment(moment);
  });
  moment.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    pinMoment(moment);
  });
});

field.addEventListener('pointermove', scheduleProximity);
window.addEventListener('pointermove', moveDrag);
window.addEventListener('pointerup', releaseDrag);
window.addEventListener('pointercancel', releaseDrag);
document.addEventListener('click', unpinMoment);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') unpinMoment();
});

if (touchLayout.matches) {
  const observer = new IntersectionObserver((entries) => {
    const mostVisible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (mostVisible?.intersectionRatio >= 0.58) {
      activate(mostVisible.target);
    }
  }, { threshold: [0.58, 0.75] });

  moments.forEach((moment) => observer.observe(moment));
}
