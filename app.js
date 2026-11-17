'use strict';
const KEY='admission2027.pro.v2',OLD='admission2027.v1';
const exams=[{id:'ss',date:'11월 21일 (토)',school:'숭실대',major:'불어불문',min:'2합6',time:'14:30 입실'},{id:'dg',date:'11월 22일 (일)',school:'동국대',major:'국제통상',min:'2합5',time:'13:00~14:40'},{id:'hufs',date:'11월 28일 (토)',school:'한국외대',major:'중국언어문화학부',min:'2합4',time:'공식 공지 확인'},{id:'cau',date:'11월 29일 (일)',school:'중앙대',major:'유럽문화(독일)',min:'3합6',time:'공식 공지 확인'},{id:'km',date:'12월 5일 (토)',school:'국민대',major:'경영학부 경영학',min:'2합6',time:'11/30 14:00 고사장 공지'}];
const defaults=()=>({version:2,scores:{},regular:{},checks:{},history:[],memo:'',notes:{},targets:[],evidence:[]});
let state=defaults();try{const current=JSON.parse(localStorage.getItem(KEY)||'null'),old=JSON.parse(localStorage.getItem(OLD)||'null');const src=current&&current.version===2?current:old&&old.version===1?old:null;if(src)state={...defaults(),...src,version:2};}catch(e){console.warn(e)}
const $=id=>document.getElementById(id),el=(tag,txt,cls)=>{const x=document.createElement(tag);if(txt!==undefined)x.textContent=txt;if(cls)x.className=cls;return x};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){alert('저장 실패: 저장 공간을 확인하세요')}}
const fields=[['kor','국어 등급',1,9],['korStd','국어 표준점수',0,200],['korPct','국어 백분위',0,100],['math','수학 등급',1,9],['mathStd','수학 표준점수',0,200],['mathPct','수학 백분위',0,100],['eng','영어 등급',1,9],['hist','한국사 등급',1,9],['inq1','탐구1 등급',1,9],['inq1Std','탐구1 표준점수',0,100],['inq1Pct','탐구1 백분위',0,100],['inq2','탐구2 등급',1,9],['inq2Std','탐구2 표준점수',0,100],['inq2Pct','탐구2 백분위',0,100]];
function metric(name,val){const x=el('div',undefined,'metric');x.append(el('div',name,'muted'),el('strong',val));return x}
function renderSummary(){const r=$('summary');r.replaceChildren(metric('성적 입력',fields.filter(f=>state.scores[f[0]]!==undefined&&state.scores[f[0]]!=='').length+'/'+fields.length),metric('논술 응시 완료',exams.filter(x=>state.checks[x.id]).length+'/'+exams.length),metric('등록된 입시 자료',String(state.history.length)+'건'),metric('정시 전략', ['ga','na','da'].filter(k=>state.regular[k]).length+'/3군'));}
for(const [id,name,min,max] of fields){const label=el('label',name),input=el('input');input.id='s_'+id;input.type='number';input.inputMode='numeric';input.min=min;input.max=max;input.step='1';input.value=state.scores[id]??'';label.append(input);$('scoreFields').append(label)}
function renderScore(){const root=$('scoreReport');root.replaceChildren(el('h3','성적 점검 결과'));const get=k=>state.scores[k]===''||state.scores[k]==null?null:Number(state.scores[k]);const grade=['kor','math','eng','inq1','inq2'].map(get);if(grade.every(x=>x!==null)){const sorted=[...grade].sort((a,b)=>a-b);root.append(el('div','참고 지표: 국어·수학·영어·탐구 2과목의 단순 등급 합 = '+grade.reduce((a,b)=>a+b,0),'status'));root.append(el('div','상위 2개 단순 등급 합: '+(sorted[0]+sorted[1])+' / 상위 3개 단순 등급 합: '+(sorted[0]+sorted[1]+sorted[2]),'status ok'));root.append(el('p','※ 위 합산은 탐구 반영 방식, 영어 포함 여부, 한국사 조건 등을 고려하지 않은 참고치입니다. 특정 대학 수능 최저 충족 판정이 아닙니다.','hint'));}else root.append(el('p','국어·수학·영어·탐구 2과목의 등급을 입력하면 참고 등급 합을 확인할 수 있습니다.','hint'));root.append(el('p','정확한 지원 가능 대학 자동 추천은 공식 대학별 환산식과 검증된 합격선 데이터가 필요합니다. 현재 버전에서는 근거 없는 대학 추천을 생성하지 않습니다.','hint'));}
$('saveScore').onclick=()=>{for(const [id,name,min,max] of fields){const v=$('s_'+id).value.trim();if(v!==''&&(!Number.isInteger(Number(v))||Number(v)<min||Number(v)>max)){alert(name+'은(는) '+min+'~'+max+' 범위의 정수로 입력하세요.');$('s_'+id).focus();return}}for(const [id] of fields)state.scores[id]=$('s_'+id).value.trim();save();renderScore();renderSummary();alert('성적이 저장되었습니다')};
function renderExams(){const root=$('examList');root.replaceChildren();for(const x of exams){const wrap=el('div',undefined,'item'),r=el('div',undefined,'row'),info=el('div'),h=el('h3',x.school+' · '+x.major),d=el('div',x.date+' · '+x.time,'muted'),tag=el('span',x.min+' (기존 입력·공식 확인 필요)','tag'),ck=el('input');ck.type='checkbox';ck.checked=!!state.checks[x.id];ck.setAttribute('aria-label',x.school+' 응시 완료');ck.onchange=()=>{state.checks[x.id]=ck.checked;save();renderSummary()};info.append(h,d,tag);r.append(info,ck);wrap.append(r);const note=el('input');note.placeholder='수험표·전형 조건·준비 메모';note.value=state.notes[x.id]||'';note.onchange=()=>{state.notes[x.id]=note.value;save()};wrap.append(note);root.append(wrap)}}
for(const [key,name] of [['ga','가군'],['na','나군'],['da','다군']]){const wrap=el('div',undefined,'item'),h=el('h3',name),inp=el('input');inp.id='r_'+key;inp.placeholder='대학 · 학과 · 상향/적정/안정 · 확인된 모집군';inp.value=state.regular[key]||'';wrap.append(h,inp);$('regularFields').append(wrap)}
$('saveRegular').onclick=()=>{for(const k of ['ga','na','da'])state.regular[k]=$('r_'+k).value.trim();save();renderSummary();alert('정시 전략을 저장했습니다')};
function renderHistory(){const root=$('historyList');root.replaceChildren();if(!state.history.length){root.append(el('p','아직 등록된 공식 입시 결과가 없습니다.','hint'));return}for(const [i,h] of state.history.entries()){const item=el('div',undefined,'item');item.append(el('h3',(h.year||'연도 미상')+' · '+(h.school||'')),el('p',[h.type,h.cut,h.seats&&'모집 '+h.seats+'명',h.ratio&&'경쟁률 '+h.ratio].filter(Boolean).join(' · ')),el('p',h.note||'','muted'),el('small','출처: '+(h.source||'미입력')));if(/^https:\/\//i.test(h.source||'')){const a=el('a','공식 자료 열기');a.href=h.source;a.target='_blank';a.rel='noopener noreferrer';item.append(el('div'),a)}const b=el('button','삭제');b.onclick=()=>{if(confirm('자료를 삭제할까요?')){state.history.splice(i,1);save();renderHistory();renderSummary()}};item.append(el('div'),b);root.append(item)}}
$('addHistory').onclick=()=>{const school=$('histSchool').value.trim(),source=$('histSource').value.trim();if(!school||!source){alert('대학·학과 및 자료 출처를 입력하세요');return}state.history.push({year:$('histYear').value,school,type:$('histType').value.trim(),cut:$('histCut').value.trim(),seats:$('histSeats').value.trim(),ratio:$('histRatio').value.trim(),source,note:$('histNote').value.trim()});save();renderHistory();renderSummary();alert('자료를 등록했습니다. 공식 출처와 기준을 확인하세요')};
$('memo').value=state.memo||'';$('saveMemo').onclick=()=>{state.memo=$('memo').value;save();alert('저장했습니다')};
$('export').onclick=()=>{save();const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='2027-admission-pro-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)};
$('importBtn').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2000000)throw Error('백업 파일이 너무 큽니다');const data=JSON.parse(await f.text());if(![1,2].includes(data.version)||!data.scores||typeof data.scores!=='object'||!data.regular||typeof data.regular!=='object'||!data.checks||typeof data.checks!=='object'||!Array.isArray(data.history))throw Error('지원하지 않는 백업 형식입니다');if(!confirm('현재 데이터를 백업 파일 내용으로 교체할까요?'))return;state={...defaults(),...data,version:2};save();location.reload()}catch(err){alert('복원 실패: '+err.message)}finally{e.target.value=''}};
$('reset').onclick=()=>{if(confirm('모든 PRO 데이터를 삭제할까요? 먼저 백업하세요.')){localStorage.removeItem(KEY);localStorage.removeItem(OLD);location.reload()}};
document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('main section').forEach(s=>s.hidden=s.id!==btn.dataset.tab)});
renderSummary();renderScore();renderExams();renderHistory();save();if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(console.warn);

