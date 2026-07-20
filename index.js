/* ============================================================
   KHOLID RENTAL — Visual Comfort + Spectacular Phase 2
   Cursor glow · 3D tilt · Magnetic buttons · Pricing counter · Testimonial carousel · Scroll shift
   ============================================================ */
'use strict';

/* ===== UTILITY ===== */
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/* ===== FLEET ===== */
const FLEET = [
    { id:1, name:'Honda Brio',     type:'city', seats:5, trans:'Manual', ac:true, price:250000,  badge:'City Car',     img:'images/car-brio.jpg' },
    { id:2, name:'Daihatsu Ayla',  type:'city', seats:5, trans:'Manual', ac:true, price:225000,  badge:'City Car',     img:'images/car-ayla.jpg' },
    { id:3, name:'Daihatsu Xenia', type:'mpv',  seats:7, trans:'Manual', ac:true, price:300000,  badge:'MPV 7-Seater', img:'images/car-xenia.jpg' },
    { id:4, name:'Toyota Avanza',  type:'mpv',  seats:7, trans:'Manual', ac:true, price:350000,  badge:'MPV 7-Seater', img:'images/car-avanza.jpg' },
    { id:5, name:'Suzuki Ertiga',  type:'mpv',  seats:7, trans:'Manual', ac:true, price:350000,  badge:'MPV Keluarga', img:'images/car-ertiga.jpg' },
    { id:6, name:'Toyota Innova',  type:'mpv',  seats:7, trans:'Manual/Matik', ac:true, price:500000, badge:'MPV Premium', img:'images/car-innova.jpg' },
    { id:7, name:'Toyota Fortuner',type:'suv',  seats:7, trans:'Manual/Matik', ac:true, price:900000, badge:'SUV 4×4',     img:'images/car-fortuner.jpg' },
    { id:8, name:'Mitsubishi Pajero',type:'suv',seats:7, trans:'Manual/Matik', ac:true, price:1100000,badge:'SUV 4×4',   img:'images/car-pajero.jpg' },
    { id:9, name:'Daihatsu Terios',type:'suv',  seats:7, trans:'Manual', ac:true, price:450000,  badge:'SUV Compact',  img:'images/car-terios.jpg' },
    { id:10,name:'Toyota Hiace',   type:'mpv',  seats:10,trans:'Manual', ac:true, price:700000,  badge:'Minibus',      img:'images/car-hiace.jpg' },
];

/* ===== TESTIMONIALS ===== */
const TESTIS = [
    { id:1, name:'Rina W.', role:'Wisatawan Jakarta', text:'Mobil bersih, AC dingin, sopir ramah. Next ke Lombok pasti rental lagi.', stars:5 },
    { id:2, name:'Budi S.', role:'Family Trip', text:'Innova untuk 7 orang full aman. Anak-anak nyaman, barang muat semua.', stars:5 },
    { id:3, name:'Sarah L.', role:'Backpacker', text:'Sewa Brio lepas kunci 3 hari. Harga transparan, no surprise. Highly recommended!', stars:5 },
];

/* ===== FAQ ===== */
const FAQS = [
    { qId:'Syarat sewa apa saja?', qEn:'What are the requirements?', aId:'KTP asli/SIM A berlaku min 1 tahun + deposit tunai Rp200–500rb.', aEn:'Original ID, valid driving license (min 1 year), cash deposit Rp200–500k.' },
    { qId:'Berapa DP?', qEn:'How much deposit?', aId:'DP 50% via transfer. Sisa bayar saat mobil diantar.', aEn:'50% down payment via transfer. Pay rest upon delivery.' },
    { qId:'Ada denda telat?', qEn:'Late fee?', aId:'Rp50–100rb/jam. Lebih 3 jam dihitung 1 hari sewa.', aEn:'Rp50–100k/hour. Over 3 hours = 1 extra day.' },
    { qId:'Antar ke hotel/bandara?', qEn:'Free delivery?', aId:'Gratis area Mataram & Senggigi. Luar kota ada biaya tambahan.', aEn:'Free within Mataram & Senggigi. Outer areas extra fee.' },
    { qId:'Wilayah layanan?', qEn:'Service area?', aId:'Seluruh Lombok. Kuta, Mandalika, Sembalun, Gili, dll.', aEn:'All Lombok. Kuta, Mandalika, Sembalun, Gili, etc.' },
    { qId:'Bisa sewa mingguan?', qEn:'Weekly rental?', aId:'Bisa. Harga khusus, silakan chat langsung.', aEn:'Yes. Special price, please chat directly.' },
];

