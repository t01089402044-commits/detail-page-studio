
const SEC_TMPL = {
  banner:()=>`<div class="sec-wrap s-banner">
    <div class="s-banner-season" contenteditable data-ph="시즌 텍스트">2025 SS NEW ARRIVAL</div>
    <div class="s-banner-kr" contenteditable data-ph="제품명" style="font-family:var(--pf,'Noto Sans KR',sans-serif)">상품명을 여기에 입력해주세요</div>
    <div class="s-banner-en" contenteditable data-ph="영문 부제">Crafted for everyday excellence.</div>
  </div>`,
  hero:()=>`<div class="sec-wrap s-hero">${izNew('메인 히어로 이미지','860 × 1000px',700)}</div>`,
  trust:()=>`<div class="sec-wrap s-trust">
    ${['🚚,무료배송,5만원 이상<br>전 상품 무료','⚡,당일출발,오후 2시 이전<br>주문 당일 발송','🔄,무료 교환·반품,수령 후 14일 이내<br>무료 처리','🇰🇷,국내 생산,Made in Korea<br>국내 제조·관리'].map(s=>{
      const[ico,nm,desc]=s.split(',');
      return`<div class="s-trust-item" style="position:relative"><button class="del-btn" onclick="delItem('s-trust-item',this)">✕</button><button class="add-btn" onclick="addTrustItem()">+</button><button class="ico-btn" onclick="openEP(this.closest('.s-trust-item').querySelector('.icon-editable'),event)">🎨 아이콘</button><div class="s-trust-ico icon-editable" onclick="openEP(this,event)">${ico}</div><div class="s-trust-name" contenteditable>${nm}</div><div class="s-trust-desc" contenteditable>${desc}</div></div>`;
    }).join('')}
  </div>`,
  copy:()=>`<div class="sec-wrap s-copy">
    <div class="s-copy-eye" contenteditable>Brand Story</div>
    <div class="s-copy-quote" contenteditable>"한 번 입으면 알게 되는<br><em>그 차이</em>"</div>
    <div class="s-copy-line"></div>
    <div class="s-copy-body" contenteditable>매일 꺼내 입고 싶어지는 옷이 있습니다. 특별하지 않아도, 화려하지 않아도 — 입는 순간 왜 이걸 골랐는지 알게 되는 그런 옷. 좋은 소재와 정직한 제작이 만든 결과입니다.</div>
  </div>`,
  proof:()=>`<div class="sec-wrap s-proof">
    ${[['4.9★','Rating'],['2,841개','Review'],['71%','Repurchase'],['12K+','Sold']].map(([n,l])=>`<div class="s-proof-item" style="position:relative"><button class="del-btn" onclick="delItem('s-proof-item',this)">✕</button><button class="add-btn" onclick="addProofItem()">+</button><div class="s-proof-num" contenteditable>${n}</div><div class="s-proof-lbl" contenteditable>${l}</div></div>`).join('')}
  </div>`,
  feat:()=>`<div class="sec-wrap s-feat">
    <div class="sec-lbl" contenteditable>Feature</div>
    <div class="s-feat-grid">
    ${[['🌿','특징 1 제목','상품의 핵심 특징을 입력하세요.'],['💪','특징 2 제목','소재, 내구성, 착용감 등을 강조합니다.'],['✂️','특징 3 제목','디자인, 핏, 실루엣 등을 설명합니다.'],['🌊','특징 4 제목','관리 편의성, 실용성을 강조합니다.'],['🎯','특징 5 제목','계절성, 활용도를 설명합니다.'],['🔄','특징 6 제목','품질 인증 등 신뢰 내용을 담습니다.']].map(([ico,nm,desc])=>`<div class="s-feat-item" style="position:relative"><button class="del-btn" onclick="delItem('s-feat-item',this)">✕</button><button class="add-btn" onclick="addFeatItem()">+</button><div class="s-feat-ico-wrap"><div class="s-feat-ico icon-editable" onclick="openEP(this,event)">${ico}</div><button class="s-feat-ico-del" onclick="event.stopPropagation();this.previousElementSibling.textContent=''" title="아이콘 삭제">✕</button></div><div class="s-feat-name" contenteditable>${nm}</div><div class="s-feat-desc" contenteditable>${desc}</div>${izNew('특징 이미지','860 × 960px',437)}</div>`).join('')}
    </div>
    <div class="s-feat-img-rows" id="feat-img-rows">
      <!-- 이미지 행 동적 추가 -->
    </div>
    <div class="feat-add-img-row" id="feat-add-row-btn" title="이미지 행 추가">
      + 이미지 슬롯 행 추가
    </div>
  </div>`,
  compare:()=>`<div class="sec-wrap s-compare">
    <div><div class="sec-en" contenteditable>The Difference You Feel</div><div class="sec-kr" contenteditable>직접 비교해보세요</div></div>
    <div class="s-cmp-wrap">
      <div class="s-cmp-col" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-col',this)">✕</button>${izNew('일반 소재','430 × 560px',500)}<div class="s-cmp-badge b" contenteditable>일반 제품</div></div>
      <div class="s-cmp-col" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-col',this)">✕</button>${izNew('본 제품 소재','430 × 560px',500)}<div class="s-cmp-badge a" contenteditable>본 제품</div></div>
      <div class="s-cmp-vs">VS</div>
    </div>
    <div class="s-cmp-desc">
      <div class="s-cmp-desc-item" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-desc-item',this)">✕</button><div class="s-cmp-desc-name" contenteditable>일반 제품</div><div class="s-cmp-desc-txt" contenteditable>비교 대상 제품 설명을 입력하세요.</div></div>
      <div class="s-cmp-desc-item" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-desc-item',this)">✕</button><div class="s-cmp-desc-name" contenteditable>본 제품</div><div class="s-cmp-desc-txt" contenteditable>본 제품의 우수한 점을 설명하세요.</div></div>
    </div>
    <div class="feat-row-add-wrap">
      <button class="feat-row-add-btn" onclick="addFeatItem();addFeatItem()">＋ 행 추가 (2개)</button>
    </div>
  </div>`,
  wearing:()=>`<div class="sec-wrap s-wearing">
    <div class="s-wearing-lbl"><div class="s-wearing-en" contenteditable>Wearing Shot</div><div class="s-wearing-kr" contenteditable>착용컷</div></div>
    ${izNew('메인 착용 풀컷','860 × 960px',546)}
  </div>`,
  duo:()=>`<div class="sec-wrap s-duo">
    ${izNew('착용컷 1','50% × 680px',400)}
    ${izNew('착용컷 2','50% × 680px',400)}
  </div>`,
  angle:()=>`<div class="sec-wrap s-angle">
    <div class="sec-hd-wrap"><div class="sec-en" contenteditable>360° View</div><div class="sec-kr" contenteditable>앞면 · 뒷면 · 측면 · 디테일</div></div>
    <div class="s-angle-grid">
    ${[['전면 (Front)','Front','앞면'],['후면 (Back)','Back','뒷면'],['측면 (Side)','Side','측면'],['디테일','Detail','디테일']].map(([lbl,en,kr])=>`<div class="s-angle-cell" style="position:relative"><button class="del-btn" onclick="delItem('s-angle-cell',this)">✕</button>${izNew(lbl,'430 × 520px',260)}<div class="s-angle-label"><div class="s-angle-label-en" contenteditable>${en}</div><div class="s-angle-label-kr" contenteditable>${kr}</div></div></div>`).join('')}
    </div>
  </div>`,
  mood:()=>`<div class="sec-wrap s-mood">
    <div class="s-mood-hd" style="padding:48px 40px 0 40px;"><div class="sec-en" contenteditable>Wear it everywhere.</div><div class="sec-kr" contenteditable>어디서든, 어떤 날에도</div></div>
    <div class="s-mood-main">
      ${izNew('메인 무드컷','860 × 720px',430)}

    </div>
    <div class="s-mood3">
    ${[['Casual','데일리'],['Work','출근'],['Weekend','주말']].map(([s,t])=>`<div class="s-mood3-card" style="position:relative"><button class="del-btn" onclick="delItem('s-mood3-card',this)">✕</button><button class="add-btn" onclick="addMood3Card()">+</button>${izNew('무드컷','287 × 440px',390)}<div class="s-mood3-ov"></div><div class="s-mood3-copy"><div class="s-mood3-sit" contenteditable>${s}</div><div class="s-mood3-title" contenteditable>${t}</div></div></div>`).join('')}
    </div>
  </div>`,
  infl:()=>`<div class="sec-wrap s-infl">
    <div><div class="sec-en" contenteditable>As seen on Influencers</div><div class="sec-kr" contenteditable>인플루언서 착용컷</div></div>
    <div class="s-infl-grid-top">
      <div class="s-infl-card" style="flex:1.5;position:relative"><button class="del-btn" onclick="delItem('s-infl-card',this)">✕</button>${izNew('대표 인플루언서','516 × 560px',500)}<div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer_main</div><div class="s-infl-tag" contenteditable>팔로워 12.4만 · 패션 크리에이터</div></div></div>
      <div class="s-infl-card" style="flex:1;position:relative"><button class="del-btn" onclick="delItem('s-infl-card',this)">✕</button>${izNew('인플루언서 2','344 × 560px',500)}<div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer_2</div><div class="s-infl-tag" contenteditable>팔로워 8.7만 · 라이프스타일</div></div></div>
    </div>
    <div class="s-infl-grid-bot" style="display:flex;gap:4px;margin-top:4px;">
    ${[['a','오오티디'],['b','데일리룩'],['c','미니멀']].map(([s,t])=>`<div class="s-infl-card" style="flex:1;position:relative"><button class="del-btn" onclick="delItem('s-infl-card',this)">\u2715</button>${izNew('서브 '+s,'287 × 340px',300)}<div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer_${s}</div><div class="s-infl-tag" contenteditable>#${t}</div></div></div>`).join('')}
    </div>

  </div>`,
  story:()=>`<div class="sec-wrap s-story">
    <div class="s-story-main">
      <div class="s-story-img">${izNew('소재 메인 이미지','516 × 640px',570)}</div>
      <div class="s-story-txt">
        <div class="s-story-label" contenteditable>Material Story</div>
        <div class="s-story-title" contenteditable>소재 하나에도<br>타협하지 않습니다</div>
        <div class="s-story-body" contenteditable>소재와 제작 과정에 대한 브랜드의 철학과 스토리를 입력하세요. 어디서 소재를 조달하는지, 어떤 공정을 거치는지, 왜 이 소재를 선택했는지 등 진정성 있는 이야기가 고객의 신뢰를 얻습니다.</div>
        <div class="s-story-divider"></div>
        <div class="s-story-spec" contenteditable>소재 · 내용을 입력하세요<br>원산지 · 내용을 입력하세요<br>인증 · 내용을 입력하세요</div>
      </div>
    </div>
    <div class="s-story-sub">
      ${izNew('소재 서브 1','430 × 440px',390)}
      ${izNew('소재 서브 2','430 × 440px',390)}
    </div>
  </div>`,
  style:()=>`<div class="sec-wrap s-style">
    <div><div class="sec-en" contenteditable>Styling Guide</div><div class="sec-kr" contenteditable>이렇게 매치하세요</div></div>
    <div class="s-style-grid">
    ${[['Daily Casual','데일리'],['Smart Casual','스마트'],['Feminine','페미닌']].map(([m,t])=>`<div class="s-style-card" style="position:relative"><button class="del-btn" onclick="delItem('s-style-card',this)">✕</button><button class="add-btn" onclick="addStyleCard()">+</button>${izNew('스타일링','267 × 400px',360)}<div class="s-style-body"><div class="s-style-mood" contenteditable>${m}</div><div class="s-style-title" contenteditable>${t}</div><div class="s-style-items" contenteditable>아이템 1 + 아이템 2</div></div></div>`).join('')}
    </div>
  </div>`,
  pkg:()=>`<div class="sec-wrap s-pkg">
    <div class="s-pkg-grid">
      <div class="s-pkg-img">${izNew('패키지 이미지','430 × 420px',375)}</div>
      <div class="s-pkg-txt">
        <div class="s-pkg-label" contenteditable>Packaging &amp; Delivery</div>
        <div class="s-pkg-title" contenteditable>받는 순간부터<br>특별한 경험</div>
        <ul class="s-pkg-list">
          ${['친환경 박스 포장','오후 2시 이전 주문 시 당일 출고','전국 1~2일 내 수령','5만 원 이상 무료배송','수령 후 14일 이내 무료 교환·반품'].map(t=>`<li contenteditable>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>`,
  size:()=>{
  return '<div class="sec-wrap s-size">'
    +'<div class="s-size-title" contenteditable>Size Guide</div>'
    +'<div class="s-size-ctrl">'
    +'<span class="s-size-ctrl-lbl">프리셋:</span>'
    
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'의류\')">의류</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'가방\')">가방</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'신발\')">신발</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'양말\')">양말</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'모자\')">모자</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'바지\')">바지</button>'
    +'<span class="s-size-ctrl-sep"></span>'
    +'<button class="size-ctrl-btn" onclick="sizeAddRow(this.closest(\'.s-size\'))">+ 행</button>'
    +'<button class="size-ctrl-btn" onclick="sizeDelRow(this.closest(\'.s-size\'))">− 행</button>'
    +'<button class="size-ctrl-btn" onclick="sizeAddCol(this.closest(\'.s-size\'))">+ 열</button>'
    +'<button class="size-ctrl-btn" onclick="sizeDelCol(this.closest(\'.s-size\'))">− 열</button>'
    +'</div>'
    +'<div class="s-size-wrap"><div class="s-size-img">'+izNew('핏 가이드 이미지','430 × 560px',500)+'</div>'
    +'<div><table class="s-size-tbl"><thead><tr>'
    +['Size','총장','가슴','어깨','소매'].map(function(h){return '<th contenteditable>'+h+'</th>';}).join('')
    +'</tr></thead><tbody>'
    +['XS','S','M','L','XL'].map(function(s,i){
      return '<tr'+(i===2?' class="highlight"':'')+'>'
        +[s,'—','—','—','—'].map(function(v){return '<td contenteditable>'+v+'</td>';}).join('')+'</tr>';
    }).join('')
    +'</tbody></table>'
    +'<div class="s-model-info"><div class="s-model-info-title">Model Size</div>'
    +'<div class="s-model-info-body" contenteditable>168cm · 52kg · M 사이즈 착용</div></div>'
    +'<div class="s-size-note" contenteditable>※ 단위: cm / 측정 방법에 따라 1~2cm 오차가 발생할 수 있습니다.</div>'
    +'</div></div></div>';
},
  info:()=>`<div class="sec-wrap s-info">
    <div class="s-info-title" contenteditable>Information</div>
    <table class="s-info-tbl">
      <tr><td class="s-info-key" contenteditable>Season</td><td><div class="ck-group"><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Spring/Autumn</span></div><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Summer</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Winter</span></div></div></td></tr>
      <tr><td class="s-info-key" contenteditable>Fit</td><td><div class="ck-group"><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Slim</span></div><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Regular</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Oversize</span></div></div></td></tr>
      <tr><td class="s-info-key" contenteditable>Thickness</td><td><div class="ck-group"><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Thin</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Regular</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Heavy</span></div></div></td></tr>
      <tr><td class="s-info-key" contenteditable>Fabric</td><td class="s-info-val" contenteditable>소재를 입력하세요</td></tr>
      <tr><td class="s-info-key" contenteditable>Color</td><td class="s-info-val" contenteditable>컬러를 입력하세요</td></tr>
      <tr><td class="s-info-key" contenteditable>Size</td><td class="s-info-val" contenteditable>XS / S / M / L / XL</td></tr>
      <tr><td class="s-info-key" contenteditable>Origin</td><td class="s-info-val" contenteditable>Korea</td></tr>
    </table>
  </div>`,
  wash:()=>`<div class="sec-wrap s-wash">
    <div class="s-wash-title" contenteditable>Washing &amp; Care</div>
    <div class="s-wash-icons">${['🌊','🚫','🌿','🌡️','❌'].map(ic=>`<div class="s-wash-ico icon-editable" onclick="openEP(this,event)">${ic}</div>`).join('')}</div>
    <div class="s-wash-note" contenteditable>1. 세탁 방법 주의사항을 입력해주세요.<br>2. 세탁 방법 주의사항을 입력해주세요.<br>3. 세탁 방법 주의사항을 입력해주세요.</div>
  </div>`,
  faq:()=>`<div class="sec-wrap s-faq">
    <div><div class="sec-en" contenteditable>FAQ</div><div class="sec-kr" contenteditable>자주 묻는 질문</div></div>
    ${[['Q. 사이즈가 작게 나오나요?','일반적인 한국 의류 기준 사이즈입니다. 너무 헐렁하거나 타이트하지 않은 레귤러 핏으로 기획하였으므로 평소 사이즈를 선택하시면 됩니다.'],['Q. 배송은 얼마나 걸리나요?','오후 2시 이전 결제 시 당일 출고되며, 전국 1~2일 내 수령 가능합니다.'],['Q. 교환·반품이 가능한가요?','수령 후 14일 이내 교환·반품 신청이 가능합니다.']].map(([q,a])=>`<div class="s-faq-item" style="position:relative"><button class="del-btn" onclick="delItem('s-faq-item',this)">✕</button><button class="add-btn" onclick="addFaqItem()">+</button><div class="s-faq-q" onclick="this.parentElement.classList.toggle('open')"><span class="s-faq-q-txt" contenteditable>${q}</span><span class="s-faq-arr">▼</span></div><div class="s-faq-a" contenteditable>${a}</div></div>`).join('')}
  </div>`,
  pd:()=>`<div class="sec-wrap s-pd">
    <div class="s-pd-hd"><div class="s-pd-hd-title" contenteditable>Product Detail</div></div>
    <div class="s-pd-full">${izNew('디테일 클로즈업 1','860 × 840px',300)}</div>
    <div class="s-pd-2col">${izNew('디테일 2','430 × 700px',250)}${izNew('디테일 3','430 × 700px',250)}</div>
    <div class="s-pd-3col">${izNew('디테일 4','287 × 500px',300)}${izNew('디테일 5','287 × 500px',300)}${izNew('디테일 6','287 × 500px',300)}</div>
  </div>`,
  img_only:()=>`<div class="sec-wrap s-img-only">${izNew('이미지','860 × auto',360)}</div>`,
  footer:()=>`<div class="sec-wrap s-footer">
    ${['모니터 해상도 또는 모바일 환경에 따라 실제 제품 색상과 다소 차이가 있을 수 있습니다.','사이즈 측정 방법에 따라 1~2cm 오차가 발생할 수 있습니다.','상품 수령 후 14일 이내 교환·반품 신청이 가능합니다.','불량·오배송의 경우 전액 환불 또는 교환 처리해 드립니다.'].map(t=>`<p contenteditable>${t}</p>`).join('')}
  </div>`,
};
const SEC_META = {
  banner:{label:'컬렉션 배너',icon:'ti-tag'},
  hero:{label:'히어로 이미지',icon:'ti-home'},
  trust:{label:'구매 안심 배지',icon:'ti-shield-check'},
  copy:{label:'감성 카피',icon:'ti-quote'},
  proof:{label:'소셜 증명',icon:'ti-chart-bar'},
  feat:{label:'기능 그리드',icon:'ti-list'},
  compare:{label:'소재 비교',icon:'ti-scale'},
  wearing:{label:'착용 풀컷',icon:'ti-shirt'},
  duo:{label:'2단 이미지',icon:'ti-layout-columns'},
  angle:{label:'다각도 뷰',icon:'ti-rotate-360'},
  mood:{label:'무드컷',icon:'ti-photo'},
  infl:{label:'인플루언서',icon:'ti-users'},
  story:{label:'브랜드 스토리',icon:'ti-book'},
  style:{label:'스타일링 가이드',icon:'ti-hanger'},
  pkg:{label:'패키지·배송',icon:'ti-package'},
  size:{label:'사이즈 가이드',icon:'ti-ruler'},
  info:{label:'상품 정보표',icon:'ti-info-circle'},
  wash:{label:'세탁 방법',icon:'ti-wash'},
  faq:{label:'FAQ',icon:'ti-help-circle'},
  pd:{label:'제품 디테일',icon:'ti-zoom-in'},
  img_only:{label:'이미지만',icon:'ti-photo-scan'},
  footer:{label:'유의사항 푸터',icon:'ti-file-text'},
};

// 전역 상태 (var - 중복 선언 허용)
var _uid=0,_jpgScale=1,_ftEl=null,_epEl=null,_aiResult=null,_slotBusy=false;
var BG_COLORS=['#ffffff','#0c0c0c','#f8f8f8','#f5f5f5','#f9f9f9','#1a1a2e','#16213e','#0f3460','#1a2e1a','#2d1b1b','#e8f5e9','#fff3e0','#fce4ec','#e3f2fd','#f3e5f5','#e8eaf6','#fff8e1','#e0f7fa','#f9fbe7','#fbe9e7','#111111','#222222','#333333','#555555','#888888','#fffef0','#fff9f0','#f0fff4','#f0f4ff','#fff0f0'];

// 유틸
function nextId(){return 'sec_'+(++_uid);}
function showHint(msg){var h=document.getElementById('hint');h.textContent=msg;h.style.opacity='1';clearTimeout(h._t);h._t=setTimeout(function(){h.style.opacity='0';},2500);}
function setW(w,btn){document.getElementById('preview').style.width=w+'px';document.querySelectorAll('.wb-btn').forEach(function(b){b.classList.remove('act');});if(btn)btn.classList.add('act');}
function switchTab(t){document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.toggle('act',b.dataset.tab===t);});document.querySelectorAll('.tab-pane').forEach(function(p){p.classList.toggle('act',p.id==='tab-'+t);});}
function applyFont(v){var pv=document.getElementById('preview');if(pv){pv.style.fontFamily=v;pv.style.setProperty('--pf',v);}}
function openAddModal(){var m=document.getElementById('add-modal');if(m)m.classList.add('show');}
function closeAddModal(){var m=document.getElementById('add-modal');if(m)m.classList.remove('show');}
function setJpgScale(s,btn){_jpgScale=s+1;document.querySelectorAll('#jpg-1x,#jpg-2x').forEach(function(b){b.classList.remove('act');});if(btn)btn.classList.add('act');}
const TF={active:null,drag:null};

