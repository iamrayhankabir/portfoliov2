(function(){
  "use strict";
  var nav = document.getElementById('nav');
  var bar = document.getElementById('bar');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop;
    nav.classList.toggle('scrolled', y > 8);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = links.map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        links.forEach(function(a){ a.removeAttribute('aria-current'); });
        var active = links[sections.indexOf(e.target)];
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(s){ spy.observe(s); });
  }

  if (burger && menu){
    burger.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('lock', open);
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('lock');
      });
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 860){
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('lock');
      }
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var spot = document.getElementById('spot');
  if (spot && !reduce && fine){
    var x = window.innerWidth / 2, y = 160, tx = x, ty = y;
    window.addEventListener('pointermove', function(e){ tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop(){
      x += (tx - x) * 0.075;
      y += (ty - y) * 0.075;
      spot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  } else if (spot){
    spot.style.display = 'none';
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
