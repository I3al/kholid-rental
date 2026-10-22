/* Original practice material. Not official JFT questions or an official score estimator. */
(() => {
'use strict';
const D=window.KholidJftData||{sets:[]};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SEC=[['文字と語彙','Script & Vocabulary'],['会話と表現','Conversation & Expression'],['聴解','Listening'],['読解','Reading']];
const CAT={'kanji-baca':'Pembacaan kanji','kanji-makna':'Makna & penggunaan kanji','makna':'Makna kata','penggunaan':'Penggunaan kata','gramatika':'Gramatika','ungkapan':'Ungkapan','percakapan':'Percakapan','tempat-umum':'Toko & tempat umum','pengumuman':'Pengumuman & instruksi','isi':'Memahami isi bacaan','cari-info':'Mencari informasi'};
const KEY='kwJftV2';
const load=k=>{try{const v=localStorage.getItem(KEY+k);return v?JSON.parse(v):null;}catch(e){return null;}};
const save=(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v));}catch(e){}};
let hist=load('hist')||[];
let stats=load('stats')||{0:[0,0],1:[0,0],2:[0,0],3:[0,0]};
let attempt=null,drill=null,tick=null,finishPrompt=false,audioEpoch=0,openAudio=false;
const AUDIO_MAX=2,EXAM_MS=3600000;
const SETS=D.sets.map(s=>({id:s.id,name:s.name,sub:s.sub,q:s.q.map(q=>Object.assign({section:q[0],cat:q[1],prompt:q[2],opts:q[3],answer:q[4],explanation:q[5]},q[6]||{}))}));
const setById=id=>SETS.find(s=>s.id===id);
const firstOf=(qs,s)=>{for(let i=0;i<qs.length;i++)if(qs[i].section===s)return i;return -1;};
const lastOf=(qs,s)=>{for(let i=qs.length-1;i>=0;i--)if(qs[i].section===s)return i;return -1;};
const supportsAudio=()=>'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
function stopAudio(){audioEpoch++;if(supportsAudio())speechSynthesis.cancel();}
function say(text,statusId){
 const st=$(statusId);
 if(!supportsAudio()){if(st)st.textContent='Audio tidak didukung. Aktifkan mode transkrip.';return;}
 const voice=speechSynthesis.getVoices().find(v=>(v.lang||'').toLowerCase().startsWith('ja'));
 if(!voice&&speechSynthesis.getVoices().length&&!('onvoiceschanged' in speechSynthesis)){if(st)st.textContent='Suara Jepang belum tersedia. Aktifkan suara Jepang di perangkat, lalu tes ulang, atau gunakan mode transkrip.';return;}
 stopAudio();const ep=audioEpoch;
 const u=new SpeechSynthesisUtterance(text.replace(/(^|\n)[^：\n]{1,4}：/g,'$1'));
 u.lang='ja-JP';if(voice)u.voice=voice;u.rate=.85;
 u.onstart=()=>{if(st&&ep===audioEpoch)st.textContent='Audio sedang diputar…';};
 u.onend=()=>{if(st&&ep===audioEpoch)st.textContent='Audio selesai.';};
 u.onerror=()=>{if(st&&ep===audioEpoch)st.textContent='Audio tidak dapat diputar. Periksa suara dan izin perangkat. Mode transkrip tersedia melalui tombol bantuan.';};
 speechSynthesis.speak(u);
}
function svgClock(h,m){
 const P=(deg,len)=>[60+Math.sin(deg*Math.PI/180)*len,60-Math.cos(deg*Math.PI/180)*len];
 const a=(h%12)*30+m*.5,b=m*6;
 const [hx,hy]=P(a,24),[mx,my]=P(b,38);
 let ticks='';
 for(let i=0;i<12;i++){const [x1,y1]=P(i*30,47),[x2,y2]=P(i*30,54);ticks+='<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="#5a6b60" stroke-width="2"/>';}
 return '<svg viewBox="0 0 120 120" width="92" height="92" role="img" aria-label="jam analog"><circle cx="60" cy="60" r="56" fill="#fffdf7" stroke="#273f36" stroke-width="4"/>'+ticks+'<line x1="60" y1="60" x2="'+hx.toFixed(1)+'" y2="'+hy.toFixed(1)+'" stroke="#273f36" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="'+mx.toFixed(1)+'" y2="'+my.toFixed(1)+'" stroke="#ad7444" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#273f36"/></svg>';
}
function svgSign(p){
 const tones={red:['#c23b2e'],blue:['#2f6f9f'],green:['#2e7d4f'],yellow:['#b8860b']};
 const col=(tones[p.tone]||tones.blue)[0];
 const lines=p.lines||[];
 const w=230,h=64+lines.length*36;
 let t='';
 const y0=h/2-(lines.length-1)*18+10;
 lines.forEach((ln,i)=>{t+='<text x="'+(w/2)+'" y="'+(y0+i*36)+'" text-anchor="middle" font-size="'+(i===0?(lines.length===1?30:27):21)+'" font-weight="700" fill="'+(i===0?col:'#33302a')+'" font-family="sans-serif">'+esc(ln)+'</text>';});
 return '<svg viewBox="0 0 '+w+' '+h+'" width="'+Math.min(240,w)+'" role="img" aria-label="papan tanda"><rect x="6" y="6" width="'+(w-12)+'" height="'+(h-12)+'" rx="10" fill="#fffdf7" stroke="'+col+'" stroke-width="8"/>'+t+'</svg>';
}
function svgScene(p){
 return '<svg viewBox="0 0 160 160" width="124" height="124" role="img" aria-label="ilustrasi"><rect x="4" y="4" width="152" height="152" rx="14" fill="'+(p.bg||'#e8f1ec')+'"/><text x="80" y="106" text-anchor="middle" font-size="72">'+p.e+'</text></svg>';
}
const picSVG=p=>p.t==='clock'?svgClock(p.h||0,p.m||0):p.t==='sign'?svgSign(p):svgScene(p);
const picHTML=p=>'<div class="kw-picture">'+picSVG(p)+'</div>';
function optsHTML(q,answers,i,mode){
 if(q.po){
  return '<div class="kw-answers kw-answers-pic">'+q.po.map((p,n)=>'<button class="kw-answer kw-answer-pic '+(answers[i]===n?'selected':'')+'" data-answer="'+n+'" aria-pressed="'+(answers[i]===n)+'">'+picSVG(p)+'<span>'+(mode==='exam'?'ABCD'[n]:esc(q.opts[n]))+'</span></button>').join('')+'</div>';
 }
 return '<div class="kw-answers">'+q.opts.map((o,n)=>'<button class="kw-answer '+(answers[i]===n?'selected':'')+'" data-answer="'+n+'" aria-pressed="'+(answers[i]===n)+'"><span>'+'ABCD'[n]+'</span>'+esc(o)+'</button>').join('')+'</div>';
}
function secStats(){
 const out=SEC.map(()=>({a:0,t:0}));
 attempt.q.forEach((q,i)=>{out[q.section].t++;if(attempt.answers[i]!==null)out[q.section].a++;});
 return out;
}
function saveExamResult(){
 const total=attempt.q.length;
 const correct=attempt.q.reduce((n,q,i)=>n+(attempt.answers[i]===q.answer?1:0),0);
 const sec=SEC.map((x,s)=>{let c=0,t=0;attempt.q.forEach((q,i)=>{if(q.section===s){t++;if(attempt.answers[i]===q.answer)c++;}});return [c,t];});
 const entry={d:Date.now(),set:attempt.set.id,mode:'exam',correct,total,pct:Math.round(correct/total*100),scaled:Math.round(10+240*correct/total),sec};
 hist.unshift(entry);hist=hist.slice(0,40);save('hist',hist);
 sec.forEach((st,s)=>{stats[s][0]+=st[0];stats[s][1]+=st[1];});save('stats',stats);
 return {correct,total,sec};
}
function saveDrillResult(rows,answers,mode){
 const total=rows.length,correct=rows.reduce((n,x,i)=>n+(answers[i]===x.q.answer?1:0),0);
 hist.unshift({d:Date.now(),set:(drill.set||{}).id||'P1',mode,label:drill.label,correct,total,pct:Math.round(correct/total*100),scaled:null});
 hist=hist.slice(0,40);save('hist',hist);
 const secs=new Set(rows.map(x=>x.q.section));
 rows.forEach(x=>{if(answers[drill.rows.indexOf(x)]===x.q.answer)stats[x.q.section][0]++;stats[x.q.section][1]++;});
 save('stats',stats);
 return {correct,total};
}
function intro(){
 stopAudio();finishPrompt=false;
 const bestFor=id=>hist.filter(h=>h.set===id&&h.mode==='exam').reduce((m,h)=>Math.max(m,h.pct),-1);
 const setCards=SETS.map(s=>{
  const b=bestFor(s.id),at=hist.filter(h=>h.set===s.id).length;
  return '<div class="kw-setcard"><div class="kw-sethead"><b lang="ja">'+esc(s.name)+'</b><span>'+(b>=0?'Terbaik '+b+'%':'Belum dikerjakan')+' · '+at+' sesi</span></div><p class="kw-quiet">'+esc(s.sub)+' · '+s.q.length+' soal</p><div class="kw-setrow"><button class="btn" data-exam="'+s.id+'">Mulai ujian 60 menit ↗</button></div><div class="kw-drillchips">'+SEC.map((x,si)=>'<button class="chip" data-drill="'+s.id+':'+si+'">'+x[0]+'<small>'+s.q.filter(q=>q.section===si).length+'</small></button>').join('')+'</div><p class="kw-note">Klik nama bagian untuk latihan cepat tanpa timer, pembahasan muncul langsung.</p></div>';
 }).join('');
 const statRows=SEC.map((x,i)=>{const st=stats[i]||[0,0];const pct=st[1]?Math.round(st[0]/st[1]*100):null;return '<div class="kw-catrow"><span>'+x[0]+'</span><b>'+(pct===null?'—':pct+'%')+' <small>('+(st[0])+'/'+(st[1])+')</small></b></div>';}).join('');
 const histList=hist.length?'<ul class="kw-history">'+hist.slice(0,6).map(h=>'<li><span>'+new Date(h.d).toLocaleDateString('id-ID',{day:'numeric',month:'short'})+' · '+esc(h.set||'')+' '+(h.mode==='exam'?'Ujian':h.mode==='drill'?'Latihan '+esc(h.label||''):'Ulang soal')+'</span><b>'+(h.scaled!=null?h.scaled+' pts · ':Math.round(h.pct)+'% · ')+h.correct+'/'+h.total+'</b></li>').join('')+'</ul>':'<p class="kw-quiet">Belum ada riwayat. Selesaikan satu paket untuk mulai melacak kemajuan.</p>';
 $('jftArea').innerHTML='<div class="kw-jft-intro"><div class="card"><p class="kw-eyebrow">PELATIHAN JFT-BASIC · FORMAT RESMI</p><h2>Ruang ujian seperti aslinya</h2><p>Simulasi mengikuti struktur ujian asli: empat bagian dengan sekitar 12 soal per bagian, satu jam penuh, dan navigasi ala CBT Prometric.</p><ul class="kw-checklist"><li>Struktur resmi: 文字と語彙 12 · 会話と表現 12 · 聴解 12 · 読解 14</li><li>Soal bergambar: ilustrasi kosakata, papan peringatan, dan jam pada soal menyimak</li><li>Aturan asli: tidak bisa kembali ke bagian sebelumnya; bagian menyimak tanpa navigasi; audio maksimal 2×</li><li>Hasil: estimasi skor skala 10–250, ambang lulus A2 = 200</li></ul><div class="kw-exam-meta"><div><b>50</b><small>soal per paket</small></div><div><b>60</b><small>menit pengerjaan</small></div><div><b>3</b><small>paket soal orisinal</small></div></div><p class="kw-note">Soal orisinal yang dibuat mengikuti format dan tingkat kesulitan resmi (A2) — bukan soal resmi atau bocoran. Japan Foundation tidak pernah menerbitkan soal ujian lama, dan menurut Prometric membagikan isi ujian termasuk tindakan menyontek yang bisa membatalkan nilai. Situs berbayar pun menggunakan soal latihan mandiri semacam ini.</p><p class="kw-note">Bagian menyimak memakai suara Jepang dari perangkat. Pakai headphone dan tes audio dahulu. Sesi tidak tersimpan saat halaman dimuat ulang.</p><div class="kw-audio"><button class="btn ghost" id="jftTestAudio">Tes suara Jepang</button><span id="jftAudioStatus" class="kw-listening-status" role="status"></span></div><label class="kw-check"><input id="jftTranscriptMode" type="checkbox">Gunakan transkrip untuk bagian menyimak</label><label class="kw-check"><input id="jftReady" type="checkbox">Saya memahami aturan latihan ini.</label></div><div><div class="card"><p class="kw-eyebrow">PILIH PAKET</p>'+setCards+'</div><div class="card"><p class="kw-eyebrow">RIWAYAT & STATISTIK</p><h3>Akumulasi per bagian</h3>'+statRows+'<h3>Riwayat terakhir</h3>'+histList+'</div><div class="card kw-info-card"><p class="kw-eyebrow">INFO UJIAN INDONESIA</p><p>Periode ujian Oktober–November 2026 sedang berjalan; reservasi periode Desember 2026–Januari 2027 biasanya dibuka sekitar akhir November. Daftar resmi lewat Prometric, biaya ujian Rp550.000.</p><p><a href="https://www.prometric-jp.com/id/ssw/test_list/archives/1" target="_blank" rel="noopener">Jadwal & reservasi resmi Prometric ↗</a></p></div></div></div>';
 $('jftReady').onchange=()=>{document.querySelectorAll('[data-exam]').forEach(b=>b.disabled=!$('jftReady').checked);};
 $('jftTestAudio').onclick=()=>say('こんにちは。日本語の音声テストです。','jftAudioStatus');
 $('jftTranscriptMode').onchange=()=>{openAudio=$('jftTranscriptMode').checked;};
 document.querySelectorAll('[data-exam]').forEach(b=>b.disabled=true);
 document.querySelectorAll('[data-exam]').forEach(b=>b.onclick=()=>{if(!openAudio&&$('jftTranscriptMode'))openAudio=$('jftTranscriptMode').checked;if(!supportsAudio()&&!openAudio){$('jftAudioStatus').textContent='Perangkat ini tidak mendukung audio. Aktifkan mode transkrip untuk melanjutkan.';return;}startExam(b.dataset.exam);$('jftArea').scrollIntoView({behavior:'smooth',block:'start'});});
 document.querySelectorAll('[data-drill]').forEach(b=>b.onclick=()=>{const [id,sec]=b.dataset.drill.split(':');startDrill(id,Number(sec));$('jftArea').scrollIntoView({behavior:'smooth',block:'start'});});
}
function startExam(id){
 const s=setById(id);if(!s)return;
 attempt={mode:'exam',set:s,q:s.q,answers:Array(s.q.length).fill(null),marked:Array(s.q.length).fill(false),gate:[false,false,false,false],audio:Array(s.q.length).fill(0),index:0,deadline:Date.now()+EXAM_MS,done:false};
 finishPrompt=false;render();clearInterval(tick);tick=setInterval(updateClock,1000);
}
function renderGate(sec){
 const count=attempt.q.filter(q=>q.section===sec).length;
 $('jftArea').innerHTML='<div class="kw-test-top"><div><b>Ujian '+esc(attempt.set.name)+'</b><div class="kw-quiet">Bagian berikutnya: '+SEC[sec][1]+'</div></div><span id="jftClock" class="kw-clock" role="timer" aria-label="Sisa waktu">--:--</span><button class="btn" id="jftSubmit">Selesaikan ujian</button></div><div id="jftConfirm"></div><div class="card kw-question kw-gate"><p class="kw-eyebrow">BAGIAN 0'+(sec+1)+' / 04</p><span class="jp" lang="ja">'+SEC[sec][0]+'</span><span class="en">'+SEC[sec][1]+' · '+count+' soal</span>'+(sec===2?'<p class="kw-note">Aturan bagian menyimak: Anda tidak dapat berpindah ke soal sebelumnya atau sesudahnya. Setiap audio hanya dapat diputar maksimal 2×, seperti ujian asli.</p>':(sec>0?'<p class="kw-note">Setelah masuk bagian ini, Anda tidak bisa kembali ke bagian sebelumnya.</p>':'<p class="kw-note">Di dalam satu bagian Anda bebas berpindah soal dan mengubah jawaban. Waktu 60 menit dipakai untuk seluruh ujian.</p>'))+'<div class="btn-row"><button class="btn" id="jftGateGo">Mulai bagian →</button></div></div>';
 $('jftGateGo').onclick=()=>{attempt.gate[sec]=true;render();$('jftQuestionText').focus({preventScroll:true});};
 $('jftSubmit').onclick=confirmFinish;
}
function nextLabel(i){
 const sec=attempt.q[i].section;
 if(sec===2)return 'Berikutnya →';
 if(i===lastOf(attempt.q,sec))return sec<3?'Ke bagian berikutnya →':'Tinjau & selesai';
 return 'Berikutnya →';
}
function render(){
 if(!attempt)return;
 if(attempt.done){results();return;}
 const i=attempt.index,q=attempt.q[i],sec=q.section;
 if(!attempt.gate[sec]){renderGate(sec);return;}
 const first=firstOf(attempt.q,sec);
 const answered=attempt.answers.filter(a=>a!==null).length;
 const si=secStats();
 const listening=sec===2;
 const plays=attempt.audio[i];
 const map=listening?'':'<aside class="card kw-map-panel"><h3>NAVIGASI SOAL</h3><div class="kw-question-map">'+attempt.q.map((q2,n)=>({q2,n})).filter(x=>x.q2.section===sec).map(x=>'<button data-question="'+x.n+'" class="'+(attempt.answers[x.n]!==null?'answered ':'')+(attempt.marked[x.n]?'marked ':'')+(i===x.n?'current':'')+'" aria-label="Soal '+(x.n+1)+(attempt.answers[x.n]!==null?', terjawab':', belum dijawab')+'">'+(x.n+1)+'</button>').join('')+'</div><p class="kw-note">Bebas berpindah di dalam bagian yang sama. Setelah pindah bagian, tidak bisa kembali — seperti ujian asli.</p></aside>';
 $('jftArea').innerHTML='<div class="kw-test-top"><div><b>Soal '+(i+1)+' / '+attempt.q.length+'</b><div class="kw-quiet">'+answered+' terjawab · '+(openAudio?'Mode transkrip':'Mode audio')+'</div></div><span id="jftClock" class="kw-clock" role="timer" aria-label="Sisa waktu">60:00</span><button class="btn" id="jftSubmit">Selesaikan ujian</button></div><div class="kw-secbar">'+SEC.map((x,s)=>'<span class="kw-secpill '+(s===sec?'on':s<sec?'done':'')+'">0'+(s+1)+' '+x[0]+' '+si[s].a+'/'+si[s].t+'</span>').join('')+'</div><div id="jftConfirm"></div><div class="kw-test-grid"><article class="card kw-question"><p class="kw-eyebrow">BAGIAN 0'+(sec+1)+' · '+SEC[sec][0]+'<span class="kw-cat">'+esc(CAT[q.cat]||'')+'</span></p>'+(q.passage?'<div class="kw-reading" lang="ja">'+esc(q.passage)+'</div>':'')+(q.pic?picHTML(q.pic):'')+(q.audio?'<div class="kw-audio"><button class="btn ghost" id="jftPlay" '+(plays>=AUDIO_MAX?'disabled':'')+'>Putar percakapan ('+(AUDIO_MAX-plays)+'× tersisa)</button>'+(plays>0?'<button class="kw-mark" id="jftStop">Hentikan audio</button>':'')+'</div><p class="kw-listening-status" id="jftListenStatus" role="status"></p>'+(openAudio?'<div class="kw-reading" lang="ja">'+esc(q.audio)+'</div>':(supportsAudio()?'':'<button class="kw-mark" id="jftAudioHelp">Audio bermasalah · gunakan transkrip</button>')):'')+'<h2 lang="ja" id="jftQuestionText" tabindex="-1">'+esc(q.prompt)+'</h2>'+optsHTML(q,attempt.answers,i,'exam')+'<div class="kw-controls">'+(listening?'':'<button class="btn ghost" id="jftPrev" '+(i===first?'disabled':'')+'>← Sebelumnya</button><button class="kw-mark" id="jftMark" aria-pressed="'+attempt.marked[i]+'">'+(attempt.marked[i]?'Hapus tanda':'Tandai ragu')+'</button>')+'<button class="btn" id="jftNext" '+(listening&&attempt.answers[i]===null?'disabled':'')+'>'+nextLabel(i)+'</button></div></article>'+map+'</div>';
 document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.answer);attempt.answers[i]=n;render();const el=document.querySelector('[data-answer="'+n+'"]');if(el)el.focus();});
 document.querySelectorAll('[data-question]').forEach(b=>b.onclick=()=>go(Number(b.dataset.question)));
 const prev=$('jftPrev');if(prev)prev.onclick=()=>go(i-1);
 const mark=$('jftMark');if(mark)mark.onclick=()=>{attempt.marked[i]=!attempt.marked[i];render();$('jftMark').focus();};
 $('jftNext').onclick=()=>{const last=lastOf(attempt.q,sec);if(i===last){sec<3?askNextSection(sec):confirmFinish();}else go(i+1);};
 $('jftSubmit').onclick=confirmFinish;
 if(q.audio){
  $('jftPlay').onclick=()=>{say(q.audio,'jftListenStatus');attempt.audio[i]++;const b=$('jftPlay');if(b){b.textContent='Putar percakapan ('+Math.max(0,AUDIO_MAX-attempt.audio[i])+'× tersisa)';if(attempt.audio[i]>=AUDIO_MAX)b.disabled=true;}};
  const stop=$('jftStop');if(stop)stop.onclick=()=>{stopAudio();$('jftListenStatus').textContent='Audio dihentikan.';};
  const help=$('jftAudioHelp');if(help)help.onclick=()=>{openAudio=true;stopAudio();render();};
 }
 updateClock();if(finishPrompt)showConfirm();
}
function go(n){
 const cur=attempt.q[attempt.index].section;
 if(n<firstOf(attempt.q,cur)||n>lastOf(attempt.q,cur))return;
 stopAudio();attempt.index=n;finishPrompt=false;render();$('jftQuestionText').focus({preventScroll:true});
}
function askNextSection(sec){
 finishPrompt=true;
 $('jftConfirm').innerHTML='<div class="kw-dialog" role="region" aria-label="Konfirmasi pindah bagian"><h3>Pindah ke '+SEC[sec+1][0]+'?</h3><p>Seperti ujian asli, setelah masuk bagian berikutnya Anda <b>tidak bisa kembali</b> ke bagian ini. Pastikan semua jawaban bagian ini sudah final.</p><div class="btn-row"><button class="btn" id="jftGateYes">Ya, lanjut ke bagian berikutnya</button><button class="btn ghost" id="jftGateNo">Masih mengerjakan bagian ini</button></div></div>';
 $('jftGateYes').onclick=()=>{finishPrompt=false;attempt.gate[sec+1]=false;attempt.index=firstOf(attempt.q,sec+1);$('jftConfirm').innerHTML='';render();$('jftQuestionText').focus({preventScroll:true});};
 $('jftGateNo').onclick=()=>{finishPrompt=false;$('jftConfirm').innerHTML='';$('jftNext').focus();};
 $('jftConfirm').scrollIntoView({behavior:'smooth',block:'center'});$('jftGateYes').focus({preventScroll:true});
}
function confirmFinish(){
 const unopened=SEC.map((x,s)=>s).filter(s=>!attempt.gate[s]);
 const blank=attempt.answers.filter(a=>a===null).length,marked=attempt.marked.filter(Boolean).length;
 finishPrompt=true;
 $('jftConfirm').innerHTML='<div class="kw-dialog" role="region" aria-label="Konfirmasi penyelesaian"><h3>Kumpulkan jawaban?</h3><p>'+(unopened.length?'Bagian '+unopened.map(s=>'0'+(s+1)+' '+SEC[s][0]).join(', ')+' belum dibuka ('+unopened.reduce((n,s)=>n+attempt.q.filter(q=>q.section===s).length,0)+' soal). ':'')+blank+' soal belum dijawab dan '+marked+' soal ditandai ragu. Soal kosong dihitung salah.</p><div class="btn-row"><button class="btn" id="jftFinishYes">Ya, lihat hasil</button><button class="btn ghost" id="jftFinishNo">Lanjut mengerjakan</button></div></div>';
 $('jftFinishYes').onclick=()=>finish(false);
 $('jftFinishNo').onclick=()=>{finishPrompt=false;$('jftConfirm').innerHTML='';$('jftSubmit').focus();};
 $('jftConfirm').scrollIntoView({behavior:'smooth',block:'center'});$('jftFinishYes').focus({preventScroll:true});
}
function updateClock(){
 if(!attempt||attempt.done)return;
 const seconds=Math.max(0,Math.ceil((attempt.deadline-Date.now())/1000));
 const clock=$('jftClock');
 if(clock){clock.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');clock.classList.toggle('urgent',seconds<300);}
 if(seconds===0)finish(true);
}
function finish(expired){
 if(!attempt||attempt.done)return;
 stopAudio();clearInterval(tick);attempt.done=true;attempt.expired=expired;
 attempt.elapsed=Math.min(3600,Math.max(0,Math.round((Date.now()-(attempt.deadline-EXAM_MS))/1000)));
 attempt.tally=saveExamResult();results();
}
function bandOf(scaled){
 return scaled>=200?['A2.2 · LULUS','pass']:scaled>=175?['A2.1','near']:scaled>=145?['A1','low']:['Belum A1','low'];
}
function results(){
 const total=attempt.q.length,{correct,sec}=attempt.tally;
 const pct=Math.round(correct/total*100);
 const scaled=Math.round(10+240*correct/total);
 const [band,cls]=bandOf(scaled);
 const wrongRows=attempt.q.map((q,i)=>({q,i})).filter(x=>attempt.answers[x.i]!==x.q.answer);
 const cats={};
 attempt.q.forEach((q,i)=>{const k=CAT[q.cat]||q.cat;cats[k]=cats[k]||[0,0];cats[k][1]++;if(attempt.answers[i]===q.answer)cats[k][0]++;});
 $('jftArea').innerHTML='<div class="card kw-question"><p class="kw-eyebrow">HASIL '+esc(attempt.set.name)+(attempt.expired?' · WAKTU HABIS':'')+'</p><div class="kw-scoreline"><span class="kw-score">'+pct+'<small style="font-size:24px"> / 100%</small></span><span class="kw-band '+cls+'">'+band+'</span></div><h2>'+'Estimasi skor skala: '+scaled+' / 250</h2><div class="kw-scorebar"><i style="width:'+(scaled/2.5).toFixed(1)+'%"></i><u></u></div><div class="kw-scorebar-labels"><span>10</span><span>lulus A2 = 200</span><span>250</span></div><p>'+(attempt.mode==='exam'?'Durasi '+Math.floor(attempt.elapsed/60)+' menit '+(attempt.elapsed%60)+' detik. '+(openAudio?'Bagian menyimak dikerjakan dengan transkrip; hasil tidak mengukur kemampuan mendengar.':'Bagian menyimak memakai audio sintetis Jepang.'):'')+'</p><p class="kw-note">Estimasi latihan, bukan konversi resmi: ujian asli memakai skala statistik (equating) 10–250. Ambang lulus A2 untuk visa Specified Skilled Worker adalah 200. Sejak Agustus 2026 hasil resmi juga menampilkan sublevel: 145–174 = A1, 175–199 = A2.1.</p><div class="btn-row">'+(wrongRows.length?'<button class="btn" id="jftRetryWrong">Ulangi '+wrongRows.length+' soal yang salah ↻</button>':'')+'<button class="btn ghost" id="jftBack">Paket lain</button><button class="btn ghost" id="jftStudy">Pelajari kotoba</button></div></div><div class="kw-result-grid">'+SEC.map((s,n)=>'<div class="card"><p>'+s[0]+'</p><strong>'+sec[n][0]+' / '+sec[n][1]+'</strong><p>'+Math.round(sec[n][0]/sec[n][1]*100)+'% benar</p></div>').join('')+'</div><div class="card"><p class="kw-eyebrow">RINCIAN JENIS SOAL</p>'+Object.entries(cats).map(([k,v])=>'<div class="kw-catrow"><span>'+esc(k)+'</span><b>'+v[0]+' / '+v[1]+' <small>('+Math.round(v[0]/v[1]*100)+'%)</small></b></div>').join('')+'</div><h2>Pembahasan setiap soal</h2><p class="kw-note">Buka soal untuk melihat jawaban, alasan, gambar, dan transkrip menyimak.</p>'+attempt.q.map((q,i)=>{const a=attempt.answers[i],right=a===q.answer;return '<details class="card kw-review"><summary>'+(i+1)+'. '+(right?'Benar':'Perlu diulang')+' · <span lang="ja">'+esc(q.prompt.split('\n')[0])+'</span></summary>'+(q.passage?'<div class="kw-reading" lang="ja">'+esc(q.passage)+'</div>':'')+(q.pic?picHTML(q.pic):'')+(q.audio?'<p class="kw-eyebrow">TRANSKRIP AUDIO</p><div class="kw-reading" lang="ja">'+esc(q.audio)+'</div>':'')+'<p lang="ja">'+esc(q.prompt)+'</p>'+optsHTML(q,attempt.answers,i,'review')+'<p>Jawabanmu: <b>'+(a===null?'Tidak dijawab':esc(q.opts[a]))+'</b><br>Jawaban benar: <b>'+esc(q.opts[q.answer])+'</b></p><p>'+esc(q.explanation)+'</p></details>';}).join('');
 const rw=$('jftRetryWrong');if(rw)rw.onclick=()=>startWrongDrill();
 $('jftBack').onclick=()=>{attempt=null;intro();$('jftArea').scrollIntoView({behavior:'smooth'});};
 $('jftStudy').onclick=()=>{const target=document.querySelector('[data-tab="kotoba"]');if(target)target.click();};
}
function startDrill(id,sec){
 const s=setById(id);if(!s)return;
 const rows=s.q.map((q,i)=>({q,i})).filter(x=>x.q.section===sec);
 drill={set:s,sec,rows,answers:rows.map(()=>null),index:0,done:false,label:SEC[sec][0]};
 renderDrill();
}
function startWrongDrill(){
 const rows=attempt.q.map((q,i)=>({q,i})).filter(x=>attempt.answers[x.i]!==x.q.answer);
 if(!rows.length)return;
 drill={set:attempt.set,sec:null,rows,answers:rows.map(()=>null),index:0,done:false,label:'Ulang soal salah'};
 attempt=null;clearInterval(tick);renderDrill();
}
function drillFeedback(q,a){
 const right=a===q.answer;
 return '<div class="kw-feedback '+(right?'ok':'no')+'"><b>'+(right?'Benar ✓':'Kurang tepat ✗')+'</b> Jawaban: '+esc(q.opts[q.answer])+'<br>'+esc(q.explanation)+'</div>';
}
function renderDrill(){
 if(!drill)return;
 if(drill.done){drillResults();return;}
 const i=drill.index,x=drill.rows[i],q=x.q,sec=q.section;
 const answered=drill.answers[i]!==null;
 const origin=drill.sec===null?'Ulang soal salah':'BAGIAN 0'+(sec+1)+' · '+SEC[sec][0];
 $('jftArea').innerHTML='<div class="kw-test-top"><div><b>Latihan '+esc(drill.label)+'</b><div class="kw-quiet">Soal '+(i+1)+' / '+drill.rows.length+' · '+(drill.set?esc(drill.set.name):'')+'</div></div><button class="btn ghost" id="jftDrillExit">Keluar latihan</button></div><div class="card kw-question"><p class="kw-eyebrow">'+origin+'<span class="kw-cat">'+esc(CAT[q.cat]||'')+'</span></p>'+(q.passage?'<div class="kw-reading" lang="ja">'+esc(q.passage)+'</div>':'')+(q.pic?picHTML(q.pic):'')+(q.audio?'<div class="kw-audio"><button class="btn ghost" id="jftPlay">Putar percakapan</button><button class="kw-mark" id="jftStop">Hentikan audio</button></div><p class="kw-listening-status" id="jftListenStatus" role="status"></p>'+(openAudio?'<div class="kw-reading" lang="ja">'+esc(q.audio)+'</div>':(supportsAudio()?'':'<button class="kw-mark" id="jftAudioHelp">Audio bermasalah · gunakan transkrip</button>')):'')+'<h2 lang="ja" id="jftQuestionText" tabindex="-1">'+esc(q.prompt)+'</h2>'+optsHTML(q,drill.answers,i,'drill')+(answered?drillFeedback(q,drill.answers[i]):'')+'<div class="kw-controls"><button class="btn ghost" id="jftDrillPrev" '+(i===0?'disabled':'')+'>← Sebelumnya</button><button class="btn" id="jftDrillNext">'+(i===drill.rows.length-1?'Lihat hasil':'Lanjut →')+'</button></div></div>';
 $('jftDrillExit').onclick=()=>{drill=null;intro();$('jftArea').scrollIntoView({behavior:'smooth'});};
 document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(drill.answers[i]!==null)return;drill.answers[i]=Number(b.dataset.answer);renderDrill();});
 $('jftDrillPrev').onclick=()=>{drill.index=Math.max(0,i-1);renderDrill();};
 $('jftDrillNext').onclick=()=>{if(i===drill.rows.length-1){drill.done=true;drill.tally=saveDrillResult(drill.rows,drill.answers,drill.sec===null?'review':'drill');drillResults();}else{drill.index++;renderDrill();}};
 if(q.audio){
  $('jftPlay').onclick=()=>say(q.audio,'jftListenStatus');
  $('jftStop').onclick=()=>{stopAudio();$('jftListenStatus').textContent='Audio dihentikan.';};
  const help=$('jftAudioHelp');if(help)help.onclick=()=>{openAudio=true;renderDrill();};
 }
 $('jftQuestionText').focus({preventScroll:true});
}
function drillResults(){
 const {correct,total}=drill.tally;
 $('jftArea').innerHTML='<div class="card kw-question"><p class="kw-eyebrow">HASIL LATIHAN · '+esc(drill.label)+'</p><div class="kw-score">'+Math.round(correct/total*100)+'<small style="font-size:24px"> / 100%</small></div><h2>'+correct+' dari '+total+' jawaban benar</h2><p class="kw-note">Hasil latihan menambah statistik bagian yang relevan. Lanjutkan ke paket penuh untuk mengukur kecepatan dengan timer 60 menit.</p><div class="btn-row"><button class="btn" id="jftDrillAgain">Ulangi latihan ini ↻</button><button class="btn ghost" id="jftDrillBack">Paket lain</button></div></div>'+drill.rows.map((x,i)=>{const a=drill.answers[i],right=a===x.q.answer;return '<details class="card kw-review"><summary>'+(i+1)+'. '+(right?'Benar':'Perlu diulang')+' · <span lang="ja">'+esc(x.q.prompt.split('\n')[0])+'</span></summary>'+(x.q.passage?'<div class="kw-reading" lang="ja">'+esc(x.q.passage)+'</div>':'')+(x.q.pic?picHTML(x.q.pic):'')+(x.q.audio?'<p class="kw-eyebrow">TRANSKRIP AUDIO</p><div class="kw-reading" lang="ja">'+esc(x.q.audio)+'</div>':'')+'<p lang="ja">'+esc(x.q.prompt)+'</p>'+(x.q.opts.map((o,n)=>'<p>'+(n===x.q.answer?'✓ ':'　 ')+esc(o)+'</p>').join(''))+'<p>'+esc(x.q.explanation)+'</p></details>';}).join('');
 $('jftDrillAgain').onclick=()=>{drill=Object.assign({},drill,{answers:drill.rows.map(()=>null),index:0,done:false});renderDrill();$('jftArea').scrollIntoView({behavior:'smooth'});};
 $('jftDrillBack').onclick=()=>{drill=null;intro();$('jftArea').scrollIntoView({behavior:'smooth'});};
}
window.KholidJft={open(){
 if(drill&&!drill.done)renderDrill();
 else if(attempt&&!attempt.done){render();updateClock();}
 else if(attempt&&attempt.done)results();
 else intro();
}};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateClock();});
document.addEventListener('click',e=>{if(e.target.closest('[data-tab],[data-go]'))stopAudio();});
})();