function pv(input){
  if(!input.files||!input.files[0])return;
  var zone=input.closest?input.closest('.iz'):input.parentElement;
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>initTF(zone,img.src,img.naturalWidth,img.naturalHeight);
    img.src=e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function initTF(zone,src,nW,nH){
  zone.querySelector('.tf-wrap')?.remove();
  zone.querySelector('.iz-del')?.remove();
  // 이미지 업로드 후 iz 파란 점선 테두리/배경 제거
  zone.style.border='none';
  zone.style.background='transparent';
  zone.classList.add('has-image');
  // Remove upload overlay so image shows
  zone.querySelectorAll('.iz-ov').forEach(o=>o.style.display='none');
  const zW=zone.offsetWidth||860;
  const zH=Math.max(zone.offsetHeight||0,zone.style.height?parseInt(zone.style.height):0)||400;
  const ratio=nW/nH;
  let w,h;
  if(nW/zW>nH/zH){w=zW;h=w/ratio;}
  else{h=zH;w=h*ratio;}
  let x=(zW-w)/2,y=(zH-h)/2;
  const wrap=document.createElement('div');
  wrap.className='tf-wrap';
  wrap.dataset.ratio=ratio;
  tfSetPos(wrap,x,y,w,h);
  const imgEl=document.createElement('img');
  imgEl.className='pv';
  imgEl.src=src;
  imgEl.setAttribute('draggable','false');
  wrap.appendChild(imgEl);
  const border=document.createElement('div');
  border.className='tf-border';
  wrap.appendChild(border);
  ['tl','tc','tr','ml','mr','bl','bc','br'].forEach(id=>{
    const h2=document.createElement('div');
    h2.className=`tf-handle tf-${id}`;
    h2.dataset.h=id;
    wrap.appendChild(h2);
  });
  const dim=document.createElement('div');
  dim.className='tf-dim';
  wrap.appendChild(dim);
  const badge=document.createElement('div');
  badge.className='tf-lock-badge';
  badge.textContent='⇧ Shift = 자유변형';
  wrap.appendChild(badge);
  // Hide placeholder
  const inner=zone.querySelector('.iz-in');
  if(inner)inner.style.display='none';
  // Add delete button
  const del=document.createElement('button');
  del.className='iz-del';
  del.innerHTML='🗑';
  del.onclick=e=>{e.stopPropagation();if(confirm('이미지를 삭제할까요?')){wrap.remove();del.remove();if(inner)inner.style.display='';zone.querySelectorAll('.iz-ov').forEach(o=>o.style.display='');const fi2=zone.querySelector('input[type=file]');if(fi2){fi2.style.pointerEvents='';fi2.style.opacity='0';}}};
  zone.appendChild(del);
  zone.appendChild(wrap);
  tfSelect(wrap,zone);
  bindTF(wrap,zone);
  // 이미지 업로드 후 input은 z-index만 조정 (클릭 이벤트 방지)
  const fileInput=zone.querySelector('input[type=file]');
  if(fileInput){fileInput.style.pointerEvents='none';fileInput.style.opacity='0';}
  showHint('↔ 드래그: 이동 · 핸들: 크기 조절 · Shift: 비율 자유변형 · Esc: 확정');
}

function tfSetPos(wrap,x,y,w,h){
  w=Math.max(20,w);h=Math.max(20,h);
  wrap.style.left=x+'px';wrap.style.top=y+'px';
  wrap.style.width=w+'px';wrap.style.height=h+'px';
  const dim=wrap.querySelector('.tf-dim');
  if(dim)dim.textContent=`${Math.round(w)} × ${Math.round(h)} px`;
}
function tfSelect(wrap,zone){
  document.querySelectorAll('.tf-wrap.tf-sel').forEach(w=>w.classList.remove('tf-sel'));
  wrap.classList.add('tf-sel');
  TF.active={wrap,zone};
}
function tfDeselect(){
  document.querySelectorAll('.tf-wrap.tf-sel').forEach(w=>w.classList.remove('tf-sel'));
  TF.active=null;TF.drag=null;
}
function izClickOpen(iz,e){
  if(iz.querySelector('.tf-wrap'))return;
  if(e.target.closest('button')||e.target.closest('label'))return;
  var tmp=document.createElement('input');
  tmp.type='file';tmp.accept='image/*';
  tmp.style.cssText='position:fixed;top:-9999px;left:-9999px;';
  tmp.onchange=function(){
    if(!tmp.files||!tmp.files[0]){document.body.removeChild(tmp);return;}
    var reader=new FileReader();
    reader.onload=function(ev){
      var img=new Image();
      img.onload=function(){initTF(iz,img.src,img.naturalWidth,img.naturalHeight);};
      img.src=ev.target.result;
    };
    reader.readAsDataURL(tmp.files[0]);
    setTimeout(function(){if(tmp.parentNode)document.body.removeChild(tmp);},1000);
  };
  document.body.appendChild(tmp);tmp.click();
}
function bindTF(wrap,zone){
  wrap.addEventListener('mousedown',e=>{
    e.preventDefault();e.stopPropagation();
    tfSelect(wrap,zone);
    const handle=e.target.dataset.h||null;
    TF.drag={wrap,zone,type:handle?'resize':'move',handle,
      sx:e.clientX,sy:e.clientY,
      ox:parseInt(wrap.style.left),oy:parseInt(wrap.style.top),
      ow:parseInt(wrap.style.width),oh:parseInt(wrap.style.height),
      ratio:parseFloat(wrap.dataset.ratio)};
  });
  wrap.addEventListener('dblclick',e=>{e.stopPropagation();tfDeselect();});
  zone.addEventListener('mousedown',e=>{
    if(!e.target.closest('.tf-wrap'))tfDeselect();
  });
  wrap.addEventListener('touchstart',e=>{
    const t=e.touches[0];
    wrap.dispatchEvent(new MouseEvent('mousedown',{clientX:t.clientX,clientY:t.clientY,bubbles:true}));
  },{passive:false});
}
document.addEventListener('mousemove',e=>{
  if(!TF.drag)return;
  const{wrap,type,handle,sx,sy,ox,oy,ow,oh,ratio}=TF.drag;
  const dx=e.clientX-sx,dy=e.clientY-sy;
  const lock=!e.shiftKey;
  if(type==='move'){tfSetPos(wrap,ox+dx,oy+dy,ow,oh);return;}
  let nx=ox,ny=oy,nw=ow,nh=oh;
  switch(handle){
    case'br':nw=Math.max(20,ow+dx);nh=lock?nw/ratio:Math.max(20,oh+dy);break;
    case'bl':nw=Math.max(20,ow-dx);nx=ox+ow-nw;nh=lock?nw/ratio:Math.max(20,oh+dy);break;
    case'tr':nw=Math.max(20,ow+dx);if(lock){nh=nw/ratio;ny=oy+oh-nh;}else{nh=Math.max(20,oh-dy);ny=oy+oh-nh;}break;
    case'tl':nw=Math.max(20,ow-dx);nx=ox+ow-nw;if(lock){nh=nw/ratio;ny=oy+oh-nh;}else{nh=Math.max(20,oh-dy);ny=oy+oh-nh;}break;
    case'mr':nw=Math.max(20,ow+dx);if(lock){nh=nw/ratio;ny=oy+(oh-nh)/2;}break;
    case'ml':nw=Math.max(20,ow-dx);nx=ox+ow-nw;if(lock){nh=nw/ratio;ny=oy+(oh-nh)/2;}break;
    case'bc':nh=Math.max(20,oh+dy);if(lock){nw=nh*ratio;nx=ox+(ow-nw)/2;}break;
    case'tc':nh=Math.max(20,oh-dy);ny=oy+oh-nh;if(lock){nw=nh*ratio;nx=ox+(ow-nw)/2;}break;
  }
  tfSetPos(wrap,nx,ny,nw,nh);
});
document.addEventListener('mouseup',()=>{TF.drag=null;});
document.addEventListener('touchmove',e=>{
  if(!TF.drag)return;
  const t=e.touches[0];
  document.dispatchEvent(new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY}));
},{passive:false});
document.addEventListener('touchend',()=>{TF.drag=null;});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){tfDeselect();closeFT();closeEP();}
});
/* IZ resize bar */
function addBar(iz){
  // flex/grid 레이아웃 안의 iz는 resize bar 추가 안 함 (레이아웃 깨짐 방지)
  var SKIP=['.s-duo','.s-angle-grid','.s-cmp-wrap','.s-cmp-desc',
    '.s-mood3','.s-story-sub','.s-style-grid',
    '.s-infl-grid-top','.s-infl-grid-bot',
    '.s-pd-2col','.s-pd-3col','.s-pkg-grid',
    '.s-size-wrap','.s-size-img'];
  for(var k=0;k<SKIP.length;k++){if(iz.closest(SKIP[k]))return;}
  if(iz.querySelector('.resize-bar'))return;
  var bar=document.createElement('div');
  bar.className='resize-bar';
  bar.textContent='⠿';
  var st=false,sh=0,sy=0;
  bar.addEventListener('mousedown',function(ev){
    ev.preventDefault();st=true;sh=iz.offsetHeight;sy=ev.clientY;
    var mm=function(e){if(!st)return;iz.style.height=Math.max(60,sh+(e.clientY-sy))+'px';};
    var mu=function(){st=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);};
    document.addEventListener('mousemove',mm);
    document.addEventListener('mouseup',mu);
  });
  iz.after(bar);
}
function initIzBars(){
  document.querySelectorAll('#preview .iz').forEach(iz=>{
    if(!iz.closest('.s-duo,.s-angle-grid,.s-infl-grid-top,.s-infl-grid-bot,.s-cmp-wrap,.s-mood3,.s-style-grid,.s-story-sub,.s-pd-2col,.s-pd-3col'))
      addBar(iz);
  });
}

