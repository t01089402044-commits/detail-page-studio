
const SEC_TMPL = {
  banner:()=>`<div class="sec-wrap s-banner">
    <div class="s-banner-season" contenteditable data-ph="?�즌 ?�스??>2025 SS NEW ARRIVAL</div>
    <div class="s-banner-kr" contenteditable data-ph="?�품�? style="font-family:var(--pf,'Noto Sans KR',sans-serif)">?�품명을 ?�기???�력?�주?�요</div>
    <div class="s-banner-en" contenteditable data-ph="?�문 부??>Crafted for everyday excellence.</div>
  </div>`,
  hero:()=>`<div class="sec-wrap s-hero">${izNew('메인 ?�어�??��?지','860 × 1000px',700)}</div>`,
  trust:()=>`<div class="sec-wrap s-trust">
    ${['?��,무료배송,5만원 ?�상<br>???�품 무료','???�일출발,?�후 2???�전<br>주문 ?�일 발송','?��,무료 교환·반품,?�령 ??14???�내<br>무료 처리','?��?��,�?�� ?�산,Made in Korea<br>�?�� ?�조·관�?].map(s=>{
      const[ico,nm,desc]=s.split(',');
      return`<div class="s-trust-item" style="position:relative"><button class="del-btn" onclick="delItem('s-trust-item',this)">??/button><button class="add-btn" onclick="addTrustItem()">+</button><button class="ico-btn" onclick="openEP(this.closest('.s-trust-item').querySelector('.icon-editable'),event)">?�� ?�이�?/button><div class="s-trust-ico icon-editable" onclick="openEP(this,event)">${ico}</div><div class="s-trust-name" contenteditable>${nm}</div><div class="s-trust-desc" contenteditable>${desc}</div></div>`;
    }).join('')}
  </div>`,
  copy:()=>`<div class="sec-wrap s-copy">
    <div class="s-copy-eye" contenteditable>Brand Story</div>
    <div class="s-copy-quote" contenteditable>"??�??�으�??�게 ?�는<br><em>�?차이</em>"</div>
    <div class="s-copy-line"></div>
    <div class="s-copy-body" contenteditable>매일 꺼내 ?�고 ?�어지???�이 ?�습?�다. ?�별?��? ?�아?? ?�려?��? ?�아?????�는 ?�간 ???�걸 골랐?��? ?�게 ?�는 그런 ?? 좋�? ?�재?� ?�직???�작??만든 결과?�니??</div>
  </div>`,
  proof:()=>`<div class="sec-wrap s-proof">
    ${[['4.9??,'Rating'],['2,841�?,'Review'],['71%','Repurchase'],['12K+','Sold']].map(([n,l])=>`<div class="s-proof-item" style="position:relative"><button class="del-btn" onclick="delItem('s-proof-item',this)">??/button><button class="add-btn" onclick="addProofItem()">+</button><div class="s-proof-num" contenteditable>${n}</div><div class="s-proof-lbl" contenteditable>${l}</div></div>`).join('')}
  </div>`,
  feat:()=>`<div class="sec-wrap s-feat">
    <div class="sec-lbl" contenteditable>Feature</div>
    <div class="s-feat-grid">
    ${[['?��','?�징 1 ?�목','?�품???�심 ?�징???�력?�세??'],['?��','?�징 2 ?�목','?�재, ?�구?? 착용�??�을 강조?�니??'],['?�️','?�징 3 ?�목','?�자?? ?? ?�루???�을 ?�명?�니??'],['?��','?�징 4 ?�목','관�??�의?? ?�용?�을 강조?�니??'],['?��','?�징 5 ?�목','계절?? ?�용?��? ?�명?�니??'],['?��','?�징 6 ?�목','?�질 ?�증 ???�뢰 ?�용???�습?�다.']].map(([ico,nm,desc])=>`<div class="s-feat-item" style="position:relative"><button class="del-btn" onclick="delItem('s-feat-item',this)">??/button><button class="add-btn" onclick="addFeatItem()">+</button><div class="s-feat-ico-wrap"><div class="s-feat-ico icon-editable" onclick="openEP(this,event)">${ico}</div><button class="s-feat-ico-del" onclick="event.stopPropagation();this.previousElementSibling.textContent=''" title="?�이�???��">??/button></div><div class="s-feat-name" contenteditable>${nm}</div><div class="s-feat-desc" contenteditable>${desc}</div>${izNew('?�징 ?��?지','860 × 960px',437)}</div>`).join('')}
    </div>
    <div class="s-feat-img-rows" id="feat-img-rows">
      <!-- ?��?지 ???�적 추�? -->
    </div>
  </div>`,
  compare:()=>`<div class="sec-wrap s-compare">
    <div><div class="sec-en" contenteditable>The Difference You Feel</div><div class="sec-kr" contenteditable>직접 비교?�보?�요</div></div>
    <div class="s-cmp-wrap">
      <div class="s-cmp-col" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-col',this)">??/button>${izNew('?�반 ?�재','430 × 560px',500)}<div class="s-cmp-badge b" contenteditable>?�반 ?�품</div></div>
      <div class="s-cmp-col" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-col',this)">??/button>${izNew('�??�품 ?�재','430 × 560px',500)}<div class="s-cmp-badge a" contenteditable>�??�품</div></div>
      <div class="s-cmp-vs">VS</div>
    </div>
    <div class="s-cmp-desc">
      <div class="s-cmp-desc-item" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-desc-item',this)">??/button><div class="s-cmp-desc-name" contenteditable>?�반 ?�품</div><div class="s-cmp-desc-txt" contenteditable>비교 ?�???�품 ?�명???�력?�세??</div></div>
      <div class="s-cmp-desc-item" style="position:relative"><button class="del-btn" onclick="delItem('s-cmp-desc-item',this)">??/button><div class="s-cmp-desc-name" contenteditable>�??�품</div><div class="s-cmp-desc-txt" contenteditable>�??�품???�수???�을 ?�명?�세??</div></div>
    </div>
    <div class="feat-row-add-wrap">
      <button class="feat-row-add-btn" onclick="addFeatItem();addFeatItem()">�???추�? (2�?</button>
    </div>
  </div>`,
  wearing:()=>`<div class="sec-wrap s-wearing">
    <div class="s-wearing-lbl"><div class="s-wearing-en" contenteditable>Wearing Shot</div><div class="s-wearing-kr" contenteditable>착용�?/div></div>
    ${izNew('메인 착용 ?��?,'860 × 960px',546)}
  </div>`,
  duo:()=>`<div class="sec-wrap s-duo">
    ${izNew('착용�?1','50% × 680px',400)}
    ${izNew('착용�?2','50% × 680px',400)}
  </div>`,
  angle:()=>`<div class="sec-wrap s-angle">
    <div class="sec-hd-wrap"><div class="sec-en" contenteditable>360° View</div><div class="sec-kr" contenteditable>?�면 · ?�면 · 측면 · ?�테??/div></div>
    <div class="s-angle-grid">
    ${[['?�면 (Front)','Front','?�면'],['?�면 (Back)','Back','?�면'],['측면 (Side)','Side','측면'],['?�테??,'Detail','?�테??]].map(([lbl,en,kr])=>`<div class="s-angle-cell" style="position:relative"><button class="del-btn" onclick="delItem('s-angle-cell',this)">??/button>${izNew(lbl,'430 × 520px',260)}<div class="s-angle-label"><div class="s-angle-label-en" contenteditable>${en}</div><div class="s-angle-label-kr" contenteditable>${kr}</div></div></div>`).join('')}
    </div>
  </div>`,
  mood:()=>`<div class="sec-wrap s-mood">
    <div class="s-mood-hd" style="padding:48px 40px 0 40px;"><div class="sec-en" contenteditable>Wear it everywhere.</div><div class="sec-kr" contenteditable>?�디?�든, ?�떤 ?�에??/div></div>
    <div class="s-mood-main">
      ${izNew('메인 무드�?,'860 × 720px',430)}

    </div>
    <div class="s-mood3">
    ${[['Casual','?�일�?],['Work','출근'],['Weekend','주말']].map(([s,t])=>`<div class="s-mood3-card" style="position:relative"><button class="del-btn" onclick="delItem('s-mood3-card',this)">??/button><button class="add-btn" onclick="addMood3Card()">+</button>${izNew('무드�?,'287 × 440px',390)}<div class="s-mood3-ov"></div><div class="s-mood3-copy"><div class="s-mood3-sit" contenteditable>${s}</div><div class="s-mood3-title" contenteditable>${t}</div></div></div>`).join('')}
    </div>
  </div>`,
  infl:()=>`<div class="sec-wrap s-infl">
    <div><div class="sec-en" contenteditable>As seen on Influencers</div><div class="sec-kr" contenteditable>?�플루언??착용�?/div></div>
    <div class="s-infl-grid-top">
      <div class="s-infl-card" style="flex:1.5;position:relative"><button class="del-btn" onclick="delItem('s-infl-card',this)">??/button>${izNew('?�???�플루언??,'516 × 560px',500)}<div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer_main</div><div class="s-infl-tag" contenteditable>?�로??12.4�?· ?�션 ?�리?�이??/div></div></div>
      <div class="s-infl-card" style="flex:1;position:relative"><button class="del-btn" onclick="delItem('s-infl-card',this)">??/button>${izNew('?�플루언??2','344 × 560px',500)}<div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer_2</div><div class="s-infl-tag" contenteditable>?�로??8.7�?· ?�이?�스?�??/div></div></div>
    </div>
    <div class="s-infl-grid-bot" style="display:flex;gap:4px;margin-top:4px;">
    ${[['a','?�오?�디'],['b','?�일리룩'],['c','미니멀']].map(([s,t])=>`<div class="s-infl-card" style="flex:1;position:relative"><button class="del-btn" onclick="delItem('s-infl-card',this)">\u2715</button>${izNew('?�브 '+s,'287 × 340px',300)}<div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer_${s}</div><div class="s-infl-tag" contenteditable>#${t}</div></div></div>`).join('')}
    </div>

  </div>`,
  story:()=>`<div class="sec-wrap s-story">
    <div class="s-story-main">
      <div class="s-story-img">${izNew('?�재 메인 ?��?지','516 × 640px',570)}</div>
      <div class="s-story-txt">
        <div class="s-story-label" contenteditable>Material Story</div>
        <div class="s-story-title" contenteditable>?�재 ?�나?�도<br>?�?�하지 ?�습?�다</div>
        <div class="s-story-body" contenteditable>?�재?� ?�작 과정???�??브랜?�의 철학�??�토리�? ?�력?�세?? ?�디???�재�?조달?�는지, ?�떤 공정??거치?��?, ?????�재�??�택?�는지 ??진정???�는 ?�야기�? 고객???�뢰�??�습?�다.</div>
        <div class="s-story-divider"></div>
        <div class="s-story-spec" contenteditable>?�재 · ?�용???�력?�세??br>?�산지 · ?�용???�력?�세??br>?�증 · ?�용???�력?�세??/div>
      </div>
    </div>
    <div class="s-story-sub">
      ${izNew('?�재 ?�브 1','430 × 440px',390)}
      ${izNew('?�재 ?�브 2','430 × 440px',390)}
    </div>
  </div>`,
  style:()=>`<div class="sec-wrap s-style">
    <div><div class="sec-en" contenteditable>Styling Guide</div><div class="sec-kr" contenteditable>?�렇�?매치?�세??/div></div>
    <div class="s-style-grid">
    ${[['Daily Casual','?�일�?],['Smart Casual','?�마??],['Feminine','?��???]].map(([m,t])=>`<div class="s-style-card" style="position:relative"><button class="del-btn" onclick="delItem('s-style-card',this)">??/button><button class="add-btn" onclick="addStyleCard()">+</button>${izNew('?��??�링','267 × 400px',360)}<div class="s-style-body"><div class="s-style-mood" contenteditable>${m}</div><div class="s-style-title" contenteditable>${t}</div><div class="s-style-items" contenteditable>?�이??1 + ?�이??2</div></div></div>`).join('')}
    </div>
  </div>`,
  pkg:()=>`<div class="sec-wrap s-pkg">
    <div class="s-pkg-grid">
      <div class="s-pkg-img">${izNew('?�키지 ?��?지','430 × 420px',375)}</div>
      <div class="s-pkg-txt">
        <div class="s-pkg-label" contenteditable>Packaging &amp; Delivery</div>
        <div class="s-pkg-title" contenteditable>받는 ?�간부??br>?�별??경험</div>
        <ul class="s-pkg-list">
          ${['친환�?박스 ?�장','?�후 2???�전 주문 ???�일 출고','?�국 1~2?????�령','5�????�상 무료배송','?�령 ??14???�내 무료 교환·반품'].map(t=>`<li contenteditable>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>`,
  size:()=>{
  return '<div class="sec-wrap s-size">'
    +'<div class="s-size-title" contenteditable>Size Guide</div>'
    +'<div class="s-size-ctrl">'
    +'<span class="s-size-ctrl-lbl">?�리??</span>'
    
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'?�류\')">?�류</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'가�?')">가�?/button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'?�발\')">?�발</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'?�말\')">?�말</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'모자\')">모자</button>'
    +'<button class="size-preset-btn" onclick="applyPreset(this.closest(\'.s-size\'),\'바�?\')">바�?</button>'
    +'<span class="s-size-ctrl-sep"></span>'
    +'<button class="size-ctrl-btn" onclick="sizeAddRow(this.closest(\'.s-size\'))">+ ??/button>'
    +'<button class="size-ctrl-btn" onclick="sizeDelRow(this.closest(\'.s-size\'))">????/button>'
    +'<button class="size-ctrl-btn" onclick="sizeAddCol(this.closest(\'.s-size\'))">+ ??/button>'
    +'<button class="size-ctrl-btn" onclick="sizeDelCol(this.closest(\'.s-size\'))">????/button>'
    +'</div>'
    +'<div class="s-size-wrap"><div class="s-size-img">'+izNew('??가?�드 ?��?지','430 × 560px',500)+'</div>'
    +'<div><table class="s-size-tbl"><thead><tr>'
    +['Size','총장','가??,'?�깨','?�매'].map(function(h){return '<th contenteditable>'+h+'</th>';}).join('')
    +'</tr></thead><tbody>'
    +['XS','S','M','L','XL'].map(function(s,i){
      return '<tr'+(i===2?' class="highlight"':'')+'>'
        +[s,'??,'??,'??,'??].map(function(v){return '<td contenteditable>'+v+'</td>';}).join('')+'</tr>';
    }).join('')
    +'</tbody></table>'
    +'<div class="s-model-info"><div class="s-model-info-title">Model Size</div>'
    +'<div class="s-model-info-body" contenteditable>168cm · 52kg · M ?�이�?착용</div></div>'
    +'<div class="s-size-note" contenteditable>???�위: cm / 측정 방법???�라 1~2cm ?�차가 발생?????�습?�다.</div>'
    +'</div></div></div>';
},
  info:()=>`<div class="sec-wrap s-info">
    <div class="s-info-title" contenteditable>Information</div>
    <table class="s-info-tbl">
      <tr><td class="s-info-key" contenteditable>Season</td><td><div class="ck-group"><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Spring/Autumn</span></div><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Summer</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Winter</span></div></div></td></tr>
      <tr><td class="s-info-key" contenteditable>Fit</td><td><div class="ck-group"><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Slim</span></div><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Regular</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Oversize</span></div></div></td></tr>
      <tr><td class="s-info-key" contenteditable>Thickness</td><td><div class="ck-group"><div class="ck on"><div class="ck-box"></div><span class="ck-txt" contenteditable>Thin</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Regular</span></div><div class="ck"><div class="ck-box"></div><span class="ck-txt" contenteditable>Heavy</span></div></div></td></tr>
      <tr><td class="s-info-key" contenteditable>Fabric</td><td class="s-info-val" contenteditable>?�재�??�력?�세??/td></tr>
      <tr><td class="s-info-key" contenteditable>Color</td><td class="s-info-val" contenteditable>컬러�??�력?�세??/td></tr>
      <tr><td class="s-info-key" contenteditable>Size</td><td class="s-info-val" contenteditable>XS / S / M / L / XL</td></tr>
      <tr><td class="s-info-key" contenteditable>Origin</td><td class="s-info-val" contenteditable>Korea</td></tr>
    </table>
  </div>`,
  wash:()=>`<div class="sec-wrap s-wash">
    <div class="s-wash-title" contenteditable>Washing &amp; Care</div>
    <div class="s-wash-icons">${['?��','?��','?��','?���?,'??].map(ic=>`<div class="s-wash-ico icon-editable" onclick="openEP(this,event)">${ic}</div>`).join('')}</div>
    <div class="s-wash-note" contenteditable>1. ?�탁 방법 주의?�항???�력?�주?�요.<br>2. ?�탁 방법 주의?�항???�력?�주?�요.<br>3. ?�탁 방법 주의?�항???�력?�주?�요.</div>
  </div>`,
  faq:()=>`<div class="sec-wrap s-faq">
    <div><div class="sec-en" contenteditable>FAQ</div><div class="sec-kr" contenteditable>?�주 묻는 질문</div></div>
    ${[['Q. ?�이즈�? ?�게 ?�오?�요?','?�반?�인 ?�국 ?�류 기�? ?�이즈입?�다. ?�무 ?�렁?�거???�?�트?��? ?��? ?�귤???�으�?기획?��??��?�??�소 ?�이즈�? ?�택?�시�??�니??'],['Q. 배송?� ?�마??걸리?�요?','?�후 2???�전 결제 ???�일 출고?�며, ?�국 1~2?????�령 가?�합?�다.'],['Q. 교환·반품??가?�한가??','?�령 ??14???�내 교환·반품 ?�청??가?�합?�다.']].map(([q,a])=>`<div class="s-faq-item" style="position:relative"><button class="del-btn" onclick="delItem('s-faq-item',this)">??/button><button class="add-btn" onclick="addFaqItem()">+</button><div class="s-faq-q" onclick="this.parentElement.classList.toggle('open')"><span class="s-faq-q-txt" contenteditable>${q}</span><span class="s-faq-arr">??/span></div><div class="s-faq-a" contenteditable>${a}</div></div>`).join('')}
  </div>`,
  pd:()=>`<div class="sec-wrap s-pd">
    <div class="s-pd-hd"><div class="s-pd-hd-title" contenteditable>Product Detail</div></div>
    <div class="s-pd-full">${izNew('?�테???�로즈업 1','860 × 840px',300)}</div>
    <div class="s-pd-2col">${izNew('?�테??2','430 × 700px',250)}${izNew('?�테??3','430 × 700px',250)}</div>
    <div class="s-pd-3col">${izNew('?�테??4','287 × 500px',300)}${izNew('?�테??5','287 × 500px',300)}${izNew('?�테??6','287 × 500px',300)}</div>
  </div>`,
  img_only:()=>`<div class="sec-wrap s-img-only">${izNew('?��?지','860 × auto',360)}</div>`,
  footer:()=>`<div class="sec-wrap s-footer">
    ${['모니???�상???�는 모바???�경???�라 ?�제 ?�품 ?�상�??�소 차이가 ?�을 ???�습?�다.','?�이�?측정 방법???�라 1~2cm ?�차가 발생?????�습?�다.','?�품 ?�령 ??14???�내 교환·반품 ?�청??가?�합?�다.','불량·?�배?�의 경우 ?�액 ?�불 ?�는 교환 처리???�립?�다.'].map(t=>`<p contenteditable>${t}</p>`).join('')}
  </div>`,
};
const SEC_META = {
  banner:{label:'컬렉??배너',icon:'ti-tag'},
  hero:{label:'?�어�??��?지',icon:'ti-home'},
  trust:{label:'구매 ?�심 배�?',icon:'ti-shield-check'},
  copy:{label:'감성 카피',icon:'ti-quote'},
  proof:{label:'?�셜 증명',icon:'ti-chart-bar'},
  feat:{label:'기능 그리??,icon:'ti-list'},
  compare:{label:'?�재 비교',icon:'ti-scale'},
  wearing:{label:'착용 ?��?,icon:'ti-shirt'},
  duo:{label:'2???��?지',icon:'ti-layout-columns'},
  angle:{label:'?�각??�?,icon:'ti-rotate-360'},
  mood:{label:'무드�?,icon:'ti-photo'},
  infl:{label:'?�플루언??,icon:'ti-users'},
  story:{label:'브랜???�토�?,icon:'ti-book'},
  style:{label:'?��??�링 가?�드',icon:'ti-hanger'},
  pkg:{label:'?�키지·배송',icon:'ti-package'},
  size:{label:'?�이�?가?�드',icon:'ti-ruler'},
  info:{label:'?�품 ?�보??,icon:'ti-info-circle'},
  wash:{label:'?�탁 방법',icon:'ti-wash'},
  faq:{label:'FAQ',icon:'ti-help-circle'},
  pd:{label:'?�품 ?�테??,icon:'ti-zoom-in'},
  img_only:{label:'?��?지�?,icon:'ti-photo-scan'},
  footer:{label:'?�의?�항 ?�터',icon:'ti-file-text'},
};

// ?�역 ?�태 (var - 중복 ?�언 ?�용)
var _uid=0,_jpgScale=1,_ftEl=null,_epEl=null,_aiResult=null,_slotBusy=false;
var BG_COLORS=['#ffffff','#0c0c0c','#f8f8f8','#f5f5f5','#f9f9f9','#1a1a2e','#16213e','#0f3460','#1a2e1a','#2d1b1b','#e8f5e9','#fff3e0','#fce4ec','#e3f2fd','#f3e5f5','#e8eaf6','#fff8e1','#e0f7fa','#f9fbe7','#fbe9e7','#111111','#222222','#333333','#555555','#888888','#fffef0','#fff9f0','#f0fff4','#f0f4ff','#fff0f0'];

// ?�틸
function nextId(){return 'sec_'+(++_uid);}
function showHint(msg){var h=document.getElementById('hint');h.textContent=msg;h.style.opacity='1';clearTimeout(h._t);h._t=setTimeout(function(){h.style.opacity='0';},2500);}
function setW(w,btn){document.getElementById('preview').style.width=w+'px';document.querySelectorAll('.wb-btn').forEach(function(b){b.classList.remove('act');});if(btn)btn.classList.add('act');}
function switchTab(t){document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.toggle('act',b.dataset.tab===t);});document.querySelectorAll('.tab-pane').forEach(function(p){p.classList.toggle('act',p.id==='tab-'+t);});}
function applyFont(v){
  if(!v) return;
  var pv=document.getElementById('preview');
  if(!pv) return;
  // 부?�러???�환???�한 transition 추�?
  if(!pv.style.transition.includes('font-family')){
    pv.style.transition = (pv.style.transition||'') + ', font-family 0.2s ease';
  }
  pv.style.fontFamily=v;
  pv.style.setProperty('--pf',v);
}

// ?�?� 커스?� ?�트 ?�커 (?�버 ?�리�? ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
var _fontCommitted = "'Gmarket Sans',sans-serif";
function fontPickerToggle(e){
  e&&e.stopPropagation();
  var dd=document.getElementById('font-dropdown'); if(!dd) return;
  dd.style.display = (dd.style.display==='block') ? 'none' : 'block';
  _markCommittedOpt();
}
function fontPickerRevert(){ applyFont(_fontCommitted); }
function fontPickerClose(){
  var dd=document.getElementById('font-dropdown'); if(dd) dd.style.display='none';
}
function _markCommittedOpt(){
  document.querySelectorAll('.font-opt').forEach(function(o){
    o.classList.toggle('committed', o.dataset.v===_fontCommitted);
  });
}
document.addEventListener('click', function(e){
  if(e.target.closest('#font-picker-btn')||e.target.closest('#font-dropdown')) return;
  fontPickerClose();
});
function _initFontPicker(){
  var dd=document.getElementById('font-dropdown'); if(!dd) return;
  dd.addEventListener('mouseover', function(e){
    var opt=e.target.closest('.font-opt'); if(!opt) return;
    applyFont(opt.dataset.v);
  });
  dd.addEventListener('click', function(e){
    var opt=e.target.closest('.font-opt'); if(!opt) return;
    _fontCommitted = opt.dataset.v;
    var lbl=document.getElementById('font-picker-label');
    if(lbl){ lbl.textContent = opt.dataset.l||opt.textContent.trim(); lbl.style.fontFamily = opt.dataset.v; }
    applyFont(_fontCommitted);
    _markCommittedOpt();
    fontPickerClose();
    showHint('???�트: '+(opt.dataset.l||'').replace(/\s*\(.*\)$/,''));
  });
  _markCommittedOpt();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', _initFontPicker);
else _initFontPicker();
function openAddModal(){var m=document.getElementById('add-modal');if(m)m.classList.add('show');}
function closeAddModal(){var m=document.getElementById('add-modal');if(m)m.classList.remove('show');}
function setJpgScale(s,btn){_jpgScale=s+1;document.querySelectorAll('#jpg-1x,#jpg-2x').forEach(function(b){b.classList.remove('act');});if(btn)btn.classList.add('act');}
const TF={active:null,drag:null};

// ?�축??dataURL???�버(/api/upload)�?보내 FTP???�????public URL 반환
function uploadToFTP(dataURL){
  return fetch('/api/upload', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dataURL:dataURL})
  }).then(function(r){
    if(!r.ok){
      return r.json().then(function(j){ throw new Error(j.error || ('upload '+r.status)); },
                           function(){ throw new Error('upload '+r.status); });
    }
    return r.json();
  }).then(function(j){
    if(!j||!j.url) throw new Error('?�버 ?�답??url ?�음');
    return j.url;
  });
}

// ?��?지 처리: ?�본 그�?�?FTP???�로??(?�상??100% ?��?, 리사?�즈/?�인코딩 ?�음)
// naturalWidth/Height�?측정?�서 initTF???�달. ?�로???�패 ??dataURL??fallback?�로 ?�용
function compressImage(file, cb){
  var reader=new FileReader();
  reader.onload=function(e){
    var src=e.target.result;
    var img=new Image();
    img.onload=function(){
      var w=img.naturalWidth, h=img.naturalHeight;
      showHint('???��?지 ?�로??�?..');
      uploadToFTP(src).then(function(url){
        showHint('???�로???�료');
        cb(url, w, h);
      }).catch(function(err){
        console.warn('FTP ?�로???�패 ??dataURL fallback:', err && err.message);
        showHint('???�로???�패 ???�시 미리보기 ?�용');
        cb(src, w, h);
      });
    };
    img.src=src;
  };
  reader.readAsDataURL(file);
}

function pv(input){
  if(!input.files||!input.files[0])return;
  var zone=input.closest?input.closest('.iz'):input.parentElement;
  compressImage(input.files[0], function(src,nW,nH){
    initTF(zone,src,nW,nH);
  });
}

function initTF(zone,src,nW,nH){
  zone.querySelector('.tf-wrap')?.remove();
  zone.querySelector('.iz-del')?.remove();
  // ?��?지 ?�로????iz ?��? ?�선 ?�두�?배경 ?�거
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
  badge.textContent='??Shift = ?�유변??;
  wrap.appendChild(badge);
  // Hide placeholder
  const inner=zone.querySelector('.iz-in');
  if(inner)inner.style.display='none';
  // Add delete button
  const del=document.createElement('button');
  del.className='iz-del';
  del.innerHTML='?��';
  del.onclick=e=>{e.stopPropagation();if(confirm('?��?지�???��?�까??')){wrap.remove();del.remove();if(inner)inner.style.display='';zone.querySelectorAll('.iz-ov').forEach(o=>o.style.display='');const fi2=zone.querySelector('input[type=file]');if(fi2){fi2.style.pointerEvents='';fi2.style.opacity='0';}}};
  zone.appendChild(del);
  zone.appendChild(wrap);
  tfSelect(wrap,zone);
  bindTF(wrap,zone);
  // ?��?지 ?�로????input?� z-index�?조정 (?�릭 ?�벤??방�?)
  const fileInput=zone.querySelector('input[type=file]');
  if(fileInput){fileInput.style.pointerEvents='none';fileInput.style.opacity='0';}
  showHint('???�래�? ?�동 · ?�들: ?�기 조절 · Shift: 비율 ?�유변??· Esc: ?�정');
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
    compressImage(tmp.files[0], function(src,nW,nH){
      initTF(iz,src,nW,nH);
    });
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
  // flex/grid ?�이?�웃 ?�의 iz??resize bar 추�? ????(?�이?�웃 깨짐 방�?)
  var SKIP=['.s-duo','.s-angle-grid','.s-cmp-wrap','.s-cmp-desc',
    '.s-mood3','.s-story-sub','.s-style-grid',
    '.s-infl-grid-top','.s-infl-grid-bot',
    '.s-pd-2col','.s-pd-3col','.s-pkg-grid',
    '.s-size-wrap','.s-size-img'];
  for(var k=0;k<SKIP.length;k++){if(iz.closest(SKIP[k]))return;}
  if(iz.querySelector('.resize-bar'))return;
  var bar=document.createElement('div');
  bar.className='resize-bar';
  bar.textContent='??;
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

  // ?�?�?� ?�로??버튼 (body???�시 input ?�성 방식 - 가???�뢰???�음) ?�?�?�
  var upBtn=document.createElement('button');
  upBtn.type='button';
  upBtn.className='iz-ov-btn blue';
  upBtn.textContent='?�� ?��?지 ?�로??;upBtn.title='?�릭?�여 ?��?지�??�로?�합?�다';
  upBtn.addEventListener('click',function(e){
    e.stopPropagation();
    e.preventDefault();
    // body???�시 file input ?�성 ???�릭 ???�일 ?�택 ???�거
    var tmp=document.createElement('input');
    tmp.type='file';
    tmp.accept='image/*';
    tmp.style.cssText='position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;';
    tmp.onchange=function(){
      if(!tmp.files||!tmp.files[0]){document.body.removeChild(tmp);return;}
      compressImage(tmp.files[0], function(src,nW,nH){
        initTF(iz,src,nW,nH);
      });
      // ?�용 ?�료 ???�거
      setTimeout(function(){if(tmp.parentNode)document.body.removeChild(tmp);},1000);
    };
    document.body.appendChild(tmp);
    tmp.click();
  });
  ov.appendChild(upBtn);

  // ?�?�?� ?�롯 추�? (?�일 ?��?지 ?�역?� 버튼 ?��?) ?�?�?�
  // ?�롯 추�?�??�용?��? ?�는 부�?목록
  var NO_ADD=[];  // 모든 ?�션 ?�롯 추�? ?�용
  var canAdd=!NO_ADD.some(function(sel){return iz.closest(sel);});

  var addBtn=document.createElement('button');
  addBtn.className='iz-ov-btn green';
  addBtn.textContent='???�롯 추�?';
  if(!canAdd){addBtn.style.display='none';}  // ?�일 ?�역: ?��?
  addBtn.addEventListener('click',function(e){
    e.stopPropagation();
    // 즉시 ??�� (?�금 ?�음)

    var inflCard=iz.closest('.s-infl-card');
    if(inflCard){
      // ?�플루언??카드 ??카드 ?�체�?grid??추�?
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
      newIz.innerHTML='<button class="iz-zone-del" onclick="event.stopPropagation();delSlot(this)">?��</button><div class="iz-in"><div class="iz-ico">?��</div><div class="iz-lbl">?�플루언??/div><div class="iz-px">287 × 340px</div></div><input type="file" accept="image/*" onchange="pv(this)">';
      newIz.onclick=function(ev){izClickOpen(newIz,ev);};
      newCard.appendChild(newIz);
      var inflOv=document.createElement('div');inflOv.className='s-infl-ov';newCard.appendChild(inflOv);
      var inflCopy=document.createElement('div');inflCopy.className='s-infl-copy';
      inflCopy.innerHTML='<div class="s-infl-handle" contenteditable>@influencer</div><div class="s-infl-tag" contenteditable>#?�그</div>';
      newCard.appendChild(inflCopy);
      grid.insertBefore(newCard, inflCard.nextSibling); // ?�릭 ?�치 ?�음
      buildIzOverlay(newIz);
      showHint('???�플루언??카드 추�???);
    } else {
      // ?� 복합 ?� 컨텍?�트 감�? (angle-cell, style-card, mood3-card ?? ?�
      var featItem=iz.closest('.s-feat-item');
      var angleCell=iz.closest('.s-angle-cell');
      var styleCard=iz.closest('.s-style-card');
      var mood3Card=iz.closest('.s-mood3-card');

      if(featItem){
        // feat ?�이????그리?�에 ???�이??추�? (?�른�?�?공간 채우�?
        if(typeof addFeatItem==='function')addFeatItem();
        return;
      } else if(angleCell){
        // ?�각?? ??angle-cell ?�체�?grid??추�?
        try{addAngleSlot();}catch(e){showHint('??각도 ?�롯 추�? ?�류');}
        _slotBusy=false;return;
      } else if(styleCard){
        try{addStyleCard();}catch(e){showHint('???��????�롯 추�? ?�류');}
        _slotBusy=false;return;
      } else if(mood3Card){
        try{addMood3Card();}catch(e){showHint('??무드 ?�롯 추�? ?�류');}
        _slotBusy=false;return;
      }

      // ?�반 iz ?�롯 추�?
      var parent=iz.parentElement;
      var h2=iz.offsetHeight||parseInt(iz.style.height)||300;

      // 컨테?�너 분류
      // 1) ?�열 Grid ?�션: ?�으�?배치
      var GRID_COLS={'s-duo':2,'s-pd-2col':2,'s-pd-3col':3,'s-story-sub':2,'s-infl-grid-bot':3,'s-angle-grid':2,'s-mood3':3,'s-style-grid':3};
      var cols=0;
      for(var cls in GRID_COLS){if(parent.classList.contains(cls)){cols=GRID_COLS[cls];break;}}

      // 2) ?�일 ?�체???�션: ?�로로만 추�?
      var VERT=['s-hero','s-wearing','s-img-only','s-pd-full','s-pd-full2','s-mood-main','s-story-img','s-pkg-img','s-size-img','s-cmp-col'];
      var isVert=VERT.some(function(v){return parent.classList.contains(v);});

      var newIz2=document.createElement('div');
      newIz2.className='iz';
      newIz2.onclick=function(ev){izClickOpen(newIz2,ev);};
      newIz2.innerHTML='<button class="iz-zone-del" onclick="event.stopPropagation();delSlot(this)">?��</button><div class="iz-in"><div class="iz-ico">?��</div><div class="iz-lbl">?��?지</div><div class="iz-px">??/div></div><input type="file" accept="image/*" onchange="pv(this)">';

      if(isVert){
        // ?�체???�로 ?�기
        parent.style.display='block';
        newIz2.style.cssText='height:'+h2+'px;width:100%;display:block;margin-top:3px;';
      } else if(cols>0){
        // 명시??그리???�션 (?��? CSS�??�용??
        newIz2.style.height=h2+'px';
        parent.style.display='grid';
        parent.style.gridTemplateColumns='repeat('+cols+',1fr)';
        parent.style.gap='3px';
      } else {
        // 기�?: ?�재 컬럼 ???��? (기존 ?�롯�?같�? ???�로)
        var existingCount=parent.querySelectorAll(':scope>.iz').length||1;
        parent.style.display='grid';
        parent.style.gridTemplateColumns='repeat('+existingCount+',1fr)';
        parent.style.gap='3px';
        newIz2.style.height=h2+'px';
      }
      parent.insertBefore(newIz2, iz.nextSibling);
      buildIzOverlay(newIz2);
      addBar(newIz2);
      showHint('???�롯 추�???);
    }
  });
  ov.appendChild(addBtn);

  // ?�?�?� ?�롯 ??�� (?�역 ?�금, 컨텍?�트 ?�식) ?�?�?�
  var delBtn=document.createElement('button');
  delBtn.className='iz-ov-btn red';
  delBtn.textContent='???�롯 ??��';
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

    if(inflCard2){inflCard2.remove();showHint('?�� 카드 ??��??);}
    else if(angleCell2){angleCell2.remove();showHint('?�� 각도 ?�롯 ??��??);}
    else if(styleCard2){styleCard2.remove();showHint('?�� ?��???카드 ??��??);}
    else if(mood3Card2){mood3Card2.remove();showHint('?�� 무드 카드 ??��??);}
    else if(featItem2){featItem2.remove();showHint('?�� ?�징 ??�� ??��??);}
    else {
      var nextEl=iz.nextElementSibling;
      if(nextEl&&nextEl.classList.contains('resize-bar'))nextEl.remove();
      iz.remove();
      showHint('?�� ?�롯 ??��??);
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
  showHint('???��?지 ?�롯 추�???);
}
function izDelSlot(btn){
  const iz=btn.closest('.iz');
  const parent=iz.parentElement;
  const siblings=parent.querySelectorAll('.iz');
  
  iz.nextSibling?.remove?.(); // remove resize bar
  iz.remove();
  showHint('?�� ?�롯 ??��??);
}
function initIzOverlays(){
  document.querySelectorAll('#preview .iz').forEach(iz=>buildIzOverlay(iz));
}

/* ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═
   FLOATING TEXT TOOLBAR
?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═ */
function showFT(el){
  if(!el)return;
  try{
    if(typeof _ftCancelHide==='function') _ftCancelHide();
    document.querySelectorAll('.ft-active').forEach(function(e){e.classList.remove('ft-active');});
    _ftEl=el;
    el.classList.add('ft-active');
    var ft=document.getElementById('ft');
    if(!ft) return;
    var r=el.getBoundingClientRect();
    var ftH=44, ftW=420;
    var topPos = r.top > ftH+10 ? r.top - ftH - 6 : r.bottom + 6;
    topPos = Math.max(8, Math.min(topPos, window.innerHeight - ftH - 8));
    var leftPos = Math.max(8, Math.min(r.left, window.innerWidth - ftW - 8));
    ft.style.cssText = 'display:flex; position:fixed; top:'+topPos+'px; left:'+leftPos+'px; z-index:9999; background:#0f172a; border:1px solid #1e293b; border-radius:10px; padding:7px 10px; box-shadow:0 8px 32px rgba(0,0,0,.7); flex-direction:row; align-items:center; gap:4px;';
    var cs=getComputedStyle(el);
    var szEl=document.getElementById('ft-sz');
    if(szEl) szEl.textContent=Math.round(parseFloat(cs.fontSize))+'px';
    var c=rgbToHex(cs.color);
    var colEl=document.getElementById('ft-color');
    if(colEl) colEl.value=c;
    var hexEl=document.getElementById('ft-color-hex');
    if(hexEl) hexEl.textContent=c;
  }catch(err){
    console.error('[showFT] error:', err);
  }
}
function closeFT(){
  document.querySelectorAll('.ft-active').forEach(function(e){e.classList.remove('ft-active');});
  var tb=document.getElementById('ft');
  if(tb)tb.style.display='none';
  _ftEl=null;
}
// CSS??!important 룰을 ?�기?�면 inline ??!important �??�정?�야 ??
function _camelToKebab(s){ return s.replace(/[A-Z]/g, function(m){return '-'+m.toLowerCase();}); }
function ftToggle(prop,on,off){
  if(!_ftEl)return;
  var cs=getComputedStyle(_ftEl);
  var isOn = (prop==='fontWeight') ? parseFloat(cs[prop])>=600 : cs[prop]===on;
  _ftEl.style.setProperty(_camelToKebab(prop), isOn?off:on, 'important');
  showFT(_ftEl);
}
function ftAlign(v){
  if(!_ftEl)return;
  _ftEl.style.setProperty('text-align', v, 'important');
}
function ftColor(v){
  if(!_ftEl)return;
  _ftEl.style.setProperty('color', v, 'important');
  var hex=document.getElementById('ft-color-hex'); if(hex) hex.textContent=v;
}
function rgbToHex(rgb){
  if(!rgb||rgb==='transparent')return'#000000';
  if(rgb.startsWith('#'))return rgb;
  const m=rgb.match(/\d+/g);
  if(!m||m.length<3)return'#000000';
  return'#'+m.slice(0,3).map(x=>parseInt(x).toString(16).padStart(2,'0')).join('');
}
// Bind showFT to all contenteditable focus events

// ?�바 ?�릭 ??contenteditable ?�커???��? (?�심)
document.addEventListener('DOMContentLoaded',function(){
  var ft=document.getElementById('ft');
  if(ft){
    ft.addEventListener('mousedown',function(e){
      e.preventDefault(); // contenteditable ?�커???��? ?�게
    });
  }
});

// ?�재 ?�택???�소 ?�이?�이??
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
      // ?�른 contenteditable�??�동 or ft ?�바 ?�릭 ??= ?��? ?�음
      if(ft&&ft.contains(ae))return;
      if(ae&&ae.isContentEditable)return;
      closeFT();
    },200);
  }
});

/* ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═
   EMOJI PICKER
?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═ */
const EP_CATS={
  '기능?�·소??:['?��?,'?���?,'?��','?��','?��','?���?,'??','?�️','?��','?��','?���?,'??,'?��','?��','?��','?��','?��','?��','?�️','?��','?��','?�️','?��','??,'�?,'?��','?��','?��','?��','?��'],
  '계절·?�씨':['?��','?��','?��','?��','?��?,'?��','?��','?��','?��','?��','?��','?�️','??,'?��','�?,'?��','?���?,'?���?,'?���?,'?���?,'?��','?��','?��','?��','?��','?��'],
  '?�션·?��???:['?��','?��','?��','?��','?��','?��','?��','?��','?��','?��','?��','?��','?��','?��','?��','?��'],
  '?�이?�스?�??:['?��','?��','?���?,'?��','?�️','?��','?��','??,'?��','?��','?��','?��','?���?,'?��','?��','?��','?��','?��','??,'?��'],
  '기능·?�재':['?��','?��','?�️','?��','?�️','?��','?��','?�️','?��','?��','?��','?��','?��','?��','?��','?��'],
  '배송·?�비??:['?��','??,'?��','?��?��','?��','?��','??,'?��','?��','?��','?��','�?,'?��','?��','??','?��'],
  '?�치·지??:['?��','?��','?��','?��','?��','?��','??,'?��','?��','?��','?��','?��','?�️','?�️','?��','?��'],
};

function addFeatItem(){
  var s=document.querySelector('.s-feat-grid');if(!s)return;
  var d=document.createElement('div');d.className='s-feat-item';d.style.position='relative';
  d.innerHTML='<button class="del-btn" onclick="delItem(\'s-feat-item\',this)">??/button>'
    +'<button class="add-btn" onclick="addFeatItem()">+</button>'
    +'<div class="s-feat-ico-wrap">'
    +'<div class="s-feat-ico icon-editable" onclick="openEP(this,event)">??/div>'
    +'<button class="s-feat-ico-del" onclick="event.stopPropagation();this.previousElementSibling.textContent=\'\'" title="?�이�???��">??/button>'
    +'</div>'
    +'<div class="s-feat-name" contenteditable>?�징 ?�목</div>'
    +'<div class="s-feat-desc" contenteditable>?�명???�력?�세??</div>'
    +izNew('?�징 ?��?지','860 × 960px',437);
  s.appendChild(d);
  d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('???�징 ??�� 추�???);
}

function addFaqItem(){
  const s=document.querySelector('.s-faq');if(!s)return;
  const d=document.createElement('div');d.className='s-faq-item';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-faq-item',this)">??/button><div class="s-faq-q" onclick="this.parentElement.classList.toggle('open')"><span class="s-faq-q-txt" contenteditable>??질문</span><span class="s-faq-arr">??/span></div><div class="s-faq-a" contenteditable>?��????�력?�세??</div>`;
  s.appendChild(d);showHint('??FAQ 추�???);
}
function addDuoSlot(){
  const s=document.querySelector('.s-duo');if(!s)return;
  const d=document.createElement('div');
  d.innerHTML=izNew('착용�?,'430 × 680px',680);
  const iz=d.firstChild;
  buildIzOverlay(iz);
  s.appendChild(iz);
  addBar(iz);
  showHint('???�롯 추�???);
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

/* ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═
   SECTION TEMPLATES
?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═ */
function delItem(cls,el){
  const item=el.closest('.'+cls);
  if(!item)return;
  item.remove();
}
function delSlot(btn){var iz=btn.closest?btn.closest('.iz'):btn.parentElement;if(!iz)return;clearIzImage(iz);}

/* IZ helpers for each section type */
function izNew(label,px,h=''){
  return `<div class="iz"${h?' style="height:'+h+'px"':''} onclick="izClickOpen(this,event)"><button class="iz-zone-del" onclick="event.stopPropagation();delSlot(this)">?��</button><div class="iz-in"><div class="iz-ico">?��</div><div class="iz-lbl">${label}</div><div class="iz-px">${px}</div></div><input type="file" accept="image/*" onchange="pv(this)"></div>`;
}
function addTrustItem(){
  const s=document.querySelector('.s-trust');if(!s)return;
  const d=document.createElement('div');d.className='s-trust-item';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-trust-item',this)">??/button><button class="add-btn" onclick="addTrustItem()">+</button><button class="ico-btn" onclick="openEP(this.closest('.s-trust-item').querySelector('.icon-editable'),event)">?�� ?�이�?/button><div class="s-trust-ico icon-editable" onclick="openEP(this,event)">�?/div><div class="s-trust-name" contenteditable>??�� ?�름</div><div class="s-trust-desc" contenteditable>?�명 ?�력</div>`;
  s.appendChild(d);showHint('??배�? 추�???);
}
function addProofItem(){
  const s=document.querySelector('.s-proof');if(!s)return;
  const d=document.createElement('div');d.className='s-proof-item';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-proof-item',this)">??/button><button class="add-btn" onclick="addProofItem()">+</button><div class="s-proof-num" contenteditable>0+</div><div class="s-proof-lbl" contenteditable>Label</div>`;
  s.appendChild(d);showHint('??지??추�???);
}

function addInflSlot(){
  const s=document.querySelector('.s-infl-grid-bot');if(!s)return;
  const d=document.createElement('div');d.className='s-infl-card';d.style.position='relative';
  d.innerHTML=`<div class="iz" style="height:340px;border:none;background:#f0f4ff">${izNew('?�플루언??,'287 × 340px',340).replace('<div class="iz">','').replace('</div>','')}</div><div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer</div><div class="s-infl-tag" contenteditable>#?�그</div></div>`;
  // Simpler: just add an iz card
  const card=document.createElement('div');card.className='s-infl-card';card.style.flex='1';
  card.innerHTML=`<div class="iz" style="height:340px;border:none;background:#f0f4ff"><button class="iz-zone-del" onclick="delSlot(this)">?��</button><div class="iz-in"><div class="iz-ico">?��</div><div class="iz-lbl">?�플루언??/div><div class="iz-px">287 × 340px</div></div><input type="file" accept="image/*" onchange="pv(this)"></div><div class="s-infl-ov"></div><div class="s-infl-copy"><div class="s-infl-handle" contenteditable>@influencer</div><div class="s-infl-tag" contenteditable>#?�그</div></div>`;
  s.appendChild(card);card.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('???�플루언??카드 추�???);
}
function addAngleSlot(){
  const s=document.querySelector('.s-angle-grid');if(!s)return;
  const d=document.createElement('div');d.className='s-angle-cell';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-angle-cell',this)">??/button>${izNew('각도 ?��?지','430 × 520px',260)}<div class="s-angle-label"><div class="s-angle-label-en" contenteditable>View</div><div class="s-angle-label-kr" contenteditable>각도</div></div>`;
  s.appendChild(d);d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('??각도 ?�롯 추�???);
}
function addStyleCard(){
  const s=document.querySelector('.s-style-grid');if(!s)return;
  const d=document.createElement('div');d.className='s-style-card';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-style-card',this)">??/button>${izNew('?��??�링','267 × 400px',400)}<div class="s-style-body"><div class="s-style-mood" contenteditable>Style</div><div class="s-style-title" contenteditable>?��????�목</div><div class="s-style-items" contenteditable>?�이??1<br>?�이??2</div></div>`;
  s.appendChild(d);d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('???��???카드 추�???);
}
function addMood3Card(){
  const s=document.querySelector('.s-mood3');if(!s)return;
  const d=document.createElement('div');d.className='s-mood3-card';d.style.position='relative';
  d.innerHTML=`<button class="del-btn" onclick="delItem('s-mood3-card',this)">??/button><div class="iz" style="height:440px;border:none;background:#f0f4ff"><button class="iz-zone-del" onclick="delSlot(this)">?��</button><div class="iz-in"><div class="iz-ico">?��</div><div class="iz-lbl">무드�?/div><div class="iz-px">287 × 440px</div></div><input type="file" accept="image/*" onchange="pv(this)"></div><div class="s-mood3-ov"></div><div class="s-mood3-copy"><div class="s-mood3-sit" contenteditable>Mood</div><div class="s-mood3-title" contenteditable>무드 ?�목</div></div>`;
  s.appendChild(d);d.querySelectorAll('.iz').forEach(function(iz){buildIzOverlay(iz);addBar(iz);});
  showHint('??무드�?추�???);
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

/* ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═
   SECTION TEMPLATES
?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═ */
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

/* ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═
   DELETE / ADD ITEMS
?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═ */

async function aiGenerate(){
  var btn=document.getElementById('ai-gen-btn');
  btn.disabled=true;
  btn.innerHTML='<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite"></span> ?�성 �?..';
  var brand=document.getElementById('ai-brand').value||'브랜??;
  var product=document.getElementById('ai-product').value||'?�품';
  var cat=document.getElementById('ai-category').value||'?�션';
  var feat=document.getElementById('ai-features').value||'';
  var target=document.getElementById('ai-target').value||'20-30?� ?�성';
  var tone=document.getElementById('ai-tone').value||'감성??;

  var prompt='?�신?� ?�국 ?�리미엄 ?�커머스 ?�세?�이지 ?�문 카피?�이?�입?�다.\n'
    +'?�음 ?�보�?바탕?�로 구매 ?�환?�이 ?��? 카피�??�성?�세??\n\n'
    +'[?�품 ?�보]\n'
    +'- 브랜?? '+brand+'\n'
    +'- ?�품�? '+product+'\n'
    +'- 카테고리: '+cat+'\n'
    +'- ?�심 기능/?�재: '+feat+'\n'
    +'- ?��?고객: '+target+'\n'
    +'- ?�앤매너: '+tone+'\n\n'
    +'[?�성 지�?\n'
    +'- 배너/?�어�? ?�팩???�는 짧�? 문구, 감각?�인 ?�문 ?�로�?n'
    +'- 브랜???�토�? 철학�?감성???��? 3-4문장, <em>강조</em> ?�그 ?�용\n'
    +'- 기능 ?�명: 구체?�인 ?�치/?�재�??�함, ?�비???�택 중심\n'
    +'- FAQ: ?�제 구매?��? ?�주 묻는 ?�실?�인 질문�?친절???��?\n'
    +'- 무드/?��??? 착용 ?�황???�생?�게 묘사\n'
    +'- ?�탁/관�? 구체?�이�??�용?�인 ?�내\n\n'
    +'반드???�래 JSON�?반환 (마크?�운, 코드블록 ?�이 ?�수 JSON):\n'
    +'{\n'
    +'"bannerSeason":"?�즌 ?�스??(?? 2025 SUMMER)",\n'
    +'"bannerKr":"배너 ?��? 메인 (2-4??",\n'
    +'"bannerEn":"배너 ?�문 ?�로�?(4-7?�어)",\n'
    +'"heroEn":"?�어�??�문 ?�?��? (3-5?�어)",\n'
    +'"heroKr":"?�어�??��? ?�?��? (강렬??2�? \\n?�로 구분)",\n'
    +'"heroSub":"?�어�??�브 문구 (1문장)",\n'
    +'"copyEye":"?�션 ?�이�?(?? Brand Story)",\n'
    +'"copyQuote":"감성 ?�용�?(?�탤�?강조??<em>?�스??/em>, 1-2문장)",\n'
    +'"copyBody":"브랜??철학 본문 (3-4문장, <em>?�심?�어</em> 강조)",\n'
    +'"feat1ico":"?�모지","feat1nm":"기능�?","feat1desc":"기능 ?�명 (구체???�치 ?�함)",\n'
    +'"feat2ico":"?�모지","feat2nm":"기능�?","feat2desc":"기능 ?�명",\n'
    +'"feat3ico":"?�모지","feat3nm":"기능�?","feat3desc":"기능 ?�명",\n'
    +'"feat4ico":"?�모지","feat4nm":"기능�?","feat4desc":"기능 ?�명",\n'
    +'"feat5ico":"?�모지","feat5nm":"기능�?","feat5desc":"기능 ?�명",\n'
    +'"feat6ico":"?�모지","feat6nm":"기능�?","feat6desc":"기능 ?�명",\n'
    +'"proofN1":"?�치1 (?? 98%)","proofL1":"?�벨1","proofN2":"?�치2","proofL2":"?�벨2","proofN3":"?�치3","proofL3":"?�벨3",\n'
    +'"moodEn":"무드?�션 ?�문 ?�딩 (3-5?�어)","moodKr":"무드?�션 ?��? (2-3?�어)",\n'
    +'"inflEn":"?�플루언???�션 ?�문","inflKr":"?�플루언???�션 ?��?",\n'
    +'"storyLabel":"?�재 ?�션 ?�문 ?�이�?(?? MATERIAL STORY)","storyTitle":"?�재 ?�?��? (2�? \\n구분)","storyBody":"?�재 본문 (3-4문장)","storySpec1":"?�재?�내??,"storySpec2":"?�산지?�내??,"storySpec3":"?�증?�내??,\n'
    +'"styleEn":"?��????�션 ?�문","styleKr":"?��????�션 ?��?",\n'
    +'"style1mood":"캐주???��????�이�?,"style1title":"?��????�?��?1","style1items":"?�이??조합 (?? ?�님 ?�츠 + ?�버????",\n'
    +'"style2mood":"?�마??캐주??,"style2title":"?��????�?��?2","style2items":"?�이??조합",\n'
    +'"style3mood":"?��???,"style3title":"?��????�?��?3","style3items":"?�이??조합",\n'
    +'"pkgLabel":"?�키지 ?�이�?(?? PACKAGING & DELIVERY)","pkgTitle":"?�키지 ?�?��? (2�?","pkg1":"배송 ?�징1","pkg2":"배송 ?�징2","pkg3":"배송 ?�징3","pkg4":"배송 ?�징4","pkg5":"교환반품 ?�책",\n'
    +'"wearing_en":"착용�??�문","wearing_kr":"착용�??��?",\n'
    +'"wash1":"?�탁 주의?�항1","wash2":"?�탁 주의?�항2","wash3":"?�탁 주의?�항3",\n'
    +'"faq1q":"Q. 질문1","faq1a":"?��?1 (구체??",\n'
    +'"faq2q":"Q. 질문2","faq2a":"?��?2",\n'
    +'"faq3q":"Q. 질문3","faq3a":"?��?3",\n'
    +'"faq4q":"Q. 질문4","faq4a":"?��?4",\n'
    +'"faq5q":"Q. 질문5","faq5a":"?��?5"\n'
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
    res.innerHTML='???�성 ?�료!<br>배너: <b>'+(_aiResult.bannerKr||'')+'</b><br>?�로�? <b>'+(_aiResult.bannerEn||'')+'</b><br>기능1: <b>'+(_aiResult.feat1nm||'')+'</b>';
    document.getElementById('ai-apply-btn').style.display='block';
  }).catch(function(err){showHint('???�류: '+err.message);})
  .finally(function(){
    btn.disabled=false;
    btn.innerHTML='??AI 카피 ?�동 ?�성';
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

  // ?�어�?
  setTxt('.s-hero-en',r.heroEn);
  if(r.heroKr){var hk=pv.querySelector('.s-hero-kr');if(hk)hk.innerHTML=r.heroKr.replace(/\n/g,'<br>');}
  setTxt('.s-hero-sub',r.heroSub);

  // 브랜??카피
  setTxt('.s-copy-eye',r.copyEye);
  set('.s-copy-quote',r.copyQuote);
  set('.s-copy-body',r.copyBody);

  // ?�징 (최�? 6�?
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

  // ?�치 증거
  var pitems=pv.querySelectorAll('.s-proof-item');
  [[r.proofN1,r.proofL1],[r.proofN2,r.proofL2],[r.proofN3,r.proofL3]].forEach(function(arr,i){
    if(!pitems[i])return;
    var nEl=pitems[i].querySelector('.s-proof-num');if(nEl&&arr[0])nEl.textContent=arr[0];
    var lEl=pitems[i].querySelector('.s-proof-lbl');if(lEl&&arr[1])lEl.textContent=arr[1];
  });

  // 무드�??�션
  var moodSec=pv.querySelector('.s-mood');
  if(moodSec){
    var mEn=moodSec.querySelector('.sec-en');if(mEn&&r.moodEn)mEn.textContent=r.moodEn;
    var mKr=moodSec.querySelector('.sec-kr');if(mKr&&r.moodKr)mKr.textContent=r.moodKr;
  }

  // ?�플루언???�션
  var inflSec=pv.querySelector('.s-infl');
  if(inflSec){
    var iEn=inflSec.querySelector('.sec-en');if(iEn&&r.inflEn)iEn.textContent=r.inflEn;
    var iKr=inflSec.querySelector('.sec-kr');if(iKr&&r.inflKr)iKr.textContent=r.inflKr;
  }

  // ?�재 ?�토�?
  setTxt('.s-story-label',r.storyLabel);
  if(r.storyTitle){var st=pv.querySelector('.s-story-title');if(st)st.innerHTML=r.storyTitle.replace(/\n/g,'<br>');}
  setTxt('.s-story-body',r.storyBody);
  var specEl=pv.querySelector('.s-story-spec');
  if(specEl&&r.storySpec1){
    specEl.innerHTML=(r.storySpec1||'')+'<br>'+(r.storySpec2||'')+'<br>'+(r.storySpec3||'');
  }

  // ?��???가?�드
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

  // ?�키지
  setTxt('.s-pkg-label',r.pkgLabel);
  if(r.pkgTitle){var pt=pv.querySelector('.s-pkg-title');if(pt)pt.innerHTML=r.pkgTitle.replace(/\n/g,'<br>');}
  var pkgItems=pv.querySelectorAll('.s-pkg-item');
  [r.pkg1,r.pkg2,r.pkg3,r.pkg4,r.pkg5].forEach(function(val,i){
    if(pkgItems[i]&&val)pkgItems[i].textContent=val;
  });

  // 착용�?
  setTxt('.s-wearing-en',r.wearing_en);
  setTxt('.s-wearing-kr',r.wearing_kr);

  // ?�탁/관�?
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

  showHint('??AI 카피 ?�체 ?�용 ?�료!');
}

/* ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═
   SAVE / EXPORT
?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═ */
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
  // 1�? 직접 ?�운로드 ?�도
  const a=document.createElement('a');a.href=url;a.download=name;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  // 2�? ????(iframe ?�한 ?��?
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
  showHint('???��?지 ?�성 �?..');
  const API = window.EDITOR_API_URL || '';   // ?�버 URL (배포 ???�정)

  // ?�?� ?�버가 ?�결??경우: Puppeteer 고화�?캡처 ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
  if(API){
    try{
      const html = document.documentElement.outerHTML;
      const res = await fetch(API + '/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, format: fmt === 'jpg' ? 'jpeg' : 'png', quality: 98, scale })
      });
      if(!res.ok) throw new Error('?�버 ?�류: ' + res.status);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      showImgModal(url, fmt, true);
      showHint('???�버 고화�?캡처 ?�료! ?�클�????�??);
      return;
    } catch(err){
      console.warn('?�버 캡처 ?�패, html2canvas�??�백:', err);
    }
  }

  // ?�?� ?�백: html2canvas (로컬/?�프?�인) ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
  const ok = await loadH2C();
  if(!ok){
    alert('??html2canvas 로드 ?�패\n?�터???�결???�인?�주?�요.');
    showHint('??html2canvas 로드 ?�패'); return;
  }
  showHint('?�� ' + fmt.toUpperCase() + ' ?�성 �?..');
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
    const dataUrl = canvas.toDataURL(fmt === 'png' ? 'image/png' : 'image/jpeg', 0.98);
    showImgModal(dataUrl, fmt, false);
    showHint('???��?지 ?�성 ?�료 - ?�클�????��?지 ?�??);
  } catch(err){
    var msg = '???��?지 ?�성 ?�류: ' + err.message;
    showHint(msg);
    console.error(err);
    alert(msg + '\n\n콘솔(F12)?�서 ?�세 ?�류�??�인?�세??');
  }
}

// ?�?� buildSecOv ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
function buildSecOv(sec,meta){
  var ov=document.createElement('div');ov.className='sec-ov';
  var lbl=document.createElement('span');lbl.className='sec-ov-btn sov-lbl';lbl.textContent=meta.label||'';ov.appendChild(lbl);
  var bgWrap=document.createElement('div');bgWrap.style.cssText='position:relative;display:inline-block;';
  var bgBtn=document.createElement('button');bgBtn.className='sec-ov-btn sov-bg';bgBtn.textContent='?�� 배경';
  var bgPop=document.createElement('div');bgPop.className='bg-pop';
  var bgT=document.createElement('div');bgT.className='bg-pop-title';bgT.textContent='배경??;bgPop.appendChild(bgT);
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
  ['??,'??].forEach(function(dir){
    var btn=document.createElement('button');
    btn.className='sec-ov-btn sov-'+(dir==='???'up':'dn');btn.textContent=dir;
    btn.addEventListener('click',function(){
      var p=document.getElementById('preview');
      var ss=[].slice.call(p.querySelectorAll(':scope>.sec-wrap'));
      var i=ss.indexOf(sec);
      if(dir==='??&&i>0)p.insertBefore(sec,ss[i-1]);
      else if(dir==='??&&i<ss.length-1)p.insertBefore(ss[i+1],sec);
    });
    ov.appendChild(btn);
  });
  var delB=document.createElement('button');delB.className='sec-ov-btn sov-del';delB.textContent='??;
  delB.addEventListener('click',function(){sec.remove();});
  ov.appendChild(delB);
  return ov;
}

// ?�?� addSection ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
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
  // ?�스???�바 ?�결
  sec.querySelectorAll('[contenteditable]').forEach(function(el){
    if(typeof bindFT==='function')bindFT(el);
  });
  closeAddModal();
}

// ?�?� ?�로???�스???�바: bindFT???�환??no-op (focusin/mouseover가 문서 ?�벨�?처리) ?�
var _ftHideTimer=null;
function _ftScheduleHide(){
  clearTimeout(_ftHideTimer);
  _ftHideTimer=setTimeout(function(){
    if(document.activeElement && document.activeElement.isContentEditable) return;
    var ft=document.getElementById('ft');
    if(ft && ft.matches(':hover')) return;
    closeFT();
  },400);
}
function _ftCancelHide(){ clearTimeout(_ftHideTimer); }

function bindFT(el){ /* no-op: 문서 ?�벨 ?�임?�로 처리 (?�환??stub) */ }

// ?�?� #ft ?�의 ?�트 ?�커 (per-element, ?�버 ?�리�? ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
var _FT_FONTS=[
  ["'Gmarket Sans',sans-serif","Gmarket Sans","??기본"],
  ["'Pretendard',sans-serif","Pretendard","쿠팡 / ?�스"],
  ["'SUIT',sans-serif","SUIT",""],
  ["'Noto Sans KR',sans-serif","Noto Sans KR","?�이�?],
  ["'Gothic A1',sans-serif","Gothic A1",""],
  ["'Nanum Gothic',sans-serif","Nanum Gothic",""],
  ["'Nanum Myeongjo',serif","Nanum Myeongjo","명조"],
  ["'Black Han Sans',sans-serif","Black Han Sans","굵�? ?�딩"],
  ["'Do Hyeon',sans-serif","Do Hyeon",""],
  ["'Jua',sans-serif","Jua",""],
];
var _ftFontOrig=null;
function _ftBuildFontDropdown(){
  var dd=document.getElementById('ft-font-dropdown'); if(!dd) return;
  if(dd.children.length>0) return;
  dd.innerHTML='';
  _FT_FONTS.forEach(function(f){
    var opt=document.createElement('div');
    opt.className='font-opt';
    opt.dataset.v=f[0]; opt.dataset.l=f[1];
    opt.style.cssText='font-family:'+f[0]+';padding:7px 10px;cursor:pointer;font-size:13px;border-radius:5px;';
    opt.innerHTML=f[1]+(f[2]?'<span style="opacity:.5;font-size:9px;margin-left:6px;">'+f[2]+'</span>':'');
    opt.addEventListener('mouseenter',function(){opt.style.background='rgba(255,255,255,.08)';});
    opt.addEventListener('mouseleave',function(){opt.style.background='';});
    dd.appendChild(opt);
  });
  dd.addEventListener('mouseover',function(e){
    var opt=e.target.closest('.font-opt');
    if(!opt||!_ftEl||!opt.dataset||!opt.dataset.v) return;
    try{ _ftEl.style.fontFamily=opt.dataset.v; } catch(err){}
  });
  dd.addEventListener('click',function(e){
    var opt=e.target.closest('.font-opt'); if(!opt||!_ftEl) return;
    _ftEl.style.fontFamily=opt.dataset.v;
    _ftFontOrig=opt.dataset.v;
    ftFontPickerClose();
    showHint('?????�스?�의 ?�트: '+opt.textContent.trim().split(' ')[0]);
  });
}
function ftFontPickerToggle(e){
  e&&e.stopPropagation();
  if(!_ftEl){ showHint('먼�? ?�집???�스?�에 마우?��? ?�리?�요'); return; }
  _ftBuildFontDropdown();
  var dd=document.getElementById('ft-font-dropdown'); if(!dd) return;
  if(dd.style.display==='block'){ ftFontPickerClose(); return; }
  _ftFontOrig=_ftEl.style.fontFamily||window.getComputedStyle(_ftEl).fontFamily;
  dd.style.display='block';
}
function ftFontPickerRevert(){
  if(_ftEl && _ftFontOrig!=null) _ftEl.style.fontFamily=_ftFontOrig;
}
function ftFontPickerClose(){
  var dd=document.getElementById('ft-font-dropdown'); if(dd) dd.style.display='none';
}
document.addEventListener('click', function(e){
  if(e.target.closest('#ft-font-btn')||e.target.closest('#ft-font-dropdown')) return;
  ftFontPickerClose();
});

// 문서 ?�벨 ?�버 ?�임: contenteditable ??진입 ??toolbar ?�시
document.addEventListener('mouseover', function(e){
  var ce=e.target.closest('[contenteditable]');
  if(!ce || !ce.isContentEditable) return;
  if(!document.getElementById('preview').contains(ce)) return;
  _ftCancelHide();
  showFT(ce);
});
document.addEventListener('mouseout', function(e){
  var ce=e.target.closest('[contenteditable]');
  if(!ce) return;
  // ?�동??곳이 같�? ce ?��?거나 #ft ?�면 ?��?
  var to=e.relatedTarget;
  var ft=document.getElementById('ft');
  if(to && (ce.contains(to) || (ft && ft.contains(to)))) return;
  _ftScheduleHide();
});

// ?�바 ?�체??마우?��? 머무???�안 ?��? 취소
(function(){
  function attach(){
    var ft=document.getElementById('ft'); if(!ft) return;
    if(ft.__hoverBound) return; ft.__hoverBound=true;
    ft.addEventListener('mouseenter',_ftCancelHide);
    ft.addEventListener('mouseleave',_ftScheduleHide);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach);
  else attach();
})();

function ftSz(delta){
  if(!_ftEl)return;
  var cur=parseInt(window.getComputedStyle(_ftEl).fontSize)||16;
  var next=Math.max(8,Math.min(200,cur+delta*2));
  _ftEl.style.setProperty('font-size', next+'px', 'important');
  var szEl=document.getElementById('ft-sz');
  if(szEl)szEl.textContent=next+'px';
}

// ?�?� clearIzImage ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
function clearIzImage(iz){
  if(!iz)return;
  var tf=iz.querySelector('.tf-wrap');if(tf)tf.remove();
  var izIn=iz.querySelector('.iz-in');if(izIn)izIn.style.display='';
  iz.style.border='';iz.style.background='';
  iz.classList.remove('has-image');
  iz.querySelectorAll('.iz-ov').forEach(function(o){o.remove();});
  if(typeof buildIzOverlay==='function')buildIzOverlay(iz);
  showHint('?�� ?��?지 ?�거??(?�롯 ?��?)');
}

// ?�?� 배경???�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
var SIZE_PRESETS={
  '?�류':{cols:['Size','총장','가??,'?�깨','?�매'],rows:['XS','S','M','L','XL']},
  '가�?:{cols:['?�이�?,'가�?,'?�로','?�이'],rows:['S','M','L']},
  '?�발':{cols:['?�이�?,'�?길이','�???],rows:['220','230','240','250','260','270']},
  '?�말':{cols:['?�이�?,'�??�이�?],rows:['S(220-240)','L(250-270)']},
  '모자':{cols:['?�이�?,'머리?�레'],rows:['S','M','L','XL']},
  '바�?':{cols:['Size','?�리','?�덩??,'밑위','?�벅지','밑단'],rows:['XS','S','M','L','XL']},
};
function applyPreset(secEl,presetName){
  var p=SIZE_PRESETS[presetName];if(!p)return;
  var tbl=secEl.querySelector('.s-size-tbl');if(!tbl)return;
  var thead=tbl.querySelector('thead tr');
  thead.innerHTML=p.cols.map(function(h){return '<th contenteditable>'+h+'</th>';}).join('');
  var tbody=tbl.querySelector('tbody');
  tbody.innerHTML=p.rows.map(function(r,i){
    var cells=[r];for(var j=1;j<p.cols.length;j++)cells.push('??);
    return '<tr'+(i===Math.floor(p.rows.length/2)?' class="highlight"':'')+'>'+cells.map(function(v){return '<td contenteditable>'+v+'</td>';}).join('')+'</tr>';
  }).join('');
  showHint('??'+presetName+' ?�리???�용');
}
function sizeAddRow(secEl){var tbody=secEl.querySelector('.s-size-tbl tbody');if(!tbody)return;var cols=secEl.querySelectorAll('.s-size-tbl thead th').length;var tr=document.createElement('tr');for(var i=0;i<cols;i++){var td=document.createElement('td');td.contentEditable='true';td.textContent='??;tr.appendChild(td);}tbody.appendChild(tr);}
function sizeDelRow(secEl){var tbody=secEl.querySelector('.s-size-tbl tbody');if(!tbody)return;var rows=tbody.querySelectorAll('tr');if(rows.length>1)rows[rows.length-1].remove();}
function sizeAddCol(secEl){var tbl=secEl.querySelector('.s-size-tbl');if(!tbl)return;var th=document.createElement('th');th.contentEditable='true';th.textContent='??��';tbl.querySelector('thead tr').appendChild(th);tbl.querySelectorAll('tbody tr').forEach(function(tr){var td=document.createElement('td');td.contentEditable='true';td.textContent='??;tr.appendChild(td);});}
function sizeDelCol(secEl){var thead=secEl.querySelector('.s-size-tbl thead tr');if(!thead)return;var ths=thead.querySelectorAll('th');if(ths.length<=1)return;ths[ths.length-1].remove();secEl.querySelectorAll('.s-size-tbl tbody tr').forEach(function(tr){var tds=tr.querySelectorAll('td');if(tds.length>1)tds[tds.length-1].remove();});}

// ?�?� saveHTML / saveEditHTML ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
function makeFixed(orig){
  return orig
    .replace(/\/\*INIT_BEGIN\*\/[\s\S]*?\/\*INIT_END\*\//,"(function(){\n  var preview=document.getElementById('preview');\n  if(!preview)return;\n  [].slice.call(preview.querySelectorAll(':scope>.sec-wrap')).forEach(function(sec){\n    var type=sec.dataset.secType;\n    var meta=(typeof SEC_META!=='undefined'&&SEC_META[type])||{label:type||''};\n    [].slice.call(sec.querySelectorAll('.sec-ov')).forEach(function(o){o.remove();});\n    if(typeof buildSecOv==='function')sec.appendChild(buildSecOv(sec,meta));\n    [].slice.call(sec.querySelectorAll('.iz')).forEach(function(iz){\n      [].slice.call(iz.querySelectorAll('.iz-ov')).forEach(function(o){o.remove();});\n      if(typeof buildIzOverlay==='function')buildIzOverlay(iz);\n      if(typeof addBar==='function')addBar(iz);\n      var tf=iz.querySelector('.tf-wrap');\n      if(tf&&typeof bindTF==='function')bindTF(tf,iz);\n    });\n  });\n  try{if(typeof renderEPCats==='function'&&typeof EP_CATS!=='undefined')renderEPCats(Object.keys(EP_CATS)[0]);}catch(e){}\n  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});\n})();")
    .replace('html,body{height:100%;overflow:hidden;}','html{height:100%;}body{min-height:100%;overflow-y:auto;background:#dde0e8;}')
    .replace('id="body"','id="body" style="min-height:calc(100vh - 48px)"');
}
function saveHTML(){
  var pv=document.getElementById('preview'); if(!pv) return;
  var clone=pv.cloneNode(true);
  clone.querySelectorAll('.sec-ov,.iz-ov,.del-btn,.add-btn,.ico-btn,.resize-bar,.iz-zone-del,.tf-border,.tf-handle,.tf-dim,.tf-lock-badge,.s-size-ctrl,.feat-row-add-wrap,input[type=file]').forEach(function(e){e.remove();});
  clone.querySelectorAll('[contenteditable]').forEach(function(e){e.removeAttribute('contenteditable');});
  clone.querySelectorAll('.iz-in').forEach(function(e){e.style.display='none';});
  var styleEls=document.querySelectorAll('style,link[rel="stylesheet"]');
  var allCss='';
  styleEls.forEach(function(el){
    if(el.tagName==='STYLE') allCss+=el.textContent;
  });
  var html='<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<link rel="preconnect" href="https://fonts.googleapis.com">'
    +'<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Gothic+A1:wght@400;700;900&family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700&family=Black+Han+Sans&family=Do+Hyeon&family=Jua&display=swap" rel="stylesheet">'
+'<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">'
+'<link href="https://cdn.jsdelivr.net/npm/suit-fonts@1.0.0/dist/suit.css" rel="stylesheet">'
+'<link href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.css" rel="stylesheet">'
+'<style>@font-face{font-family:"Gmarket Sans";src:url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff") format("woff");font-weight:500;}@font-face{font-family:"Gmarket Sans";src:url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff") format("woff");font-weight:700;}</style>'
    +'<style>'+allCss
    +'body{margin:0;padding:0;background:#f0f0f0;}'
    +'#preview{margin:0 auto;}'
    +'</style></head><body>'
    +'<div id="preview" style="'+pv.getAttribute('style')+'">'+clone.innerHTML+'</div>'
    +'</body></html>';
  var b=new Blob([html],{type:'text/html;charset=utf-8'});
  var u=URL.createObjectURL(b);
  var a=document.createElement('a');a.href=u;a.download='detail-page.html';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(u);showHint('??HTML ?�?�됨');
}
function saveEditHTML(){
  var fixed=makeFixed(document.documentElement.outerHTML);
  var b=new Blob(['<!DOCTYPE html>'+fixed],{type:'text/html;charset=utf-8'});
  var u=URL.createObjectURL(b);
  var a=document.createElement('a');a.href=u;a.download='detail-page-editor.html';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(u);showHint('???�집 HTML ?�?�됨');
}

// ?�?� ?�역 ?�벤???�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
document.addEventListener('click',function(e){
  if(!e.target.closest('.bg-pop')&&!e.target.closest('.sov-bg'))
    document.querySelectorAll('.bg-pop.show').forEach(function(p){p.classList.remove('show');});
  if(!e.target.closest('#ep')&&!e.target.closest('.icon-editable'))closeEP();
  if(!e.target.closest('[contenteditable]')&&!(document.getElementById('ft')&&document.getElementById('ft').contains(e.target)))closeFT();
});

// ?�?� INIT ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
function showImgModal(dataUrl, fmt, isBlob, label){
  var old=document.getElementById('img-save-modal');if(old)old.remove();
  var modal=document.createElement('div');
  modal.id='img-save-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:99999;display:flex;flex-direction:column;align-items:center;padding:16px;overflow-y:auto;';

  // ?�단 �?
  var bar=document.createElement('div');
  bar.style.cssText='width:100%;max-width:900px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;flex-shrink:0;';

  var guide=document.createElement('div');
  guide.style.cssText='color:#fff;font-size:13px;font-weight:600;background:rgba(255,255,255,.12);padding:8px 14px;border-radius:8px;';
  guide.textContent='?�� '+(label||fmt.toUpperCase())+' ?�?????�클�????��?지�??�른 ?�름?�로 ?�??;

  var dlBtn=document.createElement('a');
  dlBtn.href=dataUrl;
  dlBtn.download='detail-page.'+(fmt==='jpg'?'jpg':'png');
  dlBtn.style.cssText='background:'+(isBlob?'#16a34a':'#2563eb')+';color:#fff;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;white-space:nowrap;';
  dlBtn.textContent='�??�운로드';

  var closeBtn=document.createElement('button');
  closeBtn.textContent='???�기';
  closeBtn.style.cssText='background:#dc2626;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;';
  closeBtn.onclick=function(){modal.remove();};

  bar.appendChild(guide);bar.appendChild(dlBtn);bar.appendChild(closeBtn);

  // ?��?지
  var img=document.createElement('img');
  img.src=dataUrl;
  img.style.cssText='max-width:100%;width:auto;height:auto;border:2px solid rgba(255,255,255,.3);border-radius:6px;display:block;cursor:pointer;';
  img.title='?�클�????��?지�??�른 ?�름?�로 ?�??;

  var wrap=document.createElement('div');
  wrap.style.cssText='width:100%;max-width:900px;';
  wrap.appendChild(img);

  modal.appendChild(bar);modal.appendChild(wrap);
  document.body.appendChild(modal);
  modal.addEventListener('click',function(ev){if(ev.target===modal)modal.remove();});
}

// ?�?� 모바?�·PC 맞춤 캡처 ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
async function saveMobile(){
  // 375px (모바?? ?�비�?캡처
  await doSaveCustom(375, 3, 'jpg', '모바??);
}
async function savePC(){
  // 860px (PC) ?�비�?캡처 - ?�재 기본�?
  await doSaveCustom(860, 3, 'jpg', 'PC');
}
async function doSaveCustom(targetW, scale, fmt, label){
  showHint('??'+label+' 버전 ?�성 �?..');
  const ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 ?�패'); return; }

  const preview = document.getElementById('preview');
  const origW = preview.style.width;

  // ?�시�??��??�비 ?�용
  preview.style.width = targetW + 'px';
  // ?�트 리스케?�을 ?�한 ?�깐 ?��?
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
      fmt === 'png' ? 'image/png' : 'image/jpeg', 0.98
    );
    const finalW = targetW * scale;
    showHint('??'+label+' '+finalW+'px ?��?지 ?�성 ?�료');
    showImgModal(dataUrl, fmt, false, label+' '+finalW+'px');
  } catch(err){
    showHint('???�류: '+err.message);
    console.error(err);
    alert('캡처 ?�류: '+err.message);
  } finally {
    // ?�래 ?�비 복원
    preview.style.width = origW;
  }
}

// ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═??
//  분할 ?�?? ?�션 ?�위�?캡처 ??3500px 기�? 그룹?????�치�?
// ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═??
async function saveSplit(targetW, scale, maxH){
  targetW = targetW || 860;
  scale   = scale   || 1;  // 기본 860px 출력
  maxH    = maxH    || 3500;

  const ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 ?�패'); return; }

  const preview = document.getElementById('preview');
  const origW   = preview.style.width;
  preview.style.width = targetW + 'px';
  document.activeElement && document.activeElement.blur();
  if(typeof tfDeselect === 'function') tfDeselect();
  await new Promise(r => setTimeout(r, 700));

  const sections = Array.from(document.querySelectorAll('#preview > .sec-wrap'));
  if(!sections.length){ showHint('???�션 ?�음'); preview.style.width = origW; return; }

  const skipEl = el => {
    if(['INPUT','BUTTON','SELECT'].includes(el.tagName)) return true;
    return ['sec-toolbar','del-btn','add-btn','ico-btn','resize-bar',
      'iz-ov','tf-border','tf-handle','tf-dim','tf-lock-badge',
      'iz-zone-del','feat-row-add-wrap','feat-add-img-row','s-size-ctrl',
      'mood-copy-del','iz-in','sec-ov']
      .some(k => el.classList.contains(k));
  };

  showHint('??0 / ' + sections.length + ' 캡처 �?..');

  try{
    // ?�?� 1. ?�션�?개별 캡처 (보이지 ?�거???�기 0???�션?� 건너?�) ?�?�?�?�?�?�?�?�?�
    const captured = [];
    let skippedN = 0;
    for(let i = 0; i < sections.length; i++){
      const sec = sections[i];
      showHint('??' + (i+1) + ' / ' + sections.length + ' 캡처 �?..');
      // 가?�성 + ?�기 검??
      const rect = sec.getBoundingClientRect();
      const visible = sec.offsetParent !== null && rect.width > 0 && rect.height > 0;
      if(!visible){
        skippedN++;
        console.warn('[saveSplit] skip section', i, 'visible=', visible, 'w=', rect.width, 'h=', rect.height);
        continue;
      }
      let cv;
      try {
        cv = await html2canvas(sec, {
          scale        : scale,
          useCORS      : true,
          allowTaint   : true,
          backgroundColor: null,   // ?�션 배경???��?
          logging      : false,
          imageTimeout : 12000,
          ignoreElements: skipEl,
        });
      } catch(e) {
        skippedN++;
        console.warn('[saveSplit] html2canvas threw on section', i, e.message);
        continue;
      }
      if(!cv || !cv.width || !cv.height){
        skippedN++;
        console.warn('[saveSplit] zero-size canvas, section', i, 'w=', cv && cv.width, 'h=', cv && cv.height);
        continue;
      }
      captured.push(cv);
      await new Promise(r => setTimeout(r, 30)); // 브라?��? ??고르�?
    }

    if(!captured.length){
      throw new Error('캡처?????�는 ?�션???�습?�다 (?��? 비어?�거???��? ?�태).');
    }
    if(skippedN > 0) console.info('[saveSplit] ?�킵???�션:', skippedN, '/', sections.length);

    // ?�?� 2. 3500px 기�??�로 그룹???�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
    const chunks = [];
    let group = [], groupH = 0;

    for(const cv of captured){
      // ?��? 그룹???�고, 추�??�면 maxH 초과 ???�재 그룹 ?�정
      if(group.length > 0 && groupH + cv.height > maxH){
        chunks.push(group);
        group = [];
        groupH = 0;
      }
      group.push(cv);
      groupH += cv.height;
    }
    if(group.length > 0) chunks.push(group);

    // ?�?� 3. 그룹�??�쳐??최종 캔버???�성 ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
    const results = [];
    for(let ci = 0; ci < chunks.length; ci++){
      const chunk = chunks[ci];
      const w = Math.max.apply(null, chunk.map(function(c){ return c.width; }));
      const h = chunk.reduce(function(s, cv){ return s + cv.height; }, 0);
      if(!w || !h){
        console.warn('[saveSplit] empty chunk skipped, idx=', ci);
        continue;
      }

      const final = document.createElement('canvas');
      final.width  = w;
      final.height = h;
      const ctx = final.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      let y = 0;
      for(const cv of chunk){
        if(!cv.width || !cv.height) continue; // 0 canvas 최종 가??
        ctx.drawImage(cv, 0, y);
        y += cv.height;
      }
      results.push({ dataUrl: final.toDataURL('image/jpeg', 0.98), w, h, idx: ci+1, total: chunks.length });
    }

    // ?�?� 4. 갤러�?모달�??�시 ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
    showSplitGallery(results, targetW, scale);
    showHint('??' + chunks.length + '�??�트 분할 ?�료!');

  } catch(err){
    showHint('???�류: ' + err.message);
    console.error(err);
    alert('분할 캡처 ?�류: ' + err.message);
  } finally {
    preview.style.width = origW;
  }
}

function showSplitGallery(parts, targetW, scale){
  var old = document.getElementById('split-gallery'); if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'split-gallery';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;display:flex;flex-direction:column;overflow:hidden;';

  // ?�더
  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(255,255,255,.07);flex-shrink:0;gap:8px;';
  hdr.innerHTML = '<div style="color:#fff;font-size:13px;font-weight:700;">?�� 분할 ?�????'+parts.length+'�??�트 ('+ targetW +'px 출력)</div>';

  var info = document.createElement('div');
  info.style.cssText = 'color:#aaa;font-size:11px;background:rgba(255,255,255,.1);padding:5px 10px;border-radius:6px;';
  info.textContent = '?�클�????��?지�??�른 ?�름?�로 ?�??;

  var closeBtn = document.createElement('button');
  closeBtn.textContent = '???�기';
  closeBtn.style.cssText = 'background:#dc2626;color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:700;';
  closeBtn.onclick = function(){ modal.remove(); };

  hdr.appendChild(info); hdr.appendChild(closeBtn);

  // ?�크�??�역
  var scroll = document.createElement('div');
  scroll.style.cssText = 'display:flex;gap:20px;padding:16px;overflow-x:auto;overflow-y:hidden;flex:1;align-items:flex-start;';

  parts.forEach(function(part){
    var card = document.createElement('div');
    card.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:8px;align-items:center;';

    // ?�트 ?�벨
    var lbl = document.createElement('div');
    lbl.style.cssText = 'color:#fff;font-size:12px;font-weight:700;';
    lbl.textContent = 'Part ' + part.idx + ' / ' + part.total;

    var size = document.createElement('div');
    size.style.cssText = 'color:#aaa;font-size:10px;';
    size.textContent = part.w + ' × ' + part.h + 'px';

    // ?�운로드 버튼
    var dlBtn = document.createElement('a');
    dlBtn.href = part.dataUrl;
    dlBtn.download = 'detail-part' + part.idx + '.jpg';
    dlBtn.style.cssText = 'background:#16a34a;color:#fff;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;';
    dlBtn.textContent = '�?Part ' + part.idx + ' ?�운로드';

    // ?��?지 (?�네??
    var img = document.createElement('img');
    img.src = part.dataUrl;
    img.style.cssText = 'max-height:70vh;width:auto;border:2px solid rgba(255,255,255,.2);border-radius:6px;cursor:pointer;display:block;';
    img.title = '?�클�????��?지�??�른 ?�름?�로 ?�??;

    card.appendChild(lbl); card.appendChild(size); card.appendChild(dlBtn); card.appendChild(img);
    scroll.appendChild(card);
  });

  modal.appendChild(hdr); modal.appendChild(scroll);
  document.body.appendChild(modal);

  // 배경 ?�릭 ?�기
  modal.addEventListener('click', function(ev){ if(ev.target === modal) modal.remove(); });
}

// ?�?� 모바??가?�성 최적???�??(860px 기�?, ?�트 2.3�??��?) ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
async function saveOptimized(){
  var ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 ?�패'); return; }

  var preview = document.getElementById('preview');
  var origW = preview.style.width;

  // 860px + 모바??최적???�트 ?�래???�용
  preview.style.width = '860px';
  preview.classList.add('for-mobile-capture');
  showHint('??모바??최적???��?지 ?�성 �?..');
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
      scale: 1,          // 860px × 1 = 860px (?�랫???��?)
      useCORS: true, allowTaint: true, backgroundColor: '#fff',
      logging: false, imageTimeout: 12000, ignoreElements: skipEl,
    });
    var dataUrl = canvas.toDataURL('image/jpeg', 0.98);
    showHint('??860px 모바??최적???��?지 ?�성! (?�랫???��? ?�기)');
    showImgModal(dataUrl, 'jpg', false, '??PC·모바??최적??(1720px)');
  } catch(err){
    showHint('???�류: '+err.message);
    alert('?�류: '+err.message);
  } finally {
    preview.style.width = origW;
    preview.classList.remove('for-mobile-capture');
  }
}

// ?�?� 모바??최적??분할 ?�???�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
async function saveOptimizedSplit(){
  var ok = await loadH2C();
  if(!ok){ alert('html2canvas 로드 ?�패'); return; }

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
    var skippedN = 0;
    for(var i=0;i<sections.length;i++){
      showHint('??'+(i+1)+'/'+sections.length+' 캡처 �?(모바??최적??...');
      var rect = sections[i].getBoundingClientRect();
      var visible = sections[i].offsetParent !== null && rect.width > 0 && rect.height > 0;
      if(!visible){
        skippedN++;
        console.warn('[saveOptimizedSplit] skip section', i, 'w=', rect.width, 'h=', rect.height);
        continue;
      }
      var cv;
      try{
        cv = await html2canvas(sections[i],{
          scale:1, useCORS:true, allowTaint:true,
          backgroundColor:null, logging:false, imageTimeout:12000,
          ignoreElements:skipEl,
        });
      } catch(e){
        skippedN++;
        console.warn('[saveOptimizedSplit] html2canvas threw on section', i, e.message);
        continue;
      }
      if(!cv || !cv.width || !cv.height){
        skippedN++;
        console.warn('[saveOptimizedSplit] zero-size canvas, section', i);
        continue;
      }
      captured.push(cv);
      await new Promise(r=>setTimeout(r,30));
    }
    if(!captured.length){
      throw new Error('캡처?????�는 ?�션???�습?�다 (?��? 비어?�거???��? ?�태).');
    }
    if(skippedN > 0) console.info('[saveOptimizedSplit] ?�킵???�션:', skippedN, '/', sections.length);

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
      var w=Math.max.apply(null, chunks[k].map(function(c){ return c.width; }));
      var h=chunks[k].reduce(function(s,v){return s+v.height;},0);
      if(!w || !h){ console.warn('[saveOptimizedSplit] empty chunk skipped, idx=', k); continue; }
      var final=document.createElement('canvas');
      final.width=w; final.height=h;
      var ctx=final.getContext('2d');
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h);
      var y=0;
      for(var j=0;j<chunks[k].length;j++){
        if(!chunks[k][j].width || !chunks[k][j].height) continue; // 0 canvas 최종 가??
        ctx.drawImage(chunks[k][j],0,y); y+=chunks[k][j].height;
      }
      results.push({dataUrl:final.toDataURL('image/jpeg',0.98),w:w,h:h,idx:k+1,total:chunks.length});
    }
    showSplitGallery(results,860,2);
    showHint('??모바??최적??분할 ?�성! '+chunks.length+'�??�트');
  } catch(err){
    showHint('???�류: '+err.message); alert(err.message);
  } finally {
    preview.style.width = origW;
    preview.classList.remove('for-mobile-capture');
  }
}

// ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═??
//  ?�버 API ?�동 (Puppeteer 고화�??�더�?
// ?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═?�═??
var API_BASE = window.location.origin; // 같�? ?�버

async function captureViaServer(opts){
  // opts: { mobile, split, format }
  var width  = opts.mobile ? 375 : 860;
  var format = opts.format || 'jpeg';
  var endpoint = opts.split ? '/api/capture/split' : '/api/capture';

  // ?�재 ?�디??HTML ?�집
  var preview = document.getElementById('preview');
  if(!preview){ showHint('??#preview ?�음'); return; }

  // ?�?�용 HTML ?�성 (?�디??UI ?�거)
  var clone = preview.cloneNode(true);
  clone.querySelectorAll('.sec-ov,.iz-ov,.del-btn,.add-btn,.resize-bar,.iz-zone-del,.tf-border,.tf-handle,.tf-dim,.s-size-ctrl,.feat-row-add-wrap').forEach(function(e){e.remove();});
  clone.querySelectorAll('[contenteditable]').forEach(function(e){e.removeAttribute('contenteditable');});

  // ?�재 CSS ?�함???�전??HTML
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

  showHint('???�버?�서 캡처 �?..');

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
      showHint('??'+data.parts+'�??�트 캡처 ?�료!');
    } else {
      var res = await fetch(API_BASE + endpoint, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ html, width, scale:1, format, quality:98 })
      });
      if(!res.ok) throw new Error(await res.text());
      var blob = await res.blob();
      var url = URL.createObjectURL(blob);
      showImgModal(url, format==='png'?'png':'jpg', true, width+'px ?�버 캡처');
      showHint('???�버 캡처 ?�료! '+width+'px');
    }
  } catch(e){
    showHint('???�버 ?�류: '+e.message);
    alert('?�버 ?�류: '+e.message);
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
  hdr.innerHTML = '<span style="color:#fff;font-weight:700;font-size:14px;">??'+chunks.length+'�??�트 / 출력 '+width+'px</span>'
    +'<span style="color:#aaa;font-size:11px;background:rgba(255,255,255,.1);padding:4px 10px;border-radius:6px;">?�클�????��?지 ?�??/span>';
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '??;
  closeBtn.style.cssText = 'margin-left:auto;background:#dc2626;color:#fff;border:none;padding:7px 14px;border-radius:7px;cursor:pointer;font-weight:700;';
  closeBtn.onclick = function(){ modal.remove(); };
  hdr.appendChild(closeBtn);

  var scroll = document.createElement('div');
  scroll.style.cssText = 'display:flex;gap:16px;padding:16px;overflow-x:auto;flex:1;align-items:flex-start;';

  chunks.forEach(function(chunk){
    // ?�션 ?��?지?�을 Canvas�??�치�?
    var card = document.createElement('div');
    card.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:8px;align-items:center;';

    var lbl = document.createElement('div');
    lbl.style.cssText = 'color:#fff;font-size:12px;font-weight:700;';
    lbl.textContent = 'Part '+chunk.index+' ('+chunk.sections.length+'?�션)';

    var dlBtn = document.createElement('a');
    dlBtn.style.cssText = 'background:#16a34a;color:#fff;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;';
    dlBtn.textContent = '�??�운로드';
    dlBtn.download = 'part'+chunk.index+'.jpg';

    // Canvas�??�션???�치�?
    var totalH = chunk.sections.reduce(function(s,sec){return s+sec.height;},0);
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = totalH;
    canvas.style.cssText = 'max-height:70vh;width:auto;border:2px solid rgba(255,255,255,.2);border-radius:4px;display:block;cursor:pointer;';
    canvas.title = '?�클�????��?지�??�른 ?�름?�로 ?�??;

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
      dlBtn.href = canvas.toDataURL('image/jpeg', 0.98);
    });

    card.appendChild(lbl); card.appendChild(dlBtn); card.appendChild(canvas);
    scroll.appendChild(card);
  });

  modal.appendChild(hdr); modal.appendChild(scroll);
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
}

// ?�?� ?�??버튼 ?�결 ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
function saveServer(opts){ captureViaServer(opts); }

function toggleMobilePreview(btn){
  var pv=document.getElementById('preview'); if(!pv) return;
  var on=pv.classList.toggle('for-mobile-capture');
  if(btn){
    btn.style.background = on ? '#2563eb' : '';
    btn.style.color = on ? '#fff' : '';
    btn.style.borderColor = on ? '#2563eb' : '';
  }
  showHint(on ? '?�� 모바??최적??미리보기 ON (?�????모습)' : '?�� ?�반 ?�집 모드');
}

// ?�?� ?�플�??�??불러?�기 + HTML import ?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�
var TPL_KEY='dps_templates_v1';
// ?�버 API 기반 ?�플�??�??
async function tplServerSave(snap){
  try{
    const res=await fetch('/api/templates/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(snap)});
    return res.ok;
  }catch(e){return false;}
}
async function tplServerList(){
  try{
    const res=await fetch('/api/templates');
    return await res.json();
  }catch(e){return[];}
}
async function tplServerLoad(name){
  try{
    const fname=name.replace(/[^a-z0-9가-??-]/gi,'_');
    const res=await fetch('/api/templates/'+encodeURIComponent(fname));
    return await res.json();
  }catch(e){return null;}
}
async function tplServerDelete(name){
  try{
    const fname=name.replace(/[^a-z0-9가-??-]/gi,'_');
    await fetch('/api/templates/'+encodeURIComponent(fname),{method:'DELETE'});
  }catch(e){}
}
function tplList(){ try{ return JSON.parse(localStorage.getItem(TPL_KEY)||'[]'); }catch(e){ return []; } }
function tplSaveAll(arr){ try{ localStorage.setItem(TPL_KEY, JSON.stringify(arr)); return true; }catch(e){ return false; } }

function tplSnapshot(name){
  var pv=document.getElementById('preview'); if(!pv) return null;
  // ?�버?�이 ?�거???�린 HTML 추출
  // ??.tf-handle,.tf-border,.tf-dim,.tf-lock-badge??보존 ??복원 ???�기 조절 ?�들 ?��?
  var clone=pv.cloneNode(true);
  clone.querySelectorAll('.sec-ov,.iz-ov,.resize-bar,.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
  return {
    name:name||'무제',
    font: (typeof _fontCommitted!=='undefined' && _fontCommitted) || "'Pretendard',sans-serif",
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
      if(tf){
        bindTF(tf,iz);
        // tf-wrap???�는 iz: iz-ov(z-index:30)가 마우???�벤??가로채지 ?�도�??��?
        iz.querySelectorAll('.iz-ov').forEach(function(o){o.style.display='none';});
        // file input??비활?�화 (initTF?� ?�일??처리)
        var fi=iz.querySelector('input[type=file]');
        if(fi){fi.style.pointerEvents='none';fi.style.opacity='0';}
      }
    });
    sec.querySelectorAll('[contenteditable]').forEach(function(el){ bindFT(el); });
  });
  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
}

function tplApply(tpl){
  if(!tpl||!tpl.html){ alert('?�플�??�이?��? 비어?�습?�다'); return; }
  var pv=document.getElementById('preview'); if(!pv) return;
  pv.innerHTML=tpl.html;
  if(tpl.width){ pv.style.width=tpl.width+'px'; }
  if(tpl.font){
    _fontCommitted = tpl.font;
    var opt=document.querySelector('.font-opt[data-v="'+tpl.font.replace(/"/g,'\\"')+'"]');
    var lbl=document.getElementById('font-picker-label');
    if(lbl){ lbl.textContent = (opt&&opt.dataset.l)||tpl.font; lbl.style.fontFamily = tpl.font; }
    if(typeof _markCommittedOpt==='function') _markCommittedOpt();
    applyFont(tpl.font);
  }
  rebindPreview();
  showHint('??'+(tpl.name||'?�플�?)+' 불러??);
  closeTplModal();
}

async function tplSaveCurrent(){
  var input=document.getElementById('tpl-name-input');
  var name=(input&&input.value||'').trim();
  if(!name){ alert('?�플�??�름???�력?�세??); return; }
  var snap=tplSnapshot(name); if(!snap) return;
  showHint('???�??�?..');
  var ok=await tplServerSave(snap);
  if(ok){
    if(input) input.value='';
    await renderTplList();
    showHint('??"'+name+'" ?�?�됨');
  } else {
    showHint('???�???�패');
  }
}

function tplDelete(name){
  if(!confirm('"'+name+'" ??��?�까??')) return;
  var arr=tplList().filter(function(t){return t.name!==name;});
  tplSaveAll(arr); renderTplList();
}

function tplExportJSON(name){
  var arr=tplList(); var t=arr.find(function(x){return x.name===name;});
  if(!t){ alert('?�플�??�음'); return; }
  var b=new Blob([JSON.stringify(t,null,2)],{type:'application/json;charset=utf-8'});
  var u=URL.createObjectURL(b);
  var a=document.createElement('a'); a.href=u; a.download='template-'+name.replace(/[^a-z0-9가-??-]/gi,'_')+'.json';
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
      catch(e){ alert('JSON ?�싱 ?�패: '+e.message); return; }
    } else if(/\.html?$/i.test(file.name)){
      // saveHTML�??�?�된 ?�일 ??#preview ??sec-wrap 추출
      var doc=new DOMParser().parseFromString(txt,'text/html');
      var srcPv=doc.getElementById('preview');
      if(!srcPv){ alert('?�로?�한 HTML??#preview ?�소가 ?�습?�다'); return; }
      // ?�버?�이 ?�거
      srcPv.querySelectorAll('.sec-ov,.iz-ov,.resize-bar,.tf-handle,.tf-dim').forEach(function(el){el.remove();});
      tpl={
        name:file.name.replace(/\.html?$/i,''),
        font:"'Pretendard',sans-serif",
        width:parseInt(srcPv.style.width)||860,
        html:srcPv.innerHTML
      };
    } else {
      alert('JSON ?�는 HTML ?�일�?지?�합?�다');
      return;
    }
    if(!confirm('?�재 ?�업????��?�고 "'+(tpl.name||'?�일')+'"??불러?�까??\n(?�???????�용?� ?�라집니??')) return;
    tplApply(tpl);
    rebindPreview();
  };
  reader.readAsText(file,'utf-8');
}

function _tplRowEsc(s){ return (s||'').replace(/[<>&"]/g, function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); }
function _tplFromRow(btn){
  var row=btn.closest('.tpl-row'); if(!row) return null;
  var arr=row.parentNode._tpls; if(!arr) return null;
  return arr[+row.dataset.i];
}
async function tplLoadByRow(btn){
  var t=_tplFromRow(btn); if(!t) return;
  showHint('??불러?�는 �?..');
  var full=await tplServerLoad(t.name);
  if(full) tplApply(full);
  else showHint('??불러?�기 ?�패');
}
function tplExportByRow(btn){ var t=_tplFromRow(btn); if(t) tplExportJSON(t.name); }
async function tplDeleteByRow(btn){
  var t=_tplFromRow(btn); if(!t) return;
  if(!confirm('Delete "'+t.name+'"?')) return;
  await tplServerDelete(t.name);
  await renderTplList();
}
async function renderTplList(){
  var box=document.getElementById('tpl-list'); if(!box) return;
  var arr=await tplServerList();
  box._tpls=arr;
  if(arr.length===0){
    box.innerHTML='<div style="padding:24px;text-align:center;color:#94a3b8;font-size:12px;">No saved templates</div>';
    return;
  }
  box.innerHTML=arr.map(function(t,i){
    var when=(t.savedAt||'').slice(0,16).replace('T',' ');
    return '<div class="tpl-row" data-i="'+i+'">'
      +'<div class="tpl-row-info"><div class="tpl-row-name">'+_tplRowEsc(t.name)+'</div><div class="tpl-row-meta">'+when+' · '+(t.width||860)+'px</div></div>'
      +'<div class="tpl-row-acts">'
      +'<button class="tpl-row-btn load" onclick="tplLoadByRow(this)">Load</button>'
      +'<button class="tpl-row-btn export" onclick="tplExportByRow(this)">JSON</button>'
      +'<button class="tpl-row-btn del" onclick="tplDeleteByRow(this)">Delete</button>'
      +'</div></div>';
  }).join('');
}

async function openTplModal(){
  var m=document.getElementById('tpl-modal'); if(!m) return;
  m.style.display='flex';
  await renderTplList();
}
function closeTplModal(){
  var m=document.getElementById('tpl-modal'); if(m) m.style.display='none';
}

// ?�?�?� ?�로???��?지 관�?(FTP) ?�?�?�
function _fmtSize(n){
  if(!n&&n!==0) return '';
  if(n<1024) return n+'B';
  if(n<1024*1024) return (n/1024).toFixed(1)+'KB';
  return (n/1024/1024).toFixed(2)+'MB';
}
function _escAttr(s){ return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

async function openUploadsModal(){
  var m=document.getElementById('uploads-modal'); if(!m) return;
  m.style.display='flex';
  await renderUploadsList();
}
function closeUploadsModal(){
  var m=document.getElementById('uploads-modal'); if(m) m.style.display='none';
}

async function renderUploadsList(){
  var box=document.getElementById('uploads-list');
  var info=document.getElementById('uploads-info');
  if(!box) return;
  box.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:#94a3b8;">??목록 불러?�는 �?..</div>';
  try{
    var res=await fetch('/api/uploads');
    if(!res.ok){
      var j={}; try{ j=await res.json(); }catch(e){}
      throw new Error(j.error || ('list '+res.status));
    }
    var list=await res.json();
    if(info){
      var totalSize=list.reduce(function(s,it){return s+(it.size||0);},0);
      info.textContent='�?'+list.length+'�?· '+_fmtSize(totalSize);
    }
    if(!list.length){
      box.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:#94a3b8;">?�로?�된 ?��?지가 ?�습?�다.</div>';
      return;
    }
    box.innerHTML=list.map(function(it){
      var when=(it.modifiedAt||'').slice(0,16).replace('T',' ');
      return '<div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#fff;display:flex;flex-direction:column;">'
        +'<div style="position:relative;background:#f8fafc;aspect-ratio:1;display:flex;align-items:center;justify-content:center;overflow:hidden;">'
        +'<img src="'+_escAttr(it.url)+'" loading="lazy" style="max-width:100%;max-height:100%;object-fit:contain;" referrerpolicy="no-referrer">'
        +'</div>'
        +'<div style="padding:6px 8px;font-size:10px;color:#475569;border-top:1px solid #f1f5f9;overflow:hidden;">'
        +'<div style="font-family:\'DM Mono\',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="'+_escAttr(it.name)+'">'+_escAttr(it.name)+'</div>'
        +'<div style="color:#94a3b8;font-size:9px;margin-top:2px;">'+when+' · '+_fmtSize(it.size)+'</div>'
        +'</div>'
        +'<div style="display:flex;gap:4px;padding:6px 8px;border-top:1px solid #f1f5f9;background:#fafbff;">'
        +'<button onclick="uploadsCopyUrl(\''+_escAttr(it.url).replace(/\\\'/g,"\\'")+'\')" style="flex:1;padding:5px;background:#e0e7ff;color:#1e3a8a;border:none;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;">URL</button>'
        +'<button onclick="uploadsDelete(\''+_escAttr(it.name).replace(/\\\'/g,"\\'")+'\')" style="flex:1;padding:5px;background:#fee2e2;color:#991b1b;border:none;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;">??��</button>'
        +'</div>'
        +'</div>';
    }).join('');
  }catch(e){
    box.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:#dc2626;">??'+(e.message||'불러?�기 ?�패')+'</div>';
  }
}

async function uploadsDelete(name){
  if(!confirm('"'+name+'" ??��?�까?? (복구 불�?)')) return;
  try{
    var res=await fetch('/api/uploads/'+encodeURIComponent(name),{method:'DELETE'});
    if(!res.ok){
      var j={}; try{ j=await res.json(); }catch(e){}
      throw new Error(j.error || ('delete '+res.status));
    }
    showHint('?�� ??��?? '+name);
    await renderUploadsList();
  }catch(e){
    alert('??�� ?�패: '+e.message);
  }
}

function uploadsCopyUrl(url){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(function(){ showHint('?�� URL 복사??); },
                                            function(){ prompt('URL 복사:', url); });
  } else {
    prompt('URL 복사:', url);
  }
}

// ?�리뷰에???�용 중이지 ?��? ?��?지�??�괄 ??�� (중복/고아 ?�리)
async function uploadsDeleteDuplicates(){
  try{
    var res=await fetch('/api/uploads');
    if(!res.ok) throw new Error('list '+res.status);
    var list=await res.json();
    // ?�재 ?�리뷰에??참조 중인 ?�일�?집합
    var pv=document.getElementById('preview');
    var usedNames={};
    if(pv){
      pv.querySelectorAll('img').forEach(function(img){
        var s=img.getAttribute('src')||'';
        try{
          var u=new URL(s, location.href);
          var fn=decodeURIComponent(u.pathname.split('/').pop());
          if(fn) usedNames[fn]=true;
        }catch(e){}
      });
    }
    var orphans=list.filter(function(it){ return !usedNames[it.name]; });
    if(!orphans.length){ alert('?�리??미사???��?지가 ?�습?�다.'); return; }
    if(!confirm('?�재 ?�리뷰에???�용?��? ?�는 ?��?지 '+orphans.length+'개�? ??��?�니??\n(복구 불�?) 진행?�까??')) return;
    var okN=0, failN=0;
    for(var i=0;i<orphans.length;i++){
      try{
        var r=await fetch('/api/uploads/'+encodeURIComponent(orphans[i].name),{method:'DELETE'});
        if(r.ok) okN++; else failN++;
      }catch(e){ failN++; }
    }
    showHint('?�� ?�리 ?�료: '+okN+'�???��'+(failN?(' · ?�패 '+failN):''));
    await renderUploadsList();
  }catch(e){
    alert('?�리 ?�패: '+e.message);
  }
}

// 기본 21�??�션?�로 ?�로 ?�작
function tplNewDefault(){
  if(!confirm('?�재 ?�업???�라지�?기본 ?�플릿으�??�로 ?�작?�니?? 진행?�까??\n\n?�?�하지 ?��? 변경사??? 복구?????�습?�다.')) return;
  var TYPES=['hero','banner','hero','trust','proof','copy','infl','feat','duo','wearing','mood','angle','compare','story','style','pkg','size','info','wash','pd','faq','footer'];
  var preview=document.getElementById('preview'); if(!preview) return;
  preview.innerHTML='';
  for(var i=0;i<TYPES.length;i++){
    try{ addSection(TYPES[i]); } catch(err){ console.error('Section error:',TYPES[i],err); }
  }
  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
  closeTplModal();
  showHint('?�� 기본 ?�플릿으�??�작 (21�??�션)');
}

/*INIT_BEGIN*/(function(){
  var TYPES=['hero','banner','hero','trust','proof','copy','infl','feat','duo','wearing','mood','angle','compare','story','style','pkg','size','info','wash','pd','faq','footer'];
  var preview=document.getElementById('preview');
  if(!preview){alert('??#preview ?�소�?찾을 ???�습?�다');return;}
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
    // ?�체 ?�패 ???�면???�시
    preview.innerHTML='<div style="padding:40px;color:#dc2626;font-family:sans-serif;">'
      +'<h2>?�️ ?�션 로드 ?�패</h2>'
      +'<p>'+fail.join('<br>')+'</p>'
      +'<button onclick="location.reload()" style="margin-top:16px;padding:10px 20px;background:#4f9cf9;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">?�� ?�로고침</button>'
      +'</div>';
  } else if(fail.length>0){
    console.warn('?��? ?�션 ?�패:', fail);
  }
  try{renderEPCats(Object.keys(EP_CATS)[0]);}catch(e){console.warn('EP 초기???�류:',e);}
  document.querySelectorAll('.s-mood-copy,.s-mood-main-ov').forEach(function(el){el.remove();});
  // ?�체 ?�스???�바 ?�결
  setTimeout(function(){
    document.querySelectorAll('#preview [contenteditable]').forEach(function(el){
      if(typeof bindFT==='function')bindFT(el);
    });
  }, 500);
})();/*INIT_END*/