/* ===== I18N ===== */
const I18N = {
    id: {
        'hero.meta':'RENTAL MOBIL LOMBOK',
        'hero.title':'Jelajahi Lombok <span class="text-brass">Tanpa Batas</span>',
        'hero.sub':'Lepas kunci atau dengan sopir. Armada terawat, harga transparan, antar-jemput bandara. Pengalaman perjalanan yang berbeda di Lombok.',
        'fleet.tag':'ARMADA','fleet.title':'Pilih Mobil <span class="text-brass">Kepercayaan</span>','fleet.sub':'Setiap unit dirawat rutin. Anda pilih yang cocok.',
        'services.tag':'LAYANAN','services.title':'Empat Cara <span class="text-brass">Sewa</span>','services.sub':'Sesuaikan dengan rencana perjalanan Anda.',
        'why.tag':'ALASAN','why.title':'Mengapa <span class="text-brass">KHOLID RENTAL</span>','why.sub':'Bukan sekadar sewa mobil. Ini tentang perjalanan yang tenang.',
        'how.tag':'CARA PESAN','how.title':'Empat Langkah <span class="text-brass">Mudah</span>','how.sub':'Dari chat sampai mobil di depan Anda.',
        'how.s1':'Chat WhatsApp','how.s1d':'Bilang mau sewa mobil apa, tanggal, lepas kunci atau pakai sopir.',
        'how.s2':'Kami Konfirmasi','how.s2d':'Ketersediaan dicek, rincian harga dikirim — transparan.',
        'how.s3':'DP & Persiapan','how.s3d':'DP 50% via transfer. Mobil disiapkan, full bensin.',
        'how.s4':'Mobil Diantar','how.s4d':'Diantar ke bandara atau hotel. Langsung jalan!',
        'faq.tag':'FAQ','faq.title':'Pertanyaan <span class="text-brass">Umum</span>',
        'contact.tag':'KONTAK','contact.title':'Hubungi <span class="text-brass">Kami</span>','contact.sub':'Lebih cepat lewat WhatsApp. Atau mampir.',
        'fleet.day':'/hari','fleet.book':'Booking WA','fleet.empty':'Tidak ada mobil kategori ini. Coba filter lain.',
    },
    en: {
        'hero.meta':'LOMBOK CAR RENTAL',
        'hero.title':'Explore Lombok <span class="text-brass">Without Limits</span>',
        'hero.sub':'Self-drive or with driver. Well-maintained fleet, transparent pricing, airport transfer. A different travel experience in Lombok.',
        'fleet.tag':'FLEET','fleet.title':'Choose a <span class="text-brass">Trusted Car</span>','fleet.sub':'Every unit regularly serviced. Pick what fits.',
        'services.tag':'SERVICES','services.title':'Four Ways to <span class="text-brass">Rent</span>','services.sub':'Adjust to your travel plan.',
        'why.tag':'WHY US','why.title':'Why <span class="text-brass">KHOLID RENTAL</span>','why.sub':'Not just a car rental. It\'s about peace of mind.',
        'how.tag':'HOW TO BOOK','how.title':'Four Easy <span class="text-brass">Steps</span>','how.sub':'From chat to car at your door.',
        'how.s1':'Chat WhatsApp','how.s1d':'Tell us which car, dates, self-drive or with driver.',
        'how.s2':'We Confirm','how.s2d':'Check availability, send transparent price breakdown.',
        'how.s3':'DP & Prep','how.s3d':'50% down payment. Car cleaned, full tank.',
        'how.s4':'Car Delivered','how.s4d':'Delivered to airport or hotel. Let\'s drive!',
        'faq.tag':'FAQ','faq.title':'Frequently <span class="text-brass">Asked</span>',
        'contact.tag':'CONTACT','contact.title':'Get In <span class="text-brass">Touch</span>','contact.sub':'Faster via WhatsApp. Or drop by.',
        'fleet.day':'/day','fleet.book':'Book via WA','fleet.empty':'No cars in this category. Try another filter.',
    }
};