/* IZ overlay: hover buttons inside iz */
function buildIzOverlay(iz){
  if(iz.querySelector('.iz-ov'))return;
  var ov=document.createElement('div');
  ov.className='iz-ov';

  // ─── 업로드 버튼 (body에 임시 input 생성 방식 - 가장 신뢰성 높음) ───
  var upBtn=document.createElement('button');
  upBtn.type='button';
  upBtn.className='iz-ov-btn blue';
  upBtn.textContent='📂 이미지 업로드';upBtn.title='클릭하여 이미지를 업로드합니다';
  upBtn.addEventListener('click',function(e){
    e.stopPropagation();
    e.preventDefault();
    // body에 임시 file input 생성 → 클릭 → 파일 선택 후 제거
    var tmp=document.createElement('input');
    tmp.type='file';
    tmp.accept='image/*';
    tmp.style.cssText='position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;';
    tmp.onchange=function(){
      if(!tmp.files||!tmp.files[0]){document.body.removeChild(tmp);return;}
      var reader=new FileReader();
      reader.onload=function(ev){
        var img=new Image();
        img.onload=function(){
          initTF(iz,img.src,img.naturalWidth,img.naturalHeight);
        };
        img.src=ev.target.result;
      };
      reader.readAsDataURL(tmp.files[0]);
      // 사용 완료 후 제거
      setTimeout(function(){if(tmp.parentNode)document.body.removeChild(tmp);},1000);
    };
    document.body.appendChild(tmp);
    tmp.click();
  });
  ov.appendChild(upBtn);

  // ─── 슬롯 추가 (단일 이미지 영역은 버튼 숨김) ───
  // 슬롯 추가를 허용하지 않는 부모 목록
  var NO_ADD=[];  // 모든 섹션 슬롯 추가 허용
  var canAdd=!NO_ADD.some(function(sel){return iz.closest(sel);});

  var addBtn=document.createElement('button');
  addBtn.className='iz-ov-btn green';
  addBtn.textContent='➕ 슬롯 추가';
  if(!canAdd){addBtn.style.display='none';}  // 단일 영역: 숨김
  addBtn.addEventListener('click',function(e){
    e.stopPropagation();
    // 즉시 삭제 (잠금 없음)

    var inflCard=iz.closest('.s-infl-card');
    if(inflCard){
      // 인플루언서 카드 → 카드 전체를 grid에 추가
      var grid=inflCard.closest('.s-infl-grid-bot')||inflCard.closest('.s-infl-grid-top');
      if(!grid){_slotBusy=false;return;}
      var newCard=document.createElement('div');
      newCard.className='s-infl-card';
      newCard.style.cssText='position:relative;';
      var delB=document.createElement('button');
      delB.className='del-btn';delB.textContent='\u2715';
      delB.onclick=function(){newCard.remove();};
      newCard.appendChild(delB);
      var newIz=document.createElement('div');
      newIz.className='iz';
      newIz.style.cssText='height:300px;border:none;background:#e8eaff;';
      newIz.innerHTML='<button class="iz-zone-del" onclick="event.stopPropagation();delSlot(this)">🗑</button><div class="iz-in"><div class="iz-ico">🖼</div><div class="iz-lbl">인플루언서</div><div class="iz-px">287 × 340px</div></div><input type="file" accept="image/*" onchange="pv(this)">';
      newIz.onclick=function(ev){izClickOpen(newIz,ev);};
      newCard.appendChild(newIz);
      var inflOv=document.createElement('div');inflOv.className='s-infl-ov';newCard.appendChild(inflOv);
      var inflCopy=document.createElement('div');inflCopy.className='s-infl-copy';
      inflCopy.innerHTML='<div class="s-infl-handle" contenteditable>@influencer</div><div class="s-infl-tag" contenteditable>#태그</div>';
      newCard.appendChild(inflCopy);
      grid.insertBefore(newCard, inflCard.nextSibling); // 클릭 위치 다음
      buildIzOverlay(newIz);
      showHint('✅ 인플루언서 카드 추가됨');
    } else {
      // ─ 복합 셀 컨텍스트 감지 (angle-cell, style-card, mood3-card 등) ─
      var featItem=iz.closest('.s-feat-item');
      var angleCell=iz.closest('.s-angle-cell');
      var styleCard=iz.closest('.s-style-card');
      var mood3Card=iz.closest('.s-mood3-card');

      if(featItem){
        // feat 아이템 → 그리드에 새 아이템 추가 (오른쪽 빈 공간 채우기)
        if(typeof addFeatItem==='function')addFeatItem();
        return;
      } else if(angleCell){
        // 다각도: 새 angle-cell 전체를 grid에 추가
        try{addAngleSlot();}catch(e){showHint('❌ 각도 슬롯 추가 오류');}
        _slotBusy=false;return;
      } else if(styleCard){
        try{addStyleCard();}catch(e){showHint('❌ 스타일 슬롯 추가 오류');}
        _slotBusy=false;return;
      } else if(mood3Card){
        try{addMood3Card();}catch(e){showHint('❌ 무드 슬롯 추가 오류');}
        _slotBusy=false;return;
      }

      // 일반 iz 슬롯 추가
      var parent=iz.parentElement;
      var h2=iz.offsetHeight||parseInt(iz.style.height)||300;

      // 컨테이너 분류
      // 1) 다열 Grid 섹션: 옆으로 배치
      var GRID_COLS={'s-duo':2,'s-pd-2col':2,'s-pd-3col':3,'s-story-sub':2,'s-infl-grid-bot':3,'s-angle-grid':2,'s-mood3':3,'s-style-grid':3};
      var cols=0;
      for(var cls in GRID_COLS){if(parent.classList.contains(cls)){cols=GRID_COLS[cls];break;}}

      // 2) 단일 전체폭 섹션: 세로로만 추가
      var VERT=['s-hero','s-wearing','s-img-only','s-pd-full','s-pd-full2','s-mood-main','s-story-img','s-pkg-img','s-size-img','s-cmp-col'];
      var isVert=VERT.some(function(v){return parent.classList.contains(v);});

      var newIz2=document.createElement('div');
      newIz2.className='iz';
      newIz2.onclick=function(ev){izClickOpen(newIz2,ev);};
      newIz2.innerHTML='<button class="iz-zone-del" onclick="event.stopPropagation();delSlot(this)">🗑</button><div class="iz-in"><div class="iz-ico">🖼</div><div class="iz-lbl">이미지</div><div class="iz-px">—</div></div><input type="file" accept="image/*" onchange="pv(this)">';

      if(isVert){
        // 전체폭 세로 쌓기
        parent.style.display='block';
        newIz2.style.cssText='height:'+h2+'px;width:100%;display:block;margin-top:3px;';
      } else if(cols>0){
        // 명시적 그리드 섹션 (이미 CSS로 적용됨)
        newIz2.style.height=h2+'px';
        parent.style.display='grid';
        parent.style.gridTemplateColumns='repeat('+cols+',1fr)';
        parent.style.gap='3px';
      } else {
        // 기타: 현재 컬럼 수 유지 (기존 슬롯과 같은 열 수로)
        var existingCount=parent.querySelectorAll(':scope>.iz').length||1;
        parent.style.display='grid';
        parent.style.gridTemplateColumns='repeat('+existingCount+',1fr)';
        parent.style.gap='3px';
        newIz2.style.height=h2+'px';
      }
      parent.insertBefore(newIz2, iz.nextSibling);
      buildIzOverlay(newIz2);
      addBar(newIz2);
      showHint('✅ 슬롯 추가됨');
    }
  });
  ov.appendChild(addBtn);

  // ─── 슬롯 삭제 (전역 잠금, 컨텍스트 인식) ───
  var delBtn=document.createElement('button');
  delBtn.className='iz-ov-btn red';
  delBtn.textContent='✕ 슬롯 삭제';
  delBtn.addEventListener('click',function(e){
    e.stopPropagation();
    if(_slotBusy)return;
    _slotBusy=true;
    setTimeout(function(){_slotBusy=false;},300);
    var inflCard2=iz.closest('.s-infl-card');
    var angleCell2=iz.closest('.s-angle-cell');
    var styleCard2=iz.closest('.s-style-card');
    var mood3Card2=iz.closest('.s-mood3-card');
    var featItem2=iz.closest('.s-feat-item');

    if(inflCard2){inflCard2.remove();showHint('🗑 카드 삭제됨');}
    else if(angleCell2){angleCell2.remove();showHint('🗑 각도 슬롯 삭제됨');}
    else if(styleCard2){styleCard2.remove();showHint('🗑 스타일 카드 삭제됨');}
    else if(mood3Card2){mood3Card2.remove();showHint('🗑 무드 카드 삭제됨');}
    else if(featItem2){featItem2.remove();showHint('🗑 특징 항목 삭제됨');}
    else {
      var nextEl=iz.nextElementSibling;
      if(nextEl&&nextEl.classList.contains('resize-bar'))nextEl.remove();
      iz.remove();
      showHint('🗑 슬롯 삭제됨');
    }
  });
  ov.appendChild(delBtn);

  iz.appendChild(ov);
}

function izAddSlot(btn){
  const iz=btn.closest('.iz');
  const parent=iz.parentElement;
  const newIz=iz.cloneNode(true);
  // Reset new iz
  newIz.querySelectorAll('.tf-wrap,.iz-del,.iz-ov').forEach(e=>e.remove());
  newIz.querySelector('.iz-in').style.display='';
  newIz.querySelector('input[type=file]').style.display='';
  newIz.querySelector('input[type=file]').value='';
  buildIzOverlay(newIz);
  parent.insertBefore(newIz,iz.nextSibling);
  showHint('✅ 이미지 슬롯 추가됨');
}
function izDelSlot(btn){
  const iz=btn.closest('.iz');
  const parent=iz.parentElement;
  const siblings=parent.querySelectorAll('.iz');
  
  iz.nextSibling?.remove?.(); // remove resize bar
  iz.remove();
  showHint('🗑 슬롯 삭제됨');
}
function initIzOverlays(){
  document.querySelectorAll('#preview .iz').forEach(iz=>buildIzOverlay(iz));
}

