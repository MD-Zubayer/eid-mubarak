//     const nameInput = document.getElementById('nameInput');
//     const greetingBox = document.getElementById('greetingBox');
//     const personalGreeting = document.getElementById('personalGreeting');

//     nameInput.addEventListener('input', function() {
//         const name = this.value.trim();

//         if(name.length > 0) {
//             personalGreeting.textContent = `${name}, আপনার জন্য`;
//             greetingBox.style.display = 'block';
//         } else {
//             greetingBox.style.display = 'none';
//         }
//     });

//  nameInput.addEventListener('input', function() {
//         if(this.value.trim().length > 0) {
//             document.getElementById('eidAudio').play();
//         }
//     });

// =====================
// ১) নাম লিখে শুভেচ্ছা ও অডিও প্লে
// =====================
const nameInput = document.getElementById('nameInput');
const greetingBox = document.getElementById('greetingBox');
const personalGreeting = document.getElementById('personalGreeting');
const eidAudio = document.getElementById('eidAudio');

nameInput.addEventListener('input', function () {
  const name = this.value.trim();

  if (name.length > 0) {
    personalGreeting.textContent = `${name}, আপনার জন্য`;
    greetingBox.style.display = 'block';
    if (eidAudio.paused) {
      eidAudio.currentTime = 0;
      eidAudio.play();
    }
  } else {
    greetingBox.style.display = 'none';
    eidAudio.pause();
    eidAudio.currentTime = 0;
  }
});

// =====================
// ২) ফায়ারওয়ার্কস (ক্যানভাস) ইফেক্ট
// =====================

// ক্যানভাস সেটআপ
const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');
let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

// রিসাইজ ইভেন্টে ক্যানভাসের সাইজ আপডেট
window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// একটি ফায়ারওয়ার্ক অবজেক্ট (উদাহরণস্বরূপ) তৈরি করার ক্লাস
class Firework {
  constructor() {
    this.reset();
  }

  reset() {
    // বেস পয়েন্ট (নীচের কোন একটি এক্স-স্থান থেকে শুরু)
    this.x = Math.random() * w;
    this.y = h + 10;
    // লক্ষ্য (উচ্চতায়)
    this.targetY = Math.random() * h * 0.5 + h * 0.1;
    this.speed = Math.random() * 3 + 2;
    this.angle = -Math.PI / 2; // উপরে দিকে
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      // যদি এখনও বিস্ফোরণ না করেছে, উপরের দিকে বৃদ্ধি
      this.y += this.speed * Math.sin(this.angle);
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.createParticles();
      }
    } else {
      // বিস্ফোরণের পর পার্টিকেল আপডেট
      this.particles.forEach((p) => p.update());
      // বর্ধিত পার্টিকেলসমূহের মধ্যে যারা পৃথিবীতে পৌঁছাবে না, তাদের ফিল্টার
      this.particles = this.particles.filter((p) => !p.done);
      // যদি পার্টিকেলসমূহ শেষ হয়, পুরো ফায়ারওয়ার্ক রিসেট
      if (this.particles.length === 0) {
        this.reset();
      }
    }
  }

  draw() {
    if (!this.exploded) {
      // রক হিসাবে ছোট সাদা বিন্দু
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // পার্টিকেলসমূহ আঁকুন
      this.particles.forEach((p) => p.draw());
    }
  }

  createParticles() {
    // পার্টিকেল তৈরি: রঙিন ছোট-বড় বিন্দু
    const count = 50 + Math.floor(Math.random() * 50);
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
  }
}

// পার্টিকেল ক্লাস: বিস্ফোরণের রঙিন গুলি
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 4 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.gravity = 0.05;
    this.friction = 0.98;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.007;
    // এলোমেলো রঙ
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    this.color = `rgba(${r},${g},${b},`;
    this.done = false;
  }

  update() {
    // গতিবিদ্যা: ভর ও ঘর্ষণ সামলানো
    this.speed *= this.friction;
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle) + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= 0) {
      this.done = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  }
}

// ফায়ারওয়ার্ক অবজেক্টের অ্যারে
const fireworks = [];

// কিছু ফায়ারওয়ার্ক তৈরির জন্য
for (let i = 0; i < 5; i++) {
  fireworks.push(new Firework());
}

// অ্যানিমেশন লুপ
function animate() {
  // হালকা সুন্দর ব্লারিং-ইফেক্ট দিতে ব্যাকগ্রাউন্ড একটু মিশ্রিত কালো আঁকা
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, w, h);

  fireworks.forEach((fw) => {
    fw.update();
    fw.draw();
  });

  // মাঝে মাঝে নতুন ফায়ারওয়ার্ক যোগ করতে পারেন
  if (Math.random() < 0.02) {
    fireworks.push(new Firework());
  }

  requestAnimationFrame(animate);
}

// অ্যানিমেশন শুরু
animate();