let lang='id', filter='all';

/* ===== FLEET RENDER ===== */
function renderFleet(){
    const g=document.getElementById('fleetGrid'); if(!g)return;
    const d=filter==='all'?FLEET:FLEET.filter(c=>c.type===filter);
    if(!d.length){g.innerHTML=`<div class="fleet-empty">${I18N[lang]['fleet.empty']}</div>`;return;}
    g.classList.add('filtering');
    g.innerHTML=d.map(c=>{
        const p=`Rp ${c.price.toLocaleString('id-ID')}`;
        const wa=encodeURIComponent(`Halo KHOLID RENTAL, saya mau booking ${c.name}.`);
        const seats=`<span class="fleet-spec"><span class="fleet-spec-dot"></span>${c.seats} Kursi</span>`;
        const trans=`<span class="fleet-spec"><span class="fleet-spec-dot"></span>${c.trans}</span>`;
        const ac=`<span class="fleet-spec"><span class="fleet-spec-dot"></span>${c.ac?'AC':'-'}</span>`;
        return `<div class="fleet-card" data-delay="${c.id}" data-price="${c.price}">
            <div class="fleet-card-img-wrap">
                <div class="fleet-card-img" style="background-image:url('${c.img}')"></div>
                <span class="fleet-card-badge">${c.badge}</span>
            </div>
            <div class="fleet-card-body">
                <h3 class="fleet-card-title">${c.name}</h3>
                <div class="fleet-card-specs">${seats}${trans}${ac}</div>
                <div class="fleet-card-pricing">
                    <span class="price-val" data-target="${c.price}">Rp 0 <small>${I18N[lang]['fleet.day']}</small></span>
                    <a href="https://wa.me/6287731992067?text=${wa}" target="_blank" rel="noopener" class="fleet-cta">${I18N[lang]['fleet.book']} →</a>
                </div>
            </div>
        </div>`;
    }).join('');
    requestAnimationFrame(()=>{
        g.classList.remove('filtering');
        $$('.fleet-card',g).forEach((el,i)=>{
            setTimeout(()=>el.classList.add('visible'), i*80);
        });
    });
}