/* ══════════════════════════════════════════════════════════
   FLOATING TEXT TOOLBAR
══════════════════════════════════════════════════════════ */
function showFT(el){
  if(!el)return;
  // 모든 기존 하이라이트 제거
  document.querySelectorAll('.ft-active').forEach(function(e){e.classList.remove('ft-active');});
  _ftEl=el;
  el.classList.add('ft-active');
  const ft=document.getElementById('ft');
  ft.style.display='flex';
  const r=el.getBoundingClientRect();
  // 요소 위 또는 아래에 표시 (화면 밖으로 나가지 않도록)
  const ftH=54,ftW=330;
  const top=r.top>ftH+8 ? r.top-ftH-4 : r.bottom+4;
  ft.style.top=Math.max(4,Math.min(top,window.innerHeight-ftH-4))+'px';
  ft.style.left=Math.max(4,Math.min(r.left,window.innerWidth-ftW-4))+'px';
  const cs=getComputedStyle(el);
  document.getElementById('ft-sz').textContent=Math.round(parseFloat(cs.fontSize))+'px';
  const c=rgbToHex(cs.color);
  document.getElementById('ft-color').value=c;
  document.getElementById('ft-color-hex').textContent=c;
}
function closeFT(){
  document.querySelectorAll('.ft-active').forEach(function(e){e.classList.remove('ft-active');});
  var tb=document.getElementById('ft');
  if(tb)tb.style.display='none';
  _ftEl=null;
}
function ftSize(d){
  if(!_ftEl)return;
  const n=Math.max(8,Math.min(120,parseFloat(getComputedStyle(_ftEl).fontSize)+d));
  _ftEl.style.fontSize=n+'px';
  document.getElementById('ft-sz').textContent=Math.round(n)+'px';
}
function ftToggle(prop,on,off){
  if(!_ftEl)return;
  const cs=getComputedStyle(_ftEl);
  const isOn=prop==='fontWeight'?parseFloat(cs[prop])>=600:cs[prop]===on;
  _ftEl.style[prop]=isOn?off:on;
  showFT(_ftEl);
}
function ftAlign(v){
  if(!_ftEl)return;
  _ftEl.style.textAlign=v;
}
function ftColor(v){
  if(!_ftEl)return;
  _ftEl.style.color=v;
  document.getElementById('ft-color-hex').textContent=v;
}
function rgbToHex(rgb){
  if(!rgb||rgb==='transparent')return'#000000';
  if(rgb.startsWith('#'))return rgb;
  const m=rgb.match(/\d+/g);
  if(!m||m.length<3)return'#000000';
  return'#'+m.slice(0,3).map(x=>parseInt(x).toString(16).padStart(2,'0')).join('');
}
// Bind showFT to all contenteditable focus events

// 툴바 클릭 시 contenteditable 포커스 유지 (핵심)
document.addEventListener('DOMContentLoaded',function(){
  var ft=document.getElementById('ft');
  if(ft){
    ft.addEventListener('mousedown',function(e){
      e.preventDefault(); // contenteditable 포커스 잃지 않게
    });
  }
});

// 현재 선택된 요소 하이라이트
var _ftPrevOutline='';
document.addEventListener('focusin',e=>{
  if(e.target.hasAttribute('contenteditable')&&e.target.isContentEditable)
    showFT(e.target);
});
document.addEventListener('focusout',function(e){
  if(e.target.hasAttribute('contenteditable')){
    setTimeout(function(){
      var ae=document.activeElement;
      var ft=document.getElementById('ft');
      // 다른 contenteditable로 이동 or ft 툴바 클릭 시 = 닫지 않음
      if(ft&&ft.contains(ae))return;
      if(ae&&ae.isContentEditable)return;
      closeFT();
    },200);
  }
});

/* ══════════════════════════════════════════════════════════
   EMOJI PICKER
══════════════════════════════════════════════════════════ */
const EP_CATS={
  '기능성·소재':['☀️','🛡️','💧','💦','💨','🌬️','🌀','❄️','🔥','🧊','🌡️','⚡','💪','🤸','🧘','🏃','🌿','🌱','♻️','🔬','🧪','⚗️','🏅','✅','⭐','🔆','🌞','🌊','🌈','💎'],
  '계절·날씨':['🌸','🌺','🌼','🌻','☀️','🌞','🌈','🌊','🍃','🍂','🍁','❄️','⛄','🌙','⭐','🌟','🌤️','🌧️','🌨️','🌬️','🔥','💧','🌿','🌱','🌴','🎋'],
  '패션·스타일':['👗','👕','👚','🧥','👟','👜','💍','🧣','🎽','👒','🧢','💄','🪡','🧵','🪢','👔'],
  '라이프스타일':['🏃','🧘','🏋️','🚴','⛷️','🏄','🎾','⛳','🏊','🧗','🎯','🎿','🏕️','🌄','🎭','🎨','🎵','📚','☕','🍵'],
  '기능·소재':['💪','🌱','♻️','🧪','⚗️','🔬','🛡','⚙️','🔧','🧬','💎','🪨','🌾','🍃','🦺','🔒'],
  '배송·서비스':['🚚','⚡','🔄','🇰🇷','💳','🎁','✅','📦','🏅','💯','🌟','⭐','📬','🛒','🎀','🏪'],
  '수치·지표':['📊','📈','🏆','🥇','🎯','💯','✨','💥','🔝','🆕','🆓','🆙','✔️','❤️','💙','💚'],
};

// 전역 상태
var _uid=0,_jpgScale=1,_ftEl=null,_epEl=null,_aiResult=null;
function addFeatItem(){
  var s=document.querySelector('.s-feat-grid');if(!s)return;
  var d=document.createElement('div');d.className='s-feat-item';d.style.position='relative';
  d.innerHTML='<button class="del-btn" onclick="delItem(\'s-feat-item\',this)">✕</button>'
    +'<button class="add-btn" onclick="addFeatItem()">+</button>'
    +'<div class="s-feat-ico-wrap">'
    +'<div class="s-feat-ico icon-editable" onclick="openEP(this,event)">✨</div>'
    +'<button class="s-feat-ico-del" onclick="event.stopPropagation();this.previousElementSibling.textContent=\'\'" title="아이콘 삭제">✕</button>'
    +'</div>'
    +'<div class="s-feat-name" contenteditable>특징 제목</div>'
    +'<div class="s-feat-desc" contenteditable>설명을 입력하세요.</div>'
    +izNew('특징 이미지','860 × 960px',437);
  s.appendChild(d);
  d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('✅ 특징 항목 추가됨');
}

function addFaqItem(){
  const s=document.querySelector('.s-faq');if(!s)return;
  const d=document.createElement('div');d.className='s-faq-item';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-faq-item',this)">✕</button><div class="s-faq-q" onclick="this.parentElement.classList.toggle('open')"><span class="s-faq-q-txt" contenteditable>새 질문</span><span class="s-faq-arr">▼</span></div><div class="s-faq-a" contenteditable>답변을 입력하세요.</div>`;
  s.appendChild(d);showHint('✅ FAQ 추가됨');
}
function addDuoSlot(){
  const s=document.querySelector('.s-duo');if(!s)return;
  const d=document.createElement('div');
  d.innerHTML=izNew('착용컷','430 × 680px',680);
  const iz=d.firstChild;
  buildIzOverlay(iz);
  s.appendChild(iz);
  addBar(iz);
  showHint('✅ 슬롯 추가됨');
}

/* Checkbox toggle */
document.addEventListener('click',e=>{
  const ck=e.target.closest('.ck');
  if(ck&&!e.target.closest('[contenteditable]'))ck.classList.toggle('on');
});
/* FAQ toggle */
document.addEventListener('click',e=>{
  const q=e.target.closest('.s-faq-q');
  if(q&&!e.target.closest('[contenteditable]'))q.parentElement.classList.toggle('open');
});

/* ══════════════════════════════════════════════════════════
   SECTION TEMPLATES
══════════════════════════════════════════════════════════ */
function delItem(cls,el){
  const item=el.closest('.'+cls);
  if(!item)return;
  item.remove();
}
function delSlot(btn){var iz=btn.closest?btn.closest('.iz'):btn.parentElement;if(!iz)return;clearIzImage(iz);}

/* IZ helpers for each section type */
function izNew(label,px,h=''){
  return `<div class="iz"${h?' style="height:'+h+'px"':''} onclick="izClickOpen(this,event)"><button class="iz-zone-del" onclick="event.stopPropagation();delSlot(this)">🗑</button><div class="iz-in"><div class="iz-ico">🖼</div><div class="iz-lbl">${label}</div><div class="iz-px">${px}</div></div><input type="file" accept="image/*" onchange="pv(this)"></div>`;
}
function addTrustItem(){
  const s=document.querySelector('.s-trust');if(!s)return;
  const d=document.createElement('div');d.className='s-trust-item';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-trust-item',this)">✕</button><button class="add-btn" onclick="addTrustItem()">+</button><button class="ico-btn" onclick="openEP(this.closest('.s-trust-item').querySelector('.icon-editable'),event)">🎨 아이콘</button><div class="s-trust-ico icon-editable" onclick="openEP(this,event)">⭐</div><div class="s-trust-name" contenteditable>항목 이름</div><div class="s-trust-desc" contenteditable>설명 입력</div>`;
  s.appendChild(d);showHint('✅ 배지 추가됨');
}
function addProofItem(){
  const s=document.querySelector('.s-proof');if(!s)return;
  const d=document.createElement('div');d.className='s-proof-item';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-proof-item',this)">✕</button><button class="add-btn" onclick="addProofItem()">+</button><div class="s-proof-num" contenteditable>0+</div><div class="s-proof-lbl" contenteditable>Label</div>`;
  s.appendChild(d);showHint('✅ 지표 추가됨');
}

function addInflSlot(){
  const s=document.querySelector('.s-infl-grid-bot');if(!s)return;
  const d=document.createElement('div');d.className='s-infl-card';d.style.position='relative';
  d.innerHTML=`<div class="iz" style="height:340px;border:none;background:#f0f4ff">${izNew('인플루언서','287 × 340px',340).replace('<div class="iz">','').replace('</div>','')}</div><div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer</div><div class="s-infl-tag" contenteditable>#태그</div></div>`;
  // Simpler: just add an iz card
  const card=document.createElement('div');card.className='s-infl-card';card.style.flex='1';
  card.innerHTML=`<div class="iz" style="height:340px;border:none;background:#f0f4ff"><button class="iz-zone-del" onclick="delSlot(this)">🗑</button><div class="iz-in"><div class="iz-ico">🖼</div><div class="iz-lbl">인플루언서</div><div class="iz-px">287 × 340px</div></div><input type="file" accept="image/*" onchange="pv(this)"></div><div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer</div><div class="s-infl-tag" contenteditable>#태그</div></div>`;
  s.appendChild(card);card.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('✅ 인플루언서 카드 추가됨');
}
function addAngleSlot(){
  const s=document.querySelector('.s-angle-grid');if(!s)return;
  const d=document.createElement('div');d.className='s-angle-cell';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-angle-cell',this)">✕</button>${izNew('각도 이미지','430 × 520px',260)}<div class="s-angle-label"><div class="s-angle-label-en" contenteditable>View</div><div class="s-angle-label-kr" contenteditable>각도</div></div>`;
  s.appendChild(d);d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('✅ 각도 슬롯 추가됨');
}
function addStyleCard(){
  const s=document.querySelector('.s-style-grid');if(!s)return;
  const d=document.createElement('div');d.className='s-style-card';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-style-card',this)">✕</button>${izNew('스타일링','267 × 400px',400)}<div class="s-style-body"><div class="s-style-mood" contenteditable>Style</div><div class="s-style-title" contenteditable>스타일 제목</div><div class="s-style-items" contenteditable>아이템 1<br>아이템 2</div></div>`;
  s.appendChild(d);d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('✅ 스타일 카드 추가됨');
}
function addMood3Card(){
  const s=document.querySelector('.s-mood3');if(!s)return;
  const d=document.createElement('div');d.className='s-mood3-card';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-mood3-card',this)">✕</button><div class="iz" style="height:440px;border:none;background:#f0f4ff"><button class="iz-zone-del" onclick="delSlot(this)">🗑</button><div class="iz-in"><div class="iz-ico">🖼</div><div class="iz-lbl">무드컷</div><div class="iz-px">287 × 440px</div></div><input type="file" accept="image/*" onchange="pv(this)"></div><div class="s-mood3-ov"></div><div class="s-mood3-copy"><div class="s-mood3-sit" contenteditable>Mood</div><div class="s-mood3-title" contenteditable>무드 제목</div></div>`;
  s.appendChild(d);d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('✅ 무드컷 추가됨');
}

/* Checkbox toggle */
document.addEventListener('click',e=>{
  const ck=e.target.closest('.ck');
  if(ck&&!e.target.closest('[contenteditable]'))ck.classList.toggle('on');
});
/* FAQ toggle */
document.addEventListener('click',e=>{
  const q=e.target.closest('.s-faq-q');
  if(q&&!e.target.closest('[contenteditable]'))q.parentElement.classList.toggle('open');
});

/* ══════════════════════════════════════════════════════════
   SECTION TEMPLATES
══════════════════════════════════════════════════════════ */
function openEP(el,e){
  if(e)e.stopPropagation();
  _epEl=el;
  const ep=document.getElementById('ep');
  ep.style.display='block';
  const r=el.getBoundingClientRect();
  ep.style.top=Math.min(r.bottom+4,window.innerHeight-340)+'px';
  ep.style.left=Math.max(4,Math.min(r.left,window.innerWidth-310))+'px';
  document.getElementById('ep-input').value=el.textContent.trim();
  renderEPCats(Object.keys(EP_CATS)[0]);
}
function closeEP(){document.getElementById('ep').style.display='none';_epEl=null;}
function renderEPCats(active){
  const cats=document.getElementById('ep-cats');
  cats.innerHTML=Object.keys(EP_CATS).map(k=>`<button class="ep-cat${k===active?' act':''}" onclick="renderEPCats('${k}')">${k}</button>`).join('');
  const grid=document.getElementById('ep-grid');
  grid.innerHTML=(EP_CATS[active]||[]).map(e=>`<div class="ep-item" onclick="epSelect('${e}')">${e}</div>`).join('');
}
function epSelect(e){
  if(_epEl){_epEl.textContent=e;closeEP();}
}
function epInput(v){
  if(!v.trim())return;
}
function epApply(){
  const v=document.getElementById('ep-input').value;
  if(v&&_epEl){_epEl.textContent=v;closeEP();}
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#ep')&&!e.target.closest('.icon-editable'))closeEP();
});

/* ══════════════════════════════════════════════════════════
   DELETE / ADD ITEMS
══════════════════════════════════════════════════════════ */