// 지원 여유도 지표: 수치가 높을수록 좋은 동일 단위 점수만 비교합니다.
// 1~10은 경험적 분류이며 실제 합격 확률이나 합격 보장이 아닙니다.
state.targets=Array.isArray(state.targets)?state.targets:[];
state.evidence=Array.isArray(state.evidence)?state.evidence:[];
const safeNumber=v=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v))?Number(v):null;
function levelFromEvidence(target,entries){
 if(target.track==='논술')return {status:'자료부족',reason:'논술은 수능 성적과 과거 합격선만으로 논술 실력을 평가할 수 없습니다. 최저 충족 여부만 별도 확인합니다.'};
 const n=safeNumber(target.score);
 if(n===null)return {status:'자료부족',reason:'동일 지표의 지원자 점수가 없습니다.'};
 const valid=entries.filter(e=>e.verified&&/^https:\/\//.test(e.source||'')&&safeNumber(e.cut)!==null&&Number(e.year)<2027);
 if(valid.length<3)return {status:'자료부족',reason:'공식 원문을 대조한 서로 다른 연도 3개 이상의 70%컷이 필요합니다.'};
 const values=valid.map(e=>Number(e.cut));const avg=values.reduce((a,b)=>a+b,0)/values.length;
 const range=Math.max(...values)-Math.min(...values);
 // 단위별 점수폭이 달라 고정 퍼센트 차이 대신 최근 연도 컷 대비 순위와 변동폭 사용
 const above=values.filter(v=>n>=v).length;
 const margin=range>0?(n-avg)/range:(n>avg?1:n<avg?-1:0);
 const raw=Math.round(5+margin*2+((above/values.length)-.5)*3);
 const score=Math.min(10,Math.max(1,raw));
 return {status:'평가',score,avg,above,count:values.length,range,reason:'공식 70%컷 대비 상대 위치를 1~10으로 환산한 참고 지수. 경쟁률·모집 인원·올해 지원자 분포는 미반영.'};
}
function renderTargets(){
 const sel=$('aTarget'),root=$('analysisResults');if(!sel||!root)return;sel.replaceChildren();root.replaceChildren();
 if(!state.targets.length){root.append(el('p','비교 대상을 등록하면 결과가 표시됩니다. 현재 사전 검증된 대학별 입시 데이터는 탑재되지 않았습니다.','hint'));return}
 for(const t of state.targets){const o=el('option',t.school+' · '+t.major+' · '+t.track);o.value=t.id;sel.append(o);
 const ev=state.evidence.filter(e=>e.targetId===t.id);const r=levelFromEvidence(t,ev);const card=el('article');card.append(el('h3',t.school+' · '+t.major+' ('+t.track+')'));
 if(t.min==='미충족'){card.append(el('div','수능 최저 미충족 — 해당 전형 지원 자격을 다시 확인하세요.','status warn'))}
 else if(t.track==='논술'&&t.min==='충족'){card.append(el('div','수능 최저 충족(사용자 확인) · 논술 합격 가능성은 별도 평가 필요','status ok'))}
 if(r.status==='평가'){
 const color=r.score>=7?'good':r.score>=4?'medium':'low';const line=el('div','지원 여유도 '+r.score+'/10 · '+(r.score>=7?'상대적 여유':r.score>=4?'경계·검토':'상향 도전'),'rating '+color);card.append(line);
 const bar=el('div',undefined,'meter');for(let i=0;i<10;i++){const seg=el('span');if(i<r.score)seg.className=color;bar.append(seg)}card.append(bar);
 card.append(el('p','입력 점수 '+t.score+' / 과거 컷 평균 '+r.avg.toFixed(2)+' ('+t.metric+') · '+r.count+'개년 중 '+r.above+'개년 컷 이상','muted'));
 }else card.append(el('div','평가 보류 · '+r.reason,'status warn'));
 card.append(el('p',r.reason,'hint'));card.append(el('p','비교 근거 '+ev.length+'건 · 공식 확인 '+ev.filter(x=>x.verified).length+'건','muted'));
 for(const e of ev){const row=el('div',e.year+'년 70%컷 '+e.cut+' · '+(e.verified?'원문 대조 확인':'미검증')+' · '+(e.note||''),'muted');card.append(row);if(/^https:\/\//.test(e.source)){const a=el('a','출처 보기');a.href=e.source;a.target='_blank';a.rel='noopener noreferrer';card.append(a)}}
 const del=el('button','대상 삭제');del.onclick=()=>{if(confirm('비교 대상과 연결된 근거를 삭제할까요?')){state.targets=state.targets.filter(x=>x.id!==t.id);state.evidence=state.evidence.filter(x=>x.targetId!==t.id);save();renderTargets()}};card.append(del);root.append(card)
 }
}
$('addTarget').onclick=()=>{const school=$('aSchool').value.trim(),major=$('aMajor').value.trim(),score=$('aScore').value.trim(),formula=$('aFormula').value.trim();if(!school||!major||safeNumber(score)===null||!formula){alert('대학, 학과, 동일 기준 지원자 점수, 환산 근거를 입력하세요.');return}if(Number(score)<0){alert('점수는 0 이상이어야 합니다');return}state.targets.push({id:'t'+Date.now()+'_'+Math.random().toString(36).slice(2,7),school,major,score,formula,track:$('aTrack').value,metric:$('aMetric').value,min:$('aMin').value});save();renderTargets();alert('비교 대상을 등록했습니다')};
$('addEvidence').onclick=()=>{const targetId=$('aTarget').value,cut=$('aCut').value.trim(),source=$('aSource').value.trim(),year=$('aYear').value,verified=$('aVerified').checked;if(!targetId||safeNumber(cut)===null||Number(cut)<0||!/^https:\/\S+/i.test(source)){alert('비교 대상, 유효한 70%컷, https 출처 URL을 입력하세요');return}if(state.evidence.some(x=>x.targetId===targetId&&x.year===year)){alert('같은 연도 자료가 이미 있습니다. 기존 데이터를 확인하세요.');return}state.evidence.push({targetId,cut,source,year,verified,note:$('aNote').value.trim()});save();renderTargets();alert('자료가 등록되었습니다. 직접 확인한 공식 원문에 대해서만 검증 표시를 사용하세요')};

// Verified-evidence shortlist: no fabricated university cutoffs.
function renderShortlist(){
 const root=$('shortlistResults');if(!root)return;root.replaceChildren();
 const q=($('shortlistQuery')?.value||'').trim().toLowerCase();
 const track=$('shortlistTrack')?.value||'전체';
 const matches=state.targets.filter(t=>(!q||(t.school+' '+t.major).toLowerCase().includes(q))&&(track==='전체'||t.track===track));
 if(!matches.length){root.append(el('p','등록된 대학이 없습니다. 대학별 비교 대상과 공식 입시 결과를 먼저 등록하세요. 실제 대학별 데이터가 없는 상태에서는 추천 명단을 임의 생성하지 않습니다.','hint'));return}
 const ranked=matches.map(t=>({t,r:levelFromEvidence(t,state.evidence.filter(e=>e.targetId===t.id))})).sort((a,b)=>(b.r.score||0)-(a.r.score||0));
 for(const {t,r} of ranked){const card=el('article');card.append(el('h3',t.school+' · '+t.major+' · '+t.track));
 if(r.status==='평가'){const kind=r.score>=7?'good':r.score>=4?'medium':'low';card.append(el('div',r.score+'/10 · '+(r.score>=7?'상대적 여유':r.score>=4?'경계·검토':'상향 도전'),'rating '+kind));const meter=el('div',undefined,'meter');for(let i=0;i<10;i++){const v=el('span');if(i<r.score)v.className=kind;meter.append(v)}card.append(meter)}
 else card.append(el('div','판정 보류 · '+r.reason,'status warn'));
 card.append(el('p','자료 기준: '+t.metric+' · 검증된 연도별 근거 '+state.evidence.filter(e=>e.targetId===t.id&&e.verified).length+'건','muted'));
 if(t.track==='논술')card.append(el('p','논술 성적과 대학별 최저학력기준을 별도로 확인해야 합니다.','hint'));
 root.append(card)
 }
}
$('shortlistQuery')?.addEventListener('input',renderShortlist);
$('shortlistTrack')?.addEventListener('change',renderShortlist);
const originalRenderTargets=renderTargets;
renderTargets=function(){originalRenderTargets();renderShortlist()};
renderTargets();renderShortlist();

// v6: 자동 후보 탐색. 전공 키워드는 실제 학과 개설 여부를 의미하지 않습니다.
const CATALOG = [{"region": "서울", "school": "서울대학교"}, {"region": "서울", "school": "연세대학교"}, {"region": "서울", "school": "고려대학교"}, {"region": "서울", "school": "서강대학교"}, {"region": "서울", "school": "성균관대학교"}, {"region": "서울", "school": "한양대학교"}, {"region": "서울", "school": "중앙대학교"}, {"region": "서울", "school": "경희대학교"}, {"region": "서울", "school": "한국외국어대학교"}, {"region": "서울", "school": "서울시립대학교"}, {"region": "서울", "school": "이화여자대학교"}, {"region": "서울", "school": "건국대학교"}, {"region": "서울", "school": "동국대학교"}, {"region": "서울", "school": "홍익대학교"}, {"region": "서울", "school": "숙명여자대학교"}, {"region": "서울", "school": "숭실대학교"}, {"region": "서울", "school": "국민대학교"}, {"region": "서울", "school": "세종대학교"}, {"region": "서울", "school": "광운대학교"}, {"region": "서울", "school": "명지대학교"}, {"region": "서울", "school": "상명대학교"}, {"region": "서울", "school": "서울여자대학교"}, {"region": "서울", "school": "성신여자대학교"}, {"region": "서울", "school": "덕성여자대학교"}, {"region": "서울", "school": "동덕여자대학교"}, {"region": "서울", "school": "한성대학교"}, {"region": "서울", "school": "삼육대학교"}, {"region": "서울", "school": "성공회대학교"}, {"region": "경기", "school": "가천대학교"}, {"region": "경기", "school": "경기대학교"}, {"region": "경기", "school": "단국대학교"}, {"region": "경기", "school": "아주대학교"}, {"region": "경기", "school": "한국항공대학교"}, {"region": "경기", "school": "수원대학교"}, {"region": "경기", "school": "용인대학교"}, {"region": "경기", "school": "한신대학교"}, {"region": "경기", "school": "성결대학교"}, {"region": "경기", "school": "협성대학교"}, {"region": "경기", "school": "신한대학교"}, {"region": "경기", "school": "한경국립대학교"}, {"region": "인천", "school": "인하대학교"}, {"region": "인천", "school": "인천대학교"}];
const MAJOR_THEMES = {"어문": ["국어국문", "영어영문", "중국어·중문", "프랑스어·불어불문", "일본어·일문"], "경영·경제": ["경영", "경제", "무역·국제통상"], "사회·행정": ["행정", "정치외교", "사회복지", "미디어·커뮤니케이션"], "인문·교육": ["사학", "철학", "교육·심리"]};
function getAutoPercentile(){const keys=['korPct','mathPct','inq1Pct','inq2Pct'];const values=keys.map(k=>safeNumber(state.scores[k]));return values.every(x=>x!==null)?values.reduce((a,b)=>a+b,0)/4:null}
function verifiedTargetFor(school,theme){return state.targets.filter(t=>t.school===school&&(t.major||'').includes(theme.split('·')[0])&&t.track==='정시').map(t=>({t,r:levelFromEvidence(t,state.evidence.filter(e=>e.targetId===t.id))})).find(x=>x.r.status==='평가')}
function autoRender(){const root=$('autoResults');if(!root)return;root.replaceChildren();const region=$('autoRegion').value,field=$('autoField').value,q=$('autoQuery').value.trim().toLowerCase(),scored=$('autoDisplay').value==='scored',pct=getAutoPercentile();let count=0, rated=0;const fragment=document.createDocumentFragment();for(const u of CATALOG){if(region!=='전체'&&region!==u.region)continue;const groups=field==='전체'?Object.entries(MAJOR_THEMES):[[field,MAJOR_THEMES[field]]];for(const [category,themes] of groups){for(const theme of themes){if(q&&!(u.school+' '+theme+' '+category).toLowerCase().includes(q))continue;const match=verifiedTargetFor(u.school,theme);if(scored&&!match)continue;count++;if(match)rated++;const card=el('article');card.className='auto-card';const heading=el('h3',u.school+' · '+theme+' 계열');card.append(heading,el('p',u.region+' · '+category+' · 학과명·개설 여부 확인 필요','muted'));if(match){const r=match.r;const kind=r.score>=7?'good':r.score>=4?'medium':'low';card.append(el('div','🟢🟡🔴 지원 여유도 '+r.score+'/10 · '+(r.score>=7?'상대적 여유':r.score>=4?'경계·검토':'상향 도전'),'rating '+kind));const meter=el('div',undefined,'meter');for(let i=0;i<10;i++){const b=el('span');if(i<r.score)b.className=kind;meter.append(b)}card.append(meter);card.append(el('p','근거: 사용자 등록·검증 표시된 과거 70%컷 '+state.evidence.filter(e=>e.targetId===match.t.id&&e.verified).length+'건. 대학별 환산식의 동일성 재확인 필요.','hint'))}else{card.append(el('div','⚪ 판정 보류 · 공식 합격선·환산식 미등록','status'));}const a=el('a','공식 모집단위 및 입시 결과 확인');a.href='https://www.adiga.kr/';a.target='_blank';a.rel='noopener noreferrer';card.append(a);fragment.append(card);if(count>=160)break}if(count>=160)break}if(count>=160)break}root.append(fragment);if(!count)root.append(el('p','해당 조건에 맞는 후보가 없습니다. 필터를 변경하세요.','hint'));$('autoStats').textContent='탐색 후보 '+count+'개 · 근거 평가 '+rated+'개 · 성적 백분위 '+(pct===null?'미입력':pct.toFixed(1))+' (단순 평균, 합격선 아님). 후보는 대학·학과 개설을 검증한 목록이 아닙니다.';}
['autoRegion','autoField','autoDisplay','autoMetric'].forEach(id=>$(id).addEventListener('change',autoRender));$('autoQuery').addEventListener('input',autoRender);$('autoRun').onclick=autoRender;autoRender();
const oldSaveScore=$('saveScore').onclick;$('saveScore').onclick=()=>{oldSaveScore();autoRender()};