/* ===== TESTI RENDER (carousel with JS auto-scroll) ===== */
function renderTestis(){
    const c=document.getElementById('testiCarousel'); if(!c)return;
    const cards=TESTIS.map(t=>{
        const s='★'.repeat(t.stars)+'☆'.repeat(5-t.stars);
        const initials=t.name.split(' ').map(w=>w[0]).join('').slice(0,2);
        return `<div class="testi-card">
            <p class="testi-text">${t.text}</p>
            <div class="testi-author">
                <div class="testi-avatar">${initials}</div>
                <div>
                    <div class="testi-name">${t.name}</div>
                    <div class="testi-role">${t.role}</div>
                    <div class="testi-stars">${s}</div>
                </div>
            </div>
        </div>`;
    }).join('');
    c.innerHTML=cards+cards; // duplicate for seamless loop
    // Dots
    const dots=document.getElementById('testiDots');
    if(dots){
        dots.innerHTML=TESTIS.map((_,i)=>`<span class="testi-dot${i===0?' active':''}" data-i="${i}"></span>`).join('');
        dots.addEventListener('click',e=>{
            const dot=e.target.closest('.testi-dot'); if(!dot)return;
            const i=parseInt(dot.dataset.i);
            dot.parentElement.querySelector('.active')?.classList.remove('active');
            dot.classList.add('active');
            const cardWidth=c.querySelector('.testi-card')?.offsetWidth||320;
            c.scrollTo({left:(cardWidth+20)*i,behavior:'smooth'});
        });
    }
    // Auto-scroll
    let scrollInterval;
    function startScroll(){
        scrollInterval=setInterval(()=>{
            if(c.matches(':hover')) return;
            const cardWidth=c.querySelector('.testi-card')?.offsetWidth||320;
            const gap=20;
            const step=cardWidth+gap;
            c.scrollBy({left:step,behavior:'smooth'});
            // Loop: if past duplicated half, reset to start
            const maxScroll=c.scrollWidth/2;
            if(c.scrollLeft>=maxScroll-step){
                setTimeout(()=>{c.scrollLeft=0;},600);
            }
        },4000);
    }
    c.addEventListener('mouseenter',()=>clearInterval(scrollInterval));
    c.addEventListener('mouseleave',startScroll);
    startScroll();
    // Update dots on manual scroll
    let ticking=false;
    c.addEventListener('scroll',()=>{
        if(!ticking){
            requestAnimationFrame(()=>{
                const cardWidth=c.querySelector('.testi-card')?.offsetWidth||320;
                const gap=20;
                const idx=Math.round(c.scrollLeft/(cardWidth+gap)) % TESTIS.length;
                const cur=document.querySelector('.testi-dot.active');
                if(cur) cur.classList.remove('active');
                const dot=document.querySelector(`.testi-dot[data-i="${idx}"]`);
                if(dot) dot.classList.add('active');
                ticking=false;
            });
            ticking=true;
        }
    },{passive:true});
}

/* ===== FAQ ===== */
function renderFAQ(){
    const l=document.getElementById('faqList'); if(!l)return;
    const qk=lang==='id'?'qId':'qEn', ak=lang==='id'?'aId':'aEn';
    l.innerHTML=FAQS.map((f,i)=>`<div class="faq-item">
        <button class="faq-question" data-i="${i}" aria-expanded="false"><span>${f[qk]}</span><span class="faq-arrow"></span></button>
        <div class="faq-answer">${f[ak]}</div>
    </div>`).join('');
    $$('.faq-question').forEach(b=>b.addEventListener('click',()=>{
        const item=b.closest('.faq-item'), open=item.classList.contains('open');
        $$('.faq-item.open').forEach(e=>{e.classList.remove('open');e.querySelector('.faq-question')?.setAttribute('aria-expanded','false');});
        if(!open){item.classList.add('open');b.setAttribute('aria-expanded','true');}
    }));
}

/* ===== I18N ===== */
function setLanguage(l){
    lang=l;
    $$('[data-i18n]').forEach(el=>{
        const k=el.dataset.i18n; if(!I18N[l][k])return;
        el.innerHTML=I18N[l][k];
    });
    $$('.lang-link').forEach(el=>el.classList.toggle('active',el.dataset.lang===l));
    renderFleet(); renderFAQ();
}

/* ===== ACTIVE NAV ===== */
function setupActiveNav(){
    const items=$$('.nav-item[data-section]');
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                const id=e.target.id;
                items.forEach(n=>n.classList.toggle('active',n.dataset.section===id));
            }
        });
    },{threshold:.3,rootMargin:'0px -20% 0px -20%'});
    $$('section[id]').forEach(s=>observer.observe(s));
}

/* ===== REVEAL (includes directional variants) ===== */
function setupReveal(){
    const o=new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target);}
        });
    },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
    $$('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el=>o.observe(el));
}