async function aiGenerate(){
  var btn=document.getElementById('ai-gen-btn');
  btn.disabled=true;
  btn.innerHTML='<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite"></span> 생성 중...';
  var brand=document.getElementById('ai-brand').value||'브랜드';
  var product=document.getElementById('ai-product').value||'제품';
  var cat=document.getElementById('ai-category').value||'패션';
  var feat=document.getElementById('ai-features').value||'';
  var target=document.getElementById('ai-target').value||'20-30대 여성';
  var tone=document.getElementById('ai-tone').value||'감성적';

  var prompt='당신은 한국 프리미엄 이커머스 상세페이지 전문 카피라이터입니다.\n'
    +'다음 정보를 바탕으로 구매 전환율이 높은 카피를 작성하세요.\n\n'
    +'[제품 정보]\n'
    +'- 브랜드: '+brand+'\n'
    +'- 제품명: '+product+'\n'
    +'- 카테고리: '+cat+'\n'
    +'- 핵심 기능/소재: '+feat+'\n'
    +'- 타겟 고객: '+target+'\n'
    +'- 톤앤매너: '+tone+'\n\n'
    +'[작성 지침]\n'
    +'- 배너/히어로: 임팩트 있는 짧은 문구, 감각적인 영문 슬로건\n'
    +'- 브랜드 스토리: 철학과 감성을 담은 3-4문장, <em>강조</em> 태그 활용\n'
    +'- 기능 설명: 구체적인 수치/소재명 포함, 소비자 혜택 중심\n'
    +'- FAQ: 실제 구매자가 자주 묻는 현실적인 질문과 친절한 답변\n'
    +'- 무드/스타일: 착용 상황을 생생하게 묘사\n'
    +'- 세탁/관리: 구체적이고 실용적인 안내\n\n'
    +'반드시 아래 JSON만 반환 (마크다운, 코드블록 없이 순수 JSON):\n'
    +'{\n'
    +'"bannerSeason":"시즌 텍스트 (예: 2025 SUMMER)",\n'
    +'"bannerKr":"배너 한글 메인 (2-4자)",\n'
    +'"bannerEn":"배너 영문 슬로건 (4-7단어)",\n'
    +'"heroEn":"히어로 영문 타이틀 (3-5단어)",\n'
    +'"heroKr":"히어로 한글 타이틀 (강렬한 2줄, \\n으로 구분)",\n'
    +'"heroSub":"히어로 서브 문구 (1문장)",\n'
    +'"copyEye":"섹션 레이블 (예: Brand Story)",\n'
    +'"copyQuote":"감성 인용문 (이탤릭 강조는 <em>텍스트</em>, 1-2문장)",\n'
    +'"copyBody":"브랜드 철학 본문 (3-4문장, <em>핵심단어</em> 강조)",\n'
    +'"feat1ico":"이모지","feat1nm":"기능명1","feat1desc":"기능 설명 (구체적 수치 포함)",\n'
    +'"feat2ico":"이모지","feat2nm":"기능명2","feat2desc":"기능 설명",\n'
    +'"feat3ico":"이모지","feat3nm":"기능명3","feat3desc":"기능 설명",\n'
    +'"feat4ico":"이모지","feat4nm":"기능명4","feat4desc":"기능 설명",\n'
    +'"feat5ico":"이모지","feat5nm":"기능명5","feat5desc":"기능 설명",\n'
    +'"feat6ico":"이모지","feat6nm":"기능명6","feat6desc":"기능 설명",\n'
    +'"proofN1":"수치1 (예: 98%)","proofL1":"라벨1","proofN2":"수치2","proofL2":"라벨2","proofN3":"수치3","proofL3":"라벨3",\n'
    +'"moodEn":"무드섹션 영문 헤딩 (3-5단어)","moodKr":"무드섹션 한글 (2-3단어)",\n'
    +'"inflEn":"인플루언서 섹션 영문","inflKr":"인플루언서 섹션 한글",\n'
    +'"storyLabel":"소재 섹션 영문 레이블 (예: MATERIAL STORY)","storyTitle":"소재 타이틀 (2줄, \\n구분)","storyBody":"소재 본문 (3-4문장)","storySpec1":"소재・내용","storySpec2":"원산지・내용","storySpec3":"인증・내용",\n'
    +'"styleEn":"스타일 섹션 영문","styleKr":"스타일 섹션 한글",\n'
    +'"style1mood":"캐주얼 스타일 레이블","style1title":"스타일 타이틀1","style1items":"아이템 조합 (예: 데님 쇼츠 + 오버핏 탑)",\n'
    +'"style2mood":"스마트 캐주얼","style2title":"스타일 타이틀2","style2items":"아이템 조합",\n'
    +'"style3mood":"페미닌","style3title":"스타일 타이틀3","style3items":"아이템 조합",\n'
    +'"pkgLabel":"패키지 레이블 (예: PACKAGING & DELIVERY)","pkgTitle":"패키지 타이틀 (2줄)","pkg1":"배송 특징1","pkg2":"배송 특징2","pkg3":"배송 특징3","pkg4":"배송 특징4","pkg5":"교환반품 정책",\n'
    +'"wearing_en":"착용컷 영문","wearing_kr":"착용컷 한글",\n'
    +'"wash1":"세탁 주의사항1","wash2":"세탁 주의사항2","wash3":"세탁 주의사항3",\n'
    +'"faq1q":"Q. 질문1","faq1a":"답변1 (구체적)",\n'
    +'"faq2q":"Q. 질문2","faq2a":"답변2",\n'
    +'"faq3q":"Q. 질문3","faq3a":"답변3",\n'
    +'"faq4q":"Q. 질문4","faq4a":"답변4",\n'
    +'"faq5q":"Q. 질문5","faq5a":"답변5"\n'
    +'}';

  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:3000,messages:[{role:'user',content:prompt}]})
  }).then(function(resp){return resp.json();}).then(function(data){
    var txt=(data.content&&data.content[0]&&data.content[0].text||'').replace(/```json\n?|\n?```/g,'').trim();
    _aiResult=JSON.parse(txt);
    var res=document.getElementById('ai-result');
    res.style.display='block';
    res.innerHTML='✅ 생성 완료!<br>배너: <b>'+(_aiResult.bannerKr||'')+'</b><br>슬로건: <b>'+(_aiResult.bannerEn||'')+'</b><br>기능1: <b>'+(_aiResult.feat1nm||'')+'</b>';
    document.getElementById('ai-apply-btn').style.display='block';
  }).catch(function(err){showHint('❌ 오류: '+err.message);})
  .finally(function(){
    btn.disabled=false;
    btn.innerHTML='✨ AI 카피 자동 생성';
  });
}

function aiApply(){
  if(!_aiResult)return;
  var r=_aiResult;
  var pv=document.getElementById('preview');
  function set(sel,val){var el=pv.querySelector(sel);if(el&&val!==undefined&&val!=='')el.innerHTML=val;}
  function setTxt(sel,val){var el=pv.querySelector(sel);if(el&&val!==undefined&&val!=='')el.textContent=val;}

  // 배너
  setTxt('.s-banner-season',r.bannerSeason);
  setTxt('.s-banner-kr',r.bannerKr);
  setTxt('.s-banner-en',r.bannerEn);

  // 히어로
  setTxt('.s-hero-en',r.heroEn);
  if(r.heroKr){var hk=pv.querySelector('.s-hero-kr');if(hk)hk.innerHTML=r.heroKr.replace(/\n/g,'<br>');}
  setTxt('.s-hero-sub',r.heroSub);

  // 브랜드 카피
  setTxt('.s-copy-eye',r.copyEye);
  set('.s-copy-quote',r.copyQuote);
  set('.s-copy-body',r.copyBody);

  // 특징 (최대 6개)
  var fitems=pv.querySelectorAll('.s-feat-item');
  [[r.feat1ico,r.feat1nm,r.feat1desc],[r.feat2ico,r.feat2nm,r.feat2desc],
   [r.feat3ico,r.feat3nm,r.feat3desc],[r.feat4ico,r.feat4nm,r.feat4desc],
   [r.feat5ico,r.feat5nm,r.feat5desc],[r.feat6ico,r.feat6nm,r.feat6desc]]
  .forEach(function(arr,i){
    if(!fitems[i])return;
    var ico=arr[0],nm=arr[1],desc=arr[2];
    var icoEl=fitems[i].querySelector('.s-feat-ico');if(icoEl&&ico)icoEl.textContent=ico;
    var nmEl=fitems[i].querySelector('.s-feat-name');if(nmEl&&nm)nmEl.textContent=nm;
    var dcEl=fitems[i].querySelector('.s-feat-desc');if(dcEl&&desc)dcEl.textContent=desc;
  });

  // 수치 증거
  var pitems=pv.querySelectorAll('.s-proof-item');
  [[r.proofN1,r.proofL1],[r.proofN2,r.proofL2],[r.proofN3,r.proofL3]].forEach(function(arr,i){
    if(!pitems[i])return;
    var nEl=pitems[i].querySelector('.s-proof-num');if(nEl&&arr[0])nEl.textContent=arr[0];
    var lEl=pitems[i].querySelector('.s-proof-lbl');if(lEl&&arr[1])lEl.textContent=arr[1];
  });

  // 무드컷 섹션
  var moodSec=pv.querySelector('.s-mood');
  if(moodSec){
    var mEn=moodSec.querySelector('.sec-en');if(mEn&&r.moodEn)mEn.textContent=r.moodEn;
    var mKr=moodSec.querySelector('.sec-kr');if(mKr&&r.moodKr)mKr.textContent=r.moodKr;
  }

  // 인플루언서 섹션
  var inflSec=pv.querySelector('.s-infl');
  if(inflSec){
    var iEn=inflSec.querySelector('.sec-en');if(iEn&&r.inflEn)iEn.textContent=r.inflEn;
    var iKr=inflSec.querySelector('.sec-kr');if(iKr&&r.inflKr)iKr.textContent=r.inflKr;
  }

  // 소재 스토리
  setTxt('.s-story-label',r.storyLabel);
  if(r.storyTitle){var st=pv.querySelector('.s-story-title');if(st)st.innerHTML=r.storyTitle.replace(/\n/g,'<br>');}
  setTxt('.s-story-body',r.storyBody);
  var specs=pv.querySelectorAll('.s-story-spec');
  if(specs[0]&&r.storySpec1)specs[0].textContent=r.storySpec1;
  if(specs[1]&&r.storySpec2)specs[1].textContent=r.storySpec2;
  if(specs[2]&&r.storySpec3)specs[2].textContent=r.storySpec3;

  // 스타일 가이드
  var styleSec=pv.querySelector('.s-style');
  if(styleSec){
    var sEn=styleSec.querySelector('.sec-en');if(sEn&&r.styleEn)sEn.textContent=r.styleEn;
    var sKr=styleSec.querySelector('.sec-kr');if(sKr&&r.styleKr)sKr.textContent=r.styleKr;
    var scards=styleSec.querySelectorAll('.s-style-card');
    [[r.style1mood,r.style1title,r.style1items],[r.style2mood,r.style2title,r.style2items],[r.style3mood,r.style3title,r.style3items]]
    .forEach(function(arr,i){
      if(!scards[i])return;
      var sm=scards[i].querySelector('.s-style-mood');if(sm&&arr[0])sm.textContent=arr[0];
      var st2=scards[i].querySelector('.s-style-title');if(st2&&arr[1])st2.textContent=arr[1];
      var si=scards[i].querySelector('.s-style-items');if(si&&arr[2])si.textContent=arr[2];
    });
  }

  // 패키지
  setTxt('.s-pkg-label',r.pkgLabel);
  if(r.pkgTitle){var pt=pv.querySelector('.s-pkg-title');if(pt)pt.innerHTML=r.pkgTitle.replace(/\n/g,'<br>');}
  var pkgItems=pv.querySelectorAll('.s-pkg-item');
  [r.pkg1,r.pkg2,r.pkg3,r.pkg4,r.pkg5].forEach(function(val,i){
    if(pkgItems[i]&&val)pkgItems[i].textContent=val;
  });

  // 착용컷
  setTxt('.s-wearing-en',r.wearing_en);
  setTxt('.s-wearing-kr',r.wearing_kr);

  // 세탁/관리
  var washNotes=pv.querySelectorAll('.s-wash-note-item');
  [r.wash1,r.wash2,r.wash3].forEach(function(val,i){
    if(washNotes[i]&&val)washNotes[i].textContent=val;
  });

  // FAQ
  var faqitems=pv.querySelectorAll('.s-faq-item');
  [[r.faq1q,r.faq1a],[r.faq2q,r.faq2a],[r.faq3q,r.faq3a],[r.faq4q,r.faq4a],[r.faq5q,r.faq5a]]
  .forEach(function(arr,i){
    if(!faqitems[i])return;
    var qEl=faqitems[i].querySelector('.s-faq-q-txt');if(qEl&&arr[0])qEl.textContent=arr[0];
    var aEl=faqitems[i].querySelector('.s-faq-a');if(aEl&&arr[1])aEl.textContent=arr[1];
  });

  showHint('✅ AI 카피 전체 적용 완료!');
}

/* ══════════════════════════════════════════════════════════
   SAVE / EXPORT
══════════════════════════════════════════════════════════ */
function buildClean(){
  const clone=document.getElementById('preview').cloneNode(true);
  // Remove edit UI
  clone.querySelectorAll('.sec-toolbar,.del-btn,.add-btn,.ico-btn,.iz-zone-del,.iz-ov,.resize-bar,.tf-border,.tf-handle,.tf-dim,.tf-lock-badge,.mood-copy-del').forEach(e=>e.remove());
  // Remove file inputs
  clone.querySelectorAll('input[type=file]').forEach(e=>e.remove());
  // Remove contenteditable
  clone.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('contenteditable'));
  // Show tf-wrap images fully
  clone.querySelectorAll('.iz-in').forEach(e=>e.remove());
  return clone;
}

async function saveJPG(){await doSave(_jpgScale||3,'jpg');}
async function savePNG(){await doSave(3,'png');}
function dlTrigger(url,name){
  // 1차: 직접 다운로드 시도
  const a=document.createElement('a');a.href=url;a.download=name;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  // 2차: 새 탭 (iframe 제한 대비)
  setTimeout(()=>{
    try{window.open(url,'_blank');}catch(e){}
  },300);
}

async function loadH2C(){
  if(typeof html2canvas!=='undefined')return true;
  return new Promise(res=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload=()=>res(true);s.onerror=()=>res(false);
    document.head.appendChild(s);
  });
}

async function doSave(scale, fmt){
  showHint('⏳ 이미지 생성 중...');
  const API = window.EDITOR_API_URL || '';   // 서버 URL (배포 후 설정)

  // ── 서버가 연결된 경우: Puppeteer 고화질 캡처 ──────────────────────────
  if(API){
    try{
      const html = document.documentElement.outerHTML;
      const res = await fetch(API + '/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, format: fmt === 'jpg' ? 'jpeg' : 'png', quality: 95, scale })
      });
      if(!res.ok) throw new Error('서버 오류: ' + res.status);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      showImgModal(url, fmt, true);
      showHint('✅ 서버 고화질 캡처 완료! 우클릭 → 저장');
      return;
    } catch(err){
      console.warn('서버 캡처 실패, html2canvas로 폴백:', err);
    }
  }

  // ── 폴백: html2canvas (로컬/오프라인) ─────────────────────────────────
  const ok = await loadH2C();
  if(!ok){
    alert('❌ html2canvas 로드 실패\n인터넷 연결을 확인해주세요.');
    showHint('❌ html2canvas 로드 실패'); return;
  }
  showHint('📸 ' + fmt.toUpperCase() + ' 생성 중...');
  document.activeElement?.blur();
  tfDeselect();
  await new Promise(r => setTimeout(r, 400));
  const target = document.getElementById('preview');
  const skipEl = el => {
    const skip = ['INPUT','BUTTON','SELECT'];
    if(skip.includes(el.tagName)) return true;
    const cls = ['sec-toolbar','del-btn','add-btn','ico-btn','resize-bar',
      'iz-ov','tf-border','tf-handle','tf-dim','tf-lock-badge',
      'iz-zone-del','mood-copy-del','iz-in'];
    return cls.some(k => el.classList.contains(k));
  };
  try{
    const canvas = await html2canvas(target, {
      scale, useCORS: true, allowTaint: true, backgroundColor: '#fff',
      logging: false, imageTimeout: 8000, ignoreElements: skipEl,
    });
    const dataUrl = canvas.toDataURL(fmt === 'png' ? 'image/png' : 'image/jpeg', 0.97);
    showImgModal(dataUrl, fmt, false);
    showHint('✅ 이미지 생성 완료 - 우클릭 → 이미지 저장');
  } catch(err){
    var msg = '❌ 이미지 생성 오류: ' + err.message;
    showHint(msg);
    console.error(err);
    alert(msg + '\n\n콘솔(F12)에서 상세 오류를 확인하세요.');
  }
}

// ── buildSecOv ──────────────────────────────────────────────────────────
function buildSecOv(sec,meta){
  var ov=document.createElement('div');ov.className='sec-ov';
  var lbl=document.createElement('span');lbl.className='sec-ov-btn sov-lbl';lbl.textContent=meta.label||'';ov.appendChild(lbl);
  var bgWrap=document.createElement('div');bgWrap.style.cssText='position:relative;display:inline-block;';
  var bgBtn=document.createElement('button');bgBtn.className='sec-ov-btn sov-bg';bgBtn.textContent='🎨 배경';
  var bgPop=document.createElement('div');bgPop.className='bg-pop';
  var bgT=document.createElement('div');bgT.className='bg-pop-title';bgT.textContent='배경색';bgPop.appendChild(bgT);
  var swDiv=document.createElement('div');swDiv.className='bg-swatches';
  BG_COLORS.forEach(function(col){
    var sw=document.createElement('div');sw.className='bg-sw';sw.style.background=col;
    (function(col2){sw.addEventListener('click',function(){sec.style.background=col2;bgPop.classList.remove('show');});})(col);
    swDiv.appendChild(sw);
  });
  bgPop.appendChild(swDiv);
  var colIn=document.createElement('input');colIn.type='color';colIn.className='bg-custom';colIn.value='#ffffff';
  colIn.addEventListener('input',function(){sec.style.background=colIn.value;});
  bgPop.appendChild(colIn);
  bgBtn.addEventListener('click',function(e){e.stopPropagation();bgPop.classList.toggle('show');});
  bgWrap.appendChild(bgBtn);bgWrap.appendChild(bgPop);ov.appendChild(bgWrap);
  ['↑','↓'].forEach(function(dir){
    var btn=document.createElement('button');
    btn.className='sec-ov-btn sov-'+(dir==='↑'?'up':'dn');btn.textContent=dir;
    btn.addEventListener('click',function(){
      var p=document.getElementById('preview');
      var ss=[].slice.call(p.querySelectorAll(':scope>.sec-wrap'));
      var i=ss.indexOf(sec);
      if(dir==='↑'&&i>0)p.insertBefore(sec,ss[i-1]);
      else if(dir==='↓'&&i<ss.length-1)p.insertBefore(ss[i+1],sec);
    });
    ov.appendChild(btn);
  });
  var delB=document.createElement('button');delB.className='sec-ov-btn sov-del';delB.textContent='✕';
  delB.addEventListener('click',function(){sec.remove();});
  ov.appendChild(delB);
  return ov;
}

// ── addSection ────────────────────────────────────────────────────────────
function addSection(type){
  var tmpl=SEC_TMPL[type];if(!tmpl){console.warn('Unknown section:',type);return;}
  var html=typeof tmpl==='function'?tmpl():tmpl;
  var div=document.createElement('div');div.innerHTML=html;
  var sec=div.firstElementChild;if(!sec)return;
  sec.dataset.secId='sec_'+(++_uid);sec.dataset.secType=type;
  var meta=SEC_META[type]||{label:type};
  sec.appendChild(buildSecOv(sec,meta));
  var preview=document.getElementById('preview');if(!preview)return;
  preview.appendChild(sec);
  sec.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  // 텍스트 툴바 연결
  sec.querySelectorAll('[contenteditable]').forEach(function(el){
    if(typeof bindFT==='function')bindFT(el);
  });
  closeAddModal();
}

// ── 플로팅 텍스트 툴바 ────────────────────────────────────────────────────
function bindFT(el){
  el.addEventListener('focus',function(){
    _ftEl=el;
    var ft=document.getElementById('ft');
    if(!ft)return;
    var r=el.getBoundingClientRect();
    ft.style.display='flex';
    ft.style.top=Math.max(4,r.top-44)+'px';
    ft.style.left=Math.max(4,Math.min(r.left,window.innerWidth-280))+'px';
    // 현재 폰트 크기 표시
    var sz=parseInt(window.getComputedStyle(el).fontSize)||16;
    var szEl=document.getElementById('ft-sz');
    if(szEl)szEl.textContent=sz+'px';
  });
  el.addEventListener('blur',function(e){
    // 툴바 클릭 시 포커스 잃어도 유지
    setTimeout(function(){
      var ft=document.getElementById('ft');
      if(ft&&!ft.contains(document.activeElement)&&document.activeElement!==el){
        closeFT();
      }
    },150);
  });
}

function ftSz(delta){
  if(!_ftEl)return;
  var cur=parseInt(window.getComputedStyle(_ftEl).fontSize)||16;
  var next=Math.max(8,Math.min(200,cur+delta*2));
  _ftEl.style.fontSize=next+'px';
  var szEl=document.getElementById('ft-sz');
  if(szEl)szEl.textContent=next+'px';
}

// ── clearIzImage ──────────────────────────────────────────────────────────
function clearIzImage(iz){
  if(!iz)return;
  var tf=iz.querySelector('.tf-wrap');if(tf)tf.remove();
  var izIn=iz.querySelector('.iz-in');if(izIn)izIn.style.display='';
  iz.style.border='';iz.style.background='';
  iz.classList.remove('has-image');
  iz.querySelectorAll('.iz-ov').forEach(function(o){o.remove();});
  if(typeof buildIzOverlay==='function')buildIzOverlay(iz);
  showHint('🗑 이미지 제거됨 (슬롯 유지)');
}

// ── 배경색 ────────────────────────────────────────────────────────────────
var SIZE_PRESETS={
  '의류':{cols:['Size','총장','가슴','어깨','소매'],rows:['XS','S','M','L','XL']},
  '가방':{cols:['사이즈','가로','세로','높이'],rows:['S','M','L']},
  '신발':{cols:['사이즈','발 길이','발 폭'],rows:['220','230','240','250','260','270']},
  '양말':{cols:['사이즈','발 사이즈'],rows:['S(220-240)','L(250-270)']},
  '모자':{cols:['사이즈','머리둘레'],rows:['S','M','L','XL']},
  '바지':{cols:['Size','허리','엉덩이','밑위','허벅지','밑단'],rows:['XS','S','M','L','XL']},
};
function applyPreset(secEl,presetName){
  var p=SIZE_PRESETS[presetName];if(!p)return;
  var tbl=secEl.querySelector('.s-size-tbl');if(!tbl)return;
  var thead=tbl.querySelector('thead tr');
  thead.innerHTML=p.cols.map(function(h){return '<th contenteditable>'+h+'</th>';}).join('');
  var tbody=tbl.querySelector('tbody');
  tbody.innerHTML=p.rows.map(function(r,i){
    var cells=[r];for(var j=1;j<p.cols.length;j++)cells.push('—');
    return '<tr'+(i===Math.floor(p.rows.length/2)?' class="highlight"':'')+'>'+cells.map(function(v){return '<td contenteditable>'+v+'</td>';}).join('')+'</tr>';
  }).join('');
  showHint('✅ '+presetName+' 프리셋 적용');
}
function sizeAddRow(secEl){var tbody=secEl.querySelector('.s-size-tbl tbody');if(!tbody)return;var cols=secEl.querySelectorAll('.s-size-tbl thead th').length;var tr=document.createElement('tr');for(var i=0;i<cols;i++){var td=document.createElement('td');td.contentEditable='true';td.textContent='—';tr.appendChild(td);}tbody.appendChild(tr);}
function sizeDelRow(secEl){var tbody=secEl.querySelector('.s-size-tbl tbody');if(!tbody)return;var rows=tbody.querySelectorAll('tr');if(rows.length>1)rows[rows.length-1].remove();}
function sizeAddCol(secEl){var tbl=secEl.querySelector('.s-size-tbl');if(!tbl)return;var th=document.createElement('th');th.contentEditable='true';th.textContent='항목';tbl.querySelector('thead tr').appendChild(th);tbl.querySelectorAll('tbody tr').forEach(function(tr){var td=document.createElement('td');td.contentEditable='true';td.textContent='—';tr.appendChild(td);});}
function sizeDelCol(secEl){var thead=secEl.querySelector('.s-size-tbl thead tr');if(!thead)return;var ths=thead.querySelectorAll('th');if(ths.length<=1)return;ths[ths.length-1].remove();secEl.querySelectorAll('.s-size-tbl tbody tr').forEach(function(tr){var tds=tr.querySelectorAll('td');if(tds.length>1)tds[tds.length-1].remove();});}