/* ===== CURSOR GLOW ===== */
function setupCursorGlow(){
    const glow=document.getElementById('cursorGlow');
    if(!glow||isTouch()){if(glow)glow.style.display='none';return;}
    let ticking=false;
    window.addEventListener('mousemove',e=>{
        if(!ticking){
            requestAnimationFrame(()=>{
                glow.style.transform=`translate(${e.clientX-250}px, ${e.clientY-250}px)`;
                ticking=false;
            });
            ticking=true;
        }
    },{passive:true});
}

/* ===== 3D CARD TILT ===== */
function setupCardTilt(){
    if(isTouch())return;
    const cards=$$('.fleet-card, .service-card');
    cards.forEach(card=>{
        card.addEventListener('mousemove',e=>{
            const rect=card.getBoundingClientRect();
            const x=e.clientX-rect.left;
            const y=e.clientY-rect.top;
            const cx=rect.width/2, cy=rect.height/2;
            const dx=(x-cx)/cx, dy=(y-cy)/cy;
            card.style.transform=`perspective(600px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave',()=>{
            card.style.transform='perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)';
        });
    });
}

/* ===== MAGNETIC BUTTONS ===== */
function setupMagneticButtons(){
    if(isTouch())return;
    const btns=$$('.btn-primary, .btn-outline');
    btns.forEach(btn=>{
        btn.addEventListener('mousemove',e=>{
            const rect=btn.getBoundingClientRect();
            const dx=e.clientX-rect.left-rect.width/2;
            const dy=e.clientY-rect.top-rect.height/2;
            const max=8;
            const cx=Math.min(Math.max(dx/rect.width*max,-max),max);
            const cy=Math.min(Math.max(dy/rect.height*max,-max),max);
            btn.style.transform=`translate(${cx}px, ${cy}px)`;
        });
        btn.addEventListener('mouseleave',()=>{
            btn.style.transform='translate(0px, 0px)';
        });
    });
}

/* ===== PRICING COUNTER (fleet scroll) ===== */
function setupPricingCounter(){
    const grid=document.getElementById('fleetGrid');
    if(!grid)return;
    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                // Animate all visible prices
                const prices=$$('.price-val[data-target]', e.target);
                prices.forEach(el=>{
                    const target=parseInt(el.dataset.target);
                    const duration=800;
                    const start=performance.now();
                    function tick(now){
                        const progress=Math.min((now-start)/duration,1);
                        const eased=1-Math.pow(1-progress,3);
                        const val=Math.round(target*eased);
                        el.innerHTML=`Rp ${val.toLocaleString('id-ID')} <small>${I18N[lang]['fleet.day']}</small>`;
                        if(progress<1) requestAnimationFrame(tick);
                        else el.innerHTML=`Rp ${target.toLocaleString('id-ID')} <small>${I18N[lang]['fleet.day']}</small>`;
                    }
                    requestAnimationFrame(tick);
                });
                observer.unobserve(e.target);
            }
        });
    },{threshold:.2});
    observer.observe(grid);
}

/* ===== PARALLAX HERO ===== */
function setupParallax(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    window.addEventListener('scroll',()=>{
        const st=window.scrollY;
        if(st<600) hero.style.backgroundPositionY=`${st*0.35}px`;
    },{passive:true});
}

/* ===== HEADER SCROLL ===== */
function setupHeaderScroll(){
    const header=document.getElementById('header');
    if(!header)return;
    let ticking=false;
    window.addEventListener('scroll',()=>{
        if(!ticking){requestAnimationFrame(()=>{header.classList.toggle('scrolled',window.scrollY>60);ticking=false;});ticking=true;}
    },{passive:true});
}

/* ===== SCROLL PROGRESS BAR ===== */
function setupScrollProgress(){
    const update=()=>{
        const pct=(window.scrollY)/(document.documentElement.scrollHeight-window.innerHeight)*100;
        document.documentElement.style.setProperty('--scroll-pct', Math.min(pct,100)+'%');
    };
    window.addEventListener('scroll', update, {passive:true});
    update();
}

/* ===== SCROLL SECTION BG SHIFT ===== */
function setupScrollShift(){
    const alts=$$('.section-alt');
    if(!alts.length)return;
    window.addEventListener('scroll',()=>{
        const st=window.scrollY*0.02;
        alts.forEach((el,i)=>{
            const offset=st+(i*20);
            el.style.backgroundPosition=`center ${offset}px`;
        });
    },{passive:true});
}

/* ===== STATS COUNTER ===== */
function setupStatsCounter(){
    const grid=document.getElementById('statsGrid');
    if(!grid)return;
    const nums=$$('.stat-num',grid);
    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                observer.unobserve(e.target);
                nums.forEach(num=>{
                    const target=parseFloat(num.dataset.target);
                    const isFloat=target!==Math.floor(target);
                    const duration=1200;
                    let current=0;
                    const start=performance.now();
                    function tick(now){
                        const progress=Math.min((now-start)/duration,1);
                        const eased=1-Math.pow(1-progress,3);
                        const val=isFloat ? (target*eased).toFixed(1) : Math.round(target*eased);
                        num.textContent=isFloat ? val : val;
                        num.style.opacity=1;
                        num.style.transform='translateY(0)';
                        if(progress<1) requestAnimationFrame(tick);
                        else {
                            num.textContent=isFloat ? target.toFixed(1) : Math.round(target);
                            if(num.dataset.target==='24') num.textContent='24/7';
                        }
                    }
                    requestAnimationFrame(tick);
                });
            }
        });
    },{threshold:.3});
    observer.observe(grid);
}

/* ===== BACK TO TOP ===== */
function setupBackToTop(){
    const btn=document.getElementById('backToTop');
    if(!btn)return;
    window.addEventListener('scroll',()=>{
        btn.classList.toggle('visible',window.scrollY>300);
    },{passive:true});
    btn.addEventListener('click',()=>{
        window.scrollTo({top:0,behavior:'smooth'});
    });
}

/* ===== ENTRY SEQUENCE (hero stagger) ===== */
function entrySequence(){
    const ht=document.getElementById('heroText');
    if(ht){setTimeout(()=>ht.classList.add('animate'),100);}
}

/* ===== NAV ===== */
function setupNav(){
    const hb=document.getElementById('hamburgerBtn');
    const nm=document.getElementById('navMain');
    if(hb&&nm){
        hb.addEventListener('click',()=>{nm.classList.toggle('open');hb.classList.toggle('active');});
        $$('.nav-item',nm).forEach(a=>a.addEventListener('click',()=>{nm.classList.remove('open');hb.classList.remove('active');}));
    }
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        const h=a.getAttribute('href'); if(h==='#')return;
        const t=document.querySelector(h); if(!t)return;
        a.addEventListener('click',e=>{e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});});
    });
}

/* ===== FILTERS ===== */
function setupFilters(){
    $$('.filter-btn').forEach(b=>{
        b.addEventListener('click',()=>{
            $$('.filter-btn').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false');});
            b.classList.add('active');b.setAttribute('aria-selected','true');
            filter=b.dataset.filter;renderFleet();
        });
    });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded',()=>{
    entrySequence();
    renderFleet();renderTestis();renderFAQ();setLanguage('id');
    setupFilters();setupReveal();setupNav();setupActiveNav();setupParallax();setupHeaderScroll();
    setupScrollProgress();setupStatsCounter();setupBackToTop();
    setupCursorGlow();setupCardTilt();setupMagneticButtons();setupPricingCounter();setupScrollShift();
    $$('.lang-link').forEach(l=>l.addEventListener('click',e=>{e.preventDefault();setLanguage(l.dataset.lang);}));
});