// ── saveHTML / saveEditHTML ────────────────────────────────────────────────
function makeFixed(orig){
  return orig
    .replace(/\/\*INIT_BEGIN\*\/[\s\S]*?\/\*INIT_END\*\//,"(function(){\n  var preview=document.getElementById('preview');\n  if(!preview)return;\n  [].slice.call(preview.querySelectorAll(':scope>.sec-wrap')).forEach(function(sec){\n    var type=sec.dataset.secType;\n    var meta=(typeof SEC_META!=='undefined'&&SEC_META[type])||{label:type||''};\n    [].slice.call(sec.querySelectorAll('.sec-ov')).forEach(function(o){o.remove();});\n    if(typeof buildSecOv==='function')sec.appendChild(buildSecOv(sec,meta));\n    [].slice.call(sec.querySelectorAll('.iz')).forEach(function(iz){\n      [].slice.call(iz.querySelectorAll('.iz-ov')).forEach(function(o){o.remove();});\n      if(typeof buildIzOverlay==='function')buildIzOverlay(iz);\n      if(typeof addBar==='function')addBar(iz);\n      var tf=iz.querySelector('.tf-wrap');\n      if(tf&&typeof bindTF==='function')bindTF(tf,iz);\n    });\n  });\n  try{if(typeof renderEPCats==='function'&&typeof EP_CATS!=='undefined')renderEPCats(Object.keys(EP_CATS)[0]);}catch(e){}\n  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});\n})();")
    .replace('html,body{height:100%;overflow:hidden;}','html{height:100%;}body{min-height:100%;overflow-y:auto;background:#dde0e8;}')
    .replace('id="body"','id="body" style="min-height:calc(100vh - 48px)"');
}
function saveHTML(){
  var fixed=makeFixed(document.documentElement.outerHTML);
  var b=new Blob(['<!DOCTYPE html>'+fixed],{type:'text/html;charset=utf-8'});
  var u=URL.createObjectURL(b);
  var a=document.createElement('a');a.href=u;a.download='detail-page-full.html';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(u);showHint('✅ HTML 저장됨');
}
function saveEditHTML(){
  var fixed=makeFixed(document.documentElement.outerHTML);
  var b=new Blob(['<!DOCTYPE html>'+fixed],{type:'text/html;charset=utf-8'});
  var u=URL.createObjectURL(b);
  var a=document.createElement('a');a.href=u;a.download='detail-page-editor.html';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(u);showHint('✅ 편집 HTML 저장됨');
}

// ── 전역 이벤트 ───────────────────────────────────────────────────────────
document.addEventListener('click',function(e){
  if(!e.target.closest('.bg-pop')&&!e.target.closest('.sov-bg'))
    document.querySelectorAll('.bg-pop.show').forEach(function(p){p.classList.remove('show');});
  if(!e.target.closest('#ep')&&!e.target.closest('.icon-editable'))closeEP();
  if(!e.target.closest('[contenteditable]')&&!(document.getElementById('ft')&&document.getElementById('ft').contains(e.target)))closeFT();
});

// ── INIT ──────────────────────────────────────────────────────────────────
function showImgModal(dataUrl, fmt, isBlob, label){
  var old=document.getElementById('img-save-modal');if(old)old.remove();
  var modal=document.createElement('div');
  modal.id='img-save-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:99999;display:flex;flex-direction:column;align-items:center;padding:16px;overflow-y:auto;';

  // 상단 바
  var bar=document.createElement('div');
  bar.style.cssText='width:100%;max-width:900px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;flex-shrink:0;';

  var guide=document.createElement('div');
  guide.style.cssText='color:#fff;font-size:13px;font-weight:600;background:rgba(255,255,255,.12);padding:8px 14px;border-radius:8px;';
  guide.textContent='📥 '+(label||fmt.toUpperCase())+' 저장 — 우클릭 → 이미지를 다른 이름으로 저장';

  var dlBtn=document.createElement('a');
  dlBtn.href=dataUrl;
  dlBtn.download='detail-page.'+(fmt==='jpg'?'jpg':'png');
  dlBtn.style.cssText='background:'+(isBlob?'#16a34a':'#2563eb')+';color:#fff;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;white-space:nowrap;';
  dlBtn.textContent='⬇ 다운로드';

  var closeBtn=document.createElement('button');
  closeBtn.textContent='✕ 닫기';
  closeBtn.style.cssText='background:#dc2626;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;';
  closeBtn.onclick=function(){modal.remove();};

  bar.appendChild(guide);bar.appendChild(dlBtn);bar.appendChild(closeBtn);

  // 이미지
  var img=document.createElement('img');
  img.src=dataUrl;
  img.style.cssText='max-width:100%;width:auto;height:auto;border:2px solid rgba(255,255,255,.3);border-radius:6px;display:block;cursor:pointer;';
  img.title='우클릭 → 이미지를 다른 이름으로 저장';

  var wrap=document.createElement('div');
  wrap.style.cssText='width:100%;max-width:900px;';
  wrap.appendChild(img);

  modal.appendChild(bar);modal.appendChild(wrap);
  document.body.appendChild(modal);
  modal.addEventListener('click',function(ev){if(ev.target===modal)modal.remove();});
}

// ── 모바일·PC 맞춤 캡처 ───────────────────────────────────────────────────
async function saveMobile(){
  // 375px (모바일) 너비로 캡처
  await doSaveCustom(375, 3, 'jpg', '모바일');
}
async function savePC(){
  // 860px (PC) 너비로 캡처 - 현재 기본값
  await doSaveCustom(860, 3, 'jpg', 'PC');
}
async function doSaveCustom(targetW, scale, fmt, label){
  showHint('⏳ '+label+' 버전 생성 중...');
  const ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 실패'); return; }

  const preview = document.getElementById('preview');
  const origW = preview.style.width;

  // 임시로 타겟 너비 적용
  preview.style.width = targetW + 'px';
  // 폰트 리스케일을 위한 잠깐 대기
  await new Promise(r => setTimeout(r, 600));
  document.activeElement?.blur();
  tfDeselect?.();
  await new Promise(r => setTimeout(r, 300));

  const skipEl = el => {
    const skip = ['INPUT','BUTTON','SELECT'];
    if(skip.includes(el.tagName)) return true;
    const cls = ['sec-toolbar','del-btn','add-btn','ico-btn','resize-bar',
      'iz-ov','tf-border','tf-handle','tf-dim','tf-lock-badge',
      'iz-zone-del','mood-copy-del','iz-in','s-size-ctrl',
      'feat-row-add-wrap','feat-add-img-row'];
    return cls.some(k => el.classList.contains(k));
  };

  try{
    const canvas = await html2canvas(preview, {
      scale, useCORS: true, allowTaint: true, backgroundColor: '#fff',
      logging: false, imageTimeout: 10000, ignoreElements: skipEl,
      width: targetW,
    });
    const dataUrl = canvas.toDataURL(
      fmt === 'png' ? 'image/png' : 'image/jpeg', 0.97
    );
    const finalW = targetW * scale;
    showHint('✅ '+label+' '+finalW+'px 이미지 생성 완료');
    showImgModal(dataUrl, fmt, false, label+' '+finalW+'px');
  } catch(err){
    showHint('❌ 오류: '+err.message);
    console.error(err);
    alert('캡처 오류: '+err.message);
  } finally {
    // 원래 너비 복원
    preview.style.width = origW;
  }
}

// ═══════════════════════════════════════════════════════════════
//  분할 저장: 섹션 단위로 캡처 → 3500px 기준 그룹핑 → 합치기
// ═══════════════════════════════════════════════════════════════
async function saveSplit(targetW, scale, maxH){
  targetW = targetW || 860;
  scale   = scale   || 1;  // 기본 860px 출력
  maxH    = maxH    || 3500;

  const ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 실패'); return; }

  const preview = document.getElementById('preview');
  const origW   = preview.style.width;
  preview.style.width = targetW + 'px';
  document.activeElement && document.activeElement.blur();
  if(typeof tfDeselect === 'function') tfDeselect();
  await new Promise(r => setTimeout(r, 700));

  const sections = Array.from(document.querySelectorAll('#preview > .sec-wrap'));
  if(!sections.length){ showHint('❌ 섹션 없음'); preview.style.width = origW; return; }

  const skipEl = el => {
    if(['INPUT','BUTTON','SELECT'].includes(el.tagName)) return true;
    return ['sec-toolbar','del-btn','add-btn','ico-btn','resize-bar',
      'iz-ov','tf-border','tf-handle','tf-dim','tf-lock-badge',
      'iz-zone-del','feat-row-add-wrap','feat-add-img-row','s-size-ctrl',
      'mood-copy-del','iz-in','sec-ov']
      .some(k => el.classList.contains(k));
  };

  showHint('⏳ 0 / ' + sections.length + ' 캡처 중...');

  try{
    // ── 1. 섹션별 개별 캡처 ─────────────────────────────────────────────
    const captured = [];
    for(let i = 0; i < sections.length; i++){
      showHint('⏳ ' + (i+1) + ' / ' + sections.length + ' 캡처 중...');
      const cv = await html2canvas(sections[i], {
        scale        : scale,
        useCORS      : true,
        allowTaint   : true,
        backgroundColor: null,   // 섹션 배경색 유지
        logging      : false,
        imageTimeout : 12000,
        ignoreElements: skipEl,
      });
      captured.push(cv);
      await new Promise(r => setTimeout(r, 30)); // 브라우저 숨 고르기
    }

    // ── 2. 3500px 기준으로 그룹핑 ───────────────────────────────────────
    const chunks = [];
    let group = [], groupH = 0;

    for(const cv of captured){
      // 이미 그룹이 있고, 추가하면 maxH 초과 → 현재 그룹 확정
      if(group.length > 0 && groupH + cv.height > maxH){
        chunks.push(group);
        group = [];
        groupH = 0;
      }
      group.push(cv);
      groupH += cv.height;
    }
    if(group.length > 0) chunks.push(group);

    // ── 3. 그룹별 합쳐서 최종 캔버스 생성 ──────────────────────────────
    const results = [];
    for(let ci = 0; ci < chunks.length; ci++){
      const chunk = chunks[ci];
      const w = chunk[0].width;
      const h = chunk.reduce(function(s, cv){ return s + cv.height; }, 0);

      const final = document.createElement('canvas');
      final.width  = w;
      final.height = h;
      const ctx = final.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      let y = 0;
      for(const cv of chunk){
        ctx.drawImage(cv, 0, y);
        y += cv.height;
      }
      results.push({ dataUrl: final.toDataURL('image/jpeg', 0.97), w, h, idx: ci+1, total: chunks.length });
    }

    // ── 4. 갤러리 모달로 표시 ────────────────────────────────────────────
    showSplitGallery(results, targetW, scale);
    showHint('✅ ' + chunks.length + '개 파트 분할 완료!');

  } catch(err){
    showHint('❌ 오류: ' + err.message);
    console.error(err);
    alert('분할 캡처 오류: ' + err.message);
  } finally {
    preview.style.width = origW;
  }
}

function showSplitGallery(parts, targetW, scale){
  var old = document.getElementById('split-gallery'); if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'split-gallery';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;display:flex;flex-direction:column;overflow:hidden;';

  // 헤더
  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(255,255,255,.07);flex-shrink:0;gap:8px;';
  hdr.innerHTML = '<div style="color:#fff;font-size:13px;font-weight:700;">📦 분할 저장 — '+parts.length+'개 파트 ('+ targetW +'px 출력)</div>';

  var info = document.createElement('div');
  info.style.cssText = 'color:#aaa;font-size:11px;background:rgba(255,255,255,.1);padding:5px 10px;border-radius:6px;';
  info.textContent = '우클릭 → 이미지를 다른 이름으로 저장';

  var closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ 닫기';
  closeBtn.style.cssText = 'background:#dc2626;color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:700;';
  closeBtn.onclick = function(){ modal.remove(); };

  hdr.appendChild(info); hdr.appendChild(closeBtn);

  // 스크롤 영역
  var scroll = document.createElement('div');
  scroll.style.cssText = 'display:flex;gap:20px;padding:16px;overflow-x:auto;overflow-y:hidden;flex:1;align-items:flex-start;';

  parts.forEach(function(part){
    var card = document.createElement('div');
    card.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:8px;align-items:center;';

    // 파트 라벨
    var lbl = document.createElement('div');
    lbl.style.cssText = 'color:#fff;font-size:12px;font-weight:700;';
    lbl.textContent = 'Part ' + part.idx + ' / ' + part.total;

    var size = document.createElement('div');
    size.style.cssText = 'color:#aaa;font-size:10px;';
    size.textContent = part.w + ' × ' + part.h + 'px';

    // 다운로드 버튼
    var dlBtn = document.createElement('a');
    dlBtn.href = part.dataUrl;
    dlBtn.download = 'detail-part' + part.idx + '.jpg';
    dlBtn.style.cssText = 'background:#16a34a;color:#fff;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;';
    dlBtn.textContent = '⬇ Part ' + part.idx + ' 다운로드';

    // 이미지 (썸네일)
    var img = document.createElement('img');
    img.src = part.dataUrl;
    img.style.cssText = 'max-height:70vh;width:auto;border:2px solid rgba(255,255,255,.2);border-radius:6px;cursor:pointer;display:block;';
    img.title = '우클릭 → 이미지를 다른 이름으로 저장';

    card.appendChild(lbl); card.appendChild(size); card.appendChild(dlBtn); card.appendChild(img);
    scroll.appendChild(card);
  });

  modal.appendChild(hdr); modal.appendChild(scroll);
  document.body.appendChild(modal);

  // 배경 클릭 닫기
  modal.addEventListener('click', function(ev){ if(ev.target === modal) modal.remove(); });
}

// ── 모바일 가독성 최적화 저장 (860px 기준, 폰트 2.3배 확대) ─────────────────
async function saveOptimized(){
  var ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 실패'); return; }

  var preview = document.getElementById('preview');
  var origW = preview.style.width;

  // 860px + 모바일 최적화 폰트 클래스 적용
  preview.style.width = '860px';
  preview.classList.add('for-mobile-capture');
  showHint('⏳ 모바일 최적화 이미지 생성 중...');
  await new Promise(r => setTimeout(r, 900));
  document.activeElement && document.activeElement.blur();
  if(typeof tfDeselect==='function') tfDeselect();
  await new Promise(r => setTimeout(r, 300));

  var skipEl = function(el){
    if(['INPUT','BUTTON','SELECT'].includes(el.tagName)) return true;
    return ['sec-toolbar','del-btn','add-btn','ico-btn','resize-bar','iz-ov',
      'tf-border','tf-handle','tf-dim','tf-lock-badge','iz-zone-del',
      'feat-row-add-wrap','feat-add-img-row','s-size-ctrl','sec-ov','iz-in']
      .some(function(k){ return el.classList.contains(k); });
  };

  try{
    var canvas = await html2canvas(preview,{
      scale: 1,          // 860px × 1 = 860px (플랫폼 표준)
      useCORS: true, allowTaint: true, backgroundColor: '#fff',
      logging: false, imageTimeout: 12000, ignoreElements: skipEl,
    });
    var dataUrl = canvas.toDataURL('image/jpeg', 0.97);
    showHint('✅ 860px 모바일 최적화 이미지 완성! (플랫폼 표준 크기)');
    showImgModal(dataUrl, 'jpg', false, '✅ PC·모바일 최적화 (1720px)');
  } catch(err){
    showHint('❌ 오류: '+err.message);
    alert('오류: '+err.message);
  } finally {
    preview.style.width = origW;
    preview.classList.remove('for-mobile-capture');
  }
}

// ── 모바일 최적화 분할 저장 ────────────────────────────────────────────────
async function saveOptimizedSplit(){
  var ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 실패'); return; }

  var preview = document.getElementById('preview');
  var origW = preview.style.width;
  preview.style.width = '860px';
  preview.classList.add('for-mobile-capture');
  await new Promise(r => setTimeout(r, 900));
  if(typeof tfDeselect==='function') tfDeselect();
  await new Promise(r => setTimeout(r, 300));

  var skipEl = function(el){
    if(['INPUT','BUTTON','SELECT'].includes(el.tagName)) return true;
    return ['sec-toolbar','del-btn','add-btn','ico-btn','resize-bar','iz-ov',
      'tf-border','tf-handle','tf-dim','tf-lock-badge','iz-zone-del',
      'feat-row-add-wrap','feat-add-img-row','s-size-ctrl','sec-ov','iz-in']
      .some(function(k){ return el.classList.contains(k); });
  };

  var sections = Array.from(document.querySelectorAll('#preview > .sec-wrap'));
  var captured = [];
  try{
    for(var i=0;i<sections.length;i++){
      showHint('⏳ '+(i+1)+'/'+sections.length+' 캡처 중 (모바일 최적화)...');
      var cv = await html2canvas(sections[i],{
        scale:1, useCORS:true, allowTaint:true,
        backgroundColor:null, logging:false, imageTimeout:12000,
        ignoreElements:skipEl,
      });
      captured.push(cv);
      await new Promise(r=>setTimeout(r,30));
    }
    var chunks=[], group=[], groupH=0;
    for(var ci=0;ci<captured.length;ci++){
      if(group.length>0 && groupH+captured[ci].height>3500){
        chunks.push(group); group=[]; groupH=0;
      }
      group.push(captured[ci]); groupH+=captured[ci].height;
    }
    if(group.length>0) chunks.push(group);

    var results=[];
    for(var k=0;k<chunks.length;k++){
      var w=chunks[k][0].width;
      var h=chunks[k].reduce(function(s,v){return s+v.height;},0);
      var final=document.createElement('canvas');
      final.width=w; final.height=h;
      var ctx=final.getContext('2d');
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h);
      var y=0;
      for(var j=0;j<chunks[k].length;j++){ ctx.drawImage(chunks[k][j],0,y); y+=chunks[k][j].height; }
      results.push({dataUrl:final.toDataURL('image/jpeg',0.97),w:w,h:h,idx:k+1,total:chunks.length});
    }
    showSplitGallery(results,860,2);
    showHint('✅ 모바일 최적화 분할 완성! '+chunks.length+'개 파트');
  } catch(err){
    showHint('❌ 오류: '+err.message); alert(err.message);
  } finally {
    preview.style.width = origW;
    preview.classList.remove('for-mobile-capture');
  }
}

// ═══════════════════════════════════════════════════════════════
//  서버 API 연동 (Puppeteer 고화질 렌더링)
// ═══════════════════════════════════════════════════════════════
var API_BASE = window.location.origin; // 같은 서버

async function captureViaServer(opts){
  // opts: { mobile, split, format }
  var width  = opts.mobile ? 375 : 860;
  var format = opts.format || 'jpeg';
  var endpoint = opts.split ? '/api/capture/split' : '/api/capture';

  // 현재 에디터 HTML 수집
  var preview = document.getElementById('preview');
  if(!preview){ showHint('❌ #preview 없음'); return; }

  // 저장용 HTML 생성 (에디터 UI 제거)
  var clone = preview.cloneNode(true);
  clone.querySelectorAll('.sec-ov,.iz-ov,.del-btn,.add-btn,.resize-bar,.iz-zone-del,.tf-border,.tf-handle,.tf-dim,.s-size-ctrl,.feat-row-add-wrap').forEach(function(e){e.remove();});
  clone.querySelectorAll('[contenteditable]').forEach(function(e){e.removeAttribute('contenteditable');});

  // 현재 CSS 포함한 완전한 HTML
  var styleEl = document.querySelector('style');
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
    + '<style>'
    + (styleEl ? styleEl.textContent : '')
    + '#preview{width:'+width+'px;margin:0;padding:0;}'
    + '#topbar,#right,body>*:not(#preview){display:none!important;}'
    + 'body{margin:0;padding:0;background:#fff;}'
    + '</style>'
    + '</head><body>'
    + clone.outerHTML
    + '</body></html>';

  showHint('⏳ 서버에서 캡처 중...');

  try{
    if(opts.split){
      var res = await fetch(API_BASE + endpoint, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ html, width, scale:1, maxH:3500, format })
      });
      var data = await res.json();
      if(!data.ok) throw new Error(data.error);
      showServerSplitGallery(data.chunks, width);
      showHint('✅ '+data.parts+'개 파트 캡처 완료!');
    } else {
      var res = await fetch(API_BASE + endpoint, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ html, width, scale:1, format, quality:95 })
      });
      if(!res.ok) throw new Error(await res.text());
      var blob = await res.blob();
      var url = URL.createObjectURL(blob);
      showImgModal(url, format==='png'?'png':'jpg', true, width+'px 서버 캡처');
      showHint('✅ 서버 캡처 완료! '+width+'px');
    }
  } catch(e){
    showHint('❌ 서버 오류: '+e.message);
    alert('서버 오류: '+e.message);
  }
}

function showServerSplitGallery(chunks, width){
  var old = document.getElementById('server-gallery');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'server-gallery';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;display:flex;flex-direction:column;overflow:hidden;';

  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,.07);flex-shrink:0;';
  hdr.innerHTML = '<span style="color:#fff;font-weight:700;font-size:14px;">✂ '+chunks.length+'개 파트 / 출력 '+width+'px</span>'
    +'<span style="color:#aaa;font-size:11px;background:rgba(255,255,255,.1);padding:4px 10px;border-radius:6px;">우클릭 → 이미지 저장</span>';
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'margin-left:auto;background:#dc2626;color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-weight:700;';
  closeBtn.onclick = function(){ modal.remove(); };
  hdr.appendChild(closeBtn);

  var scroll = document.createElement('div');
  scroll.style.cssText = 'display:flex;gap:16px;padding:16px;overflow-x:auto;flex:1;align-items:flex-start;';

  chunks.forEach(function(chunk){
    // 섹션 이미지들을 Canvas로 합치기
    var card = document.createElement('div');
    card.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:8px;align-items:center;';

    var lbl = document.createElement('div');
    lbl.style.cssText = 'color:#fff;font-size:12px;font-weight:700;';
    lbl.textContent = 'Part '+chunk.index+' ('+chunk.sections.length+'섹션)';

    var dlBtn = document.createElement('a');
    dlBtn.style.cssText = 'background:#16a34a;color:#fff;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;';
    dlBtn.textContent = '⬇ 다운로드';
    dlBtn.download = 'part'+chunk.index+'.jpg';

    // Canvas로 섹션들 합치기
    var totalH = chunk.sections.reduce(function(s,sec){return s+sec.height;},0);
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = totalH;
    canvas.style.cssText = 'max-height:70vh;width:auto;border:2px solid rgba(255,255,255,.2);border-radius:4px;display:block;cursor:pointer;';
    canvas.title = '우클릭 → 이미지를 다른 이름으로 저장';

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, totalH);

    var y = 0;
    var promises = chunk.sections.map(function(sec){
      return new Promise(function(resolve){
        var img = new Image();
        var capturedY = y;
        y += sec.height;
        img.onload = function(){
          ctx.drawImage(img, 0, capturedY);
          resolve();
        };
        img.src = 'data:image/jpeg;base64,' + sec.data;
      });
    });

    Promise.all(promises).then(function(){
      dlBtn.href = canvas.toDataURL('image/jpeg', 0.97);
    });

    card.appendChild(lbl); card.appendChild(dlBtn); card.appendChild(canvas);
    scroll.appendChild(card);
  });

  modal.appendChild(hdr); modal.appendChild(scroll);
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
}

// ── 저장 버튼 연결 ──────────────────────────────────────────────────────────
function saveServer(opts){ captureViaServer(opts); }

function toggleMobilePreview(btn){
  var pv=document.getElementById('preview'); if(!pv) return;
  var on=pv.classList.toggle('for-mobile-capture');
  if(btn){
    btn.style.background = on ? '#2563eb' : '';
    btn.style.color = on ? '#fff' : '';
    btn.style.borderColor = on ? '#2563eb' : '';
  }
  showHint(on ? '👁 모바일 최적화 미리보기 ON (저장 시 모습)' : '👁 일반 편집 모드');
}

// ── 템플릿 저장/불러오기 + HTML import ──────────────────────────────────────
var TPL_KEY='dps_templates_v1';
function tplList(){ try{ return JSON.parse(localStorage.getItem(TPL_KEY)||'[]'); }catch(e){ return []; } }
function tplSaveAll(arr){ try{ localStorage.setItem(TPL_KEY, JSON.stringify(arr)); return true; }catch(e){ alert('저장 실패: 용량 초과(브라우저 5~10MB 한계). 이미지 줄이거나 JSON 다운로드를 사용하세요.'); return false; } }

function tplSnapshot(name){
  var pv=document.getElementById('preview'); if(!pv) return null;
  // 오버레이 제거된 클린 HTML 추출
  var clone=pv.cloneNode(true);
  clone.querySelectorAll('.sec-ov,.iz-ov,.resize-bar,.tf-handle,.tf-dim,.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
  return {
    name:name||'무제',
    font:(document.getElementById('font-sel')||{}).value||"'Pretendard',sans-serif",
    width:parseInt(pv.style.width)||860,
    html:clone.innerHTML,
    savedAt:new Date().toISOString()
  };
}

function rebindPreview(){
  var pv=document.getElementById('preview'); if(!pv) return;
  pv.querySelectorAll(':scope > .sec-wrap').forEach(function(sec){
    var type=sec.dataset.secType;
    var meta=(typeof SEC_META!=='undefined'&&SEC_META[type])||{label:type||''};
    sec.querySelectorAll('.sec-ov').forEach(function(o){o.remove();});
    sec.appendChild(buildSecOv(sec,meta));
    sec.querySelectorAll('.iz').forEach(function(iz){
      iz.querySelectorAll('.iz-ov').forEach(function(o){o.remove();});
      buildIzOverlay(iz);
      addBar(iz);
      var tf=iz.querySelector('.tf-wrap');
      if(tf) bindTF(tf,iz);
    });
    sec.querySelectorAll('[contenteditable]').forEach(function(el){ bindFT(el); });
  });
  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
}

function tplApply(tpl){
  if(!tpl||!tpl.html){ alert('템플릿 데이터가 비어있습니다'); return; }
  var pv=document.getElementById('preview'); if(!pv) return;
  pv.innerHTML=tpl.html;
  if(tpl.width){ pv.style.width=tpl.width+'px'; }
  if(tpl.font){
    var sel=document.getElementById('font-sel');
    if(sel){ sel.value=tpl.font; }
    applyFont(tpl.font);
  }
  rebindPreview();
  showHint('✅ '+(tpl.name||'템플릿')+' 불러옴');
  closeTplModal();
}

function tplSaveCurrent(){
  var input=document.getElementById('tpl-name-input');
  var name=(input&&input.value||'').trim();
  if(!name){ alert('템플릿 이름을 입력하세요'); return; }
  var snap=tplSnapshot(name); if(!snap) return;
  var arr=tplList();
  var idx=arr.findIndex(function(t){return t.name===name;});
  if(idx>=0){
    if(!confirm('"'+name+'" 이름이 이미 있습니다. 덮어쓸까요?')) return;
    arr[idx]=snap;
  } else { arr.push(snap); }
  if(tplSaveAll(arr)){
    if(input) input.value='';
    renderTplList();
    showHint('✅ "'+name+'" 저장됨');
  }
}

function tplDelete(name){
  if(!confirm('"'+name+'" 삭제할까요?')) return;
  var arr=tplList().filter(function(t){return t.name!==name;});
  tplSaveAll(arr); renderTplList();
}

function tplExportJSON(name){
  var arr=tplList(); var t=arr.find(function(x){return x.name===name;});
  if(!t){ alert('템플릿 없음'); return; }
  var b=new Blob([JSON.stringify(t,null,2)],{type:'application/json;charset=utf-8'});
  var u=URL.createObjectURL(b);
  var a=document.createElement('a'); a.href=u; a.download='template-'+name.replace(/[^a-z0-9가-힣_-]/gi,'_')+'.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
}

function tplImportFile(file){
  if(!file){ return; }
  var reader=new FileReader();
  reader.onload=function(){
    var txt=reader.result+'';
    var tpl=null;
    if(/\.json$/i.test(file.name)){
      try{ tpl=JSON.parse(txt); }
      catch(e){ alert('JSON 파싱 실패: '+e.message); return; }
    } else if(/\.html?$/i.test(file.name)){
      // saveHTML로 저장된 파일 → #preview 안 sec-wrap 추출
      var doc=new DOMParser().parseFromString(txt,'text/html');
      var srcPv=doc.getElementById('preview');
      if(!srcPv){ alert('업로드한 HTML에 #preview 요소가 없습니다'); return; }
      // 오버레이 제거
      srcPv.querySelectorAll('.sec-ov,.iz-ov,.resize-bar,.tf-handle,.tf-dim').forEach(function(el){el.remove();});
      tpl={
        name:file.name.replace(/\.html?$/i,''),
        font:"'Pretendard',sans-serif",
        width:parseInt(srcPv.style.width)||860,
        html:srcPv.innerHTML
      };
    } else {
      alert('JSON 또는 HTML 파일만 지원합니다');
      return;
    }
    if(!confirm('현재 작업을 덮어쓰고 "'+(tpl.name||'파일')+'"을 불러올까요?\n(저장 안 한 내용은 사라집니다)')) return;
    tplApply(tpl);
  };
  reader.readAsText(file,'utf-8');
}

function _tplRowEsc(s){ return (s||'').replace(/[<>&"]/g, function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); }
function _tplFromRow(btn){
  var row=btn.closest('.tpl-row'); if(!row) return null;
  var arr=row.parentNode._tpls; if(!arr) return null;
  return arr[+row.dataset.i];
}
function tplLoadByRow(btn){ var t=_tplFromRow(btn); if(t) tplApply(t); }
function tplExportByRow(btn){ var t=_tplFromRow(btn); if(t) tplExportJSON(t.name); }
function tplDeleteByRow(btn){ var t=_tplFromRow(btn); if(t) tplDelete(t.name); }
function renderTplList(){
  var box=document.getElementById('tpl-list'); if(!box) return;
  var arr=tplList().slice().sort(function(a,b){return (b.savedAt||'').localeCompare(a.savedAt||'');});
  box._tpls=arr;
  if(arr.length===0){
    box.innerHTML='<div style="padding:24px;text-align:center;color:#94a3b8;font-size:12px;">저장된 템플릿이 없습니다</div>';
    return;
  }
  box.innerHTML=arr.map(function(t,i){
    var when=(t.savedAt||'').slice(0,16).replace('T',' ');
    return '<div class="tpl-row" data-i="'+i+'">'
      +'<div class="tpl-row-info"><div class="tpl-row-name">'+_tplRowEsc(t.name)+'</div><div class="tpl-row-meta">'+when+' · '+(t.width||860)+'px</div></div>'
      +'<div class="tpl-row-acts">'
      +'<button class="tpl-row-btn load" onclick="tplLoadByRow(this)">불러오기</button>'
      +'<button class="tpl-row-btn export" onclick="tplExportByRow(this)">JSON</button>'
      +'<button class="tpl-row-btn del" onclick="tplDeleteByRow(this)">삭제</button>'
      +'</div></div>';
  }).join('');
}

function openTplModal(){
  var m=document.getElementById('tpl-modal'); if(!m) return;
  m.style.display='flex';
  renderTplList();
}
function closeTplModal(){
  var m=document.getElementById('tpl-modal'); if(m) m.style.display='none';
}

/*INIT_BEGIN*/(function(){
  var TYPES=['banner','hero','trust','proof','copy','infl','feat','duo','wearing','mood','angle','compare','story','style','pkg','size','info','wash','pd','faq','footer'];
  var preview=document.getElementById('preview');
  if(!preview){alert('❌ #preview 요소를 찾을 수 없습니다');return;}
  preview.innerHTML='';
  var ok=0, fail=[];
  for(var i=0;i<TYPES.length;i++){
    try{
      addSection(TYPES[i]);
      ok++;
    }catch(err){
      fail.push(TYPES[i]+': '+err.message);
      console.error('Section error:',TYPES[i],err);
    }
  }
  if(ok===0){
    // 전체 실패 시 화면에 표시
    preview.innerHTML='<div style="padding:40px;color:#dc2626;font-family:sans-serif;">'
      +'<h2>⚠️ 섹션 로드 실패</h2>'
      +'<p>'+fail.join('<br>')+'</p>'
      +'<button onclick="location.reload()" style="margin-top:16px;padding:10px 20px;background:#4f9cf9;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🔄 새로고침</button>'
      +'</div>';
  } else if(fail.length>0){
    console.warn('일부 섹션 실패:', fail);
  }
  try{renderEPCats(Object.keys(EP_CATS)[0]);}catch(e){console.warn('EP 초기화 오류:',e);}
  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
  // 전체 텍스트 툴바 연결
  setTimeout(function(){
    document.querySelectorAll('#preview [contenteditable]').forEach(function(el){
      if(typeof bindFT==='function')bindFT(el);
    });
  }, 500);
})();/*INIT_END*/