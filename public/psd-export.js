/* psd-export.js — 레이어 분리 PSD 내보내기 (포토샵 편집용)
   - 하단: 배경/빈박스 래스터(텍스트·이미지 숨김 후 html2canvas)
   - 이미지 레이어: 슬롯 이미지마다 개별 레이어
   - 텍스트 레이어: 각 텍스트 블록 = 편집 가능한 PS 텍스트 레이어
   의존: window.agPsd (ag-psd.js), window.html2canvas */
(function () {
  'use strict';

  function rgbToObj(str) {
    var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(str || '');
    if (!m) return { r: 34, g: 34, b: 34 };
    return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]) };
  }

  // 에디터 전용 UI(크롬) — PSD에서 제외
  var CHROME_SEL = '.sec-ov, .bg-pop, .ss-theme, .sec-toolbar, .iz-ov, .iz-in, .iz-del, .iz-move, .tf-handle, .ss-move-handle, .resize-bar';

  // 텍스트 리프 = 보이는 텍스트가 있고, 텍스트를 가진 자식 요소가 없는 가장 안쪽 요소
  function isTextLeaf(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.closest('.iz') || el.closest(CHROME_SEL)) return false;
    if (el.classList.contains('sec-ov') || el.classList.contains('iz-lbl') || el.classList.contains('iz-px')) return false;
    var txt = (el.innerText || '').trim();
    if (!txt) return false;
    // 자식 중 텍스트를 가진 element가 있으면 리프 아님
    for (var i = 0; i < el.children.length; i++) {
      if ((el.children[i].innerText || '').trim()) return false;
    }
    var cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
    return true;
  }

  function collectTextLeaves(root) {
    var out = [];
    root.querySelectorAll('*').forEach(function (el) { if (isTextLeaf(el)) out.push(el); });
    return out;
  }

  function collectImages(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.iz.has-image img, img.tf-img'))
      .filter(function (im) { return im.naturalWidth > 0 || im.width > 0; });
  }

  async function elementToCanvas(el, scale, opt) {
    var o = { backgroundColor: null, scale: scale, useCORS: true, allowTaint: false, logging: false };
    if (opt) for (var k in opt) o[k] = opt[k];
    return await window.html2canvas(el, o);
  }

  async function savePSD(opts) {
    opts = opts || {};
    var scale = opts.scale || 2;
    var preview = document.getElementById('preview');
    if (!preview) { alert('미리보기를 찾을 수 없습니다.'); return; }
    if (!window.agPsd || !window.agPsd.writePsd) { alert('ag-psd 로드 실패 (ag-psd.js 확인)'); return; }
    if (!window.html2canvas) { alert('html2canvas 로드 실패'); return; }

    var btnTxt = '⚙ PSD 생성 중...';
    if (opts.onProgress) opts.onProgress(btnTxt);

    // 웹폰트 로드 완료까지 대기 — 안 그러면 측정 후 리플로우로 텍스트 위치/문서높이 어긋남
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });

    var baseRect = preview.getBoundingClientRect();
    // 실제 콘텐츠 최대 바닥값(BCR 기준, 텍스트/이미지 좌표계와 동일)으로 문서 높이 산정
    var maxBottom = preview.scrollHeight;
    preview.querySelectorAll('*').forEach(function (el) {
      try { var rr = el.getBoundingClientRect(); var bot = rr.bottom - baseRect.top; if (bot > maxBottom) maxBottom = bot; } catch (e) {}
    });
    // PSD는 30000×30000 한계. 초과 시: 가능하면 스케일을 낮춰 PSD 유지,
    // 원본 자체가 한계를 넘으면 PSB(대형문서, 포토샵에서 열림)로 자동 전환.
    var PSD_LIMIT = 30000, PSB_LIMIT = 300000;
    var contentMaxDim = Math.max(baseRect.width, maxBottom);
    var psb = false;
    if (contentMaxDim * scale > PSD_LIMIT) {
      var fit = PSD_LIMIT / contentMaxDim;
      if (fit >= 1) {
        scale = Math.floor(fit * 100) / 100;       // 예: 1.87× — PSD 유지
      } else {
        psb = true;
        scale = Math.min(scale, Math.floor((PSB_LIMIT / contentMaxDim) * 100) / 100);
      }
    }
    var docW = Math.max(1, Math.round(baseRect.width * scale));
    var docH = Math.max(1, Math.ceil(maxBottom * scale));

    var textLeaves = collectTextLeaves(preview);
    var images = collectImages(preview);

    // 크롬(에디터 UI)은 생성 내내 숨김 — bg/이미지 캡처에 안 잡히게
    function mkHider() {
      var store = [];
      return {
        hide: function (el) { if (el) { store.push([el, el.style.visibility]); el.style.visibility = 'hidden'; } },
        restore: function () { store.forEach(function (h) { h[0].style.visibility = h[1]; }); store = []; }
      };
    }
    var chrome = mkHider();
    var layers = [];
    try {
      preview.querySelectorAll(CHROME_SEL).forEach(chrome.hide);

      // 1) 배경 래스터: (크롬 숨김 상태에서) 텍스트·채워진 이미지슬롯 임시 숨김 → 캡처 → 복원
      var temp = mkHider();
      var bgCanvas;
      try {
        textLeaves.forEach(temp.hide);
        images.forEach(function (im) { temp.hide(im.closest('.iz') || im); });
        bgCanvas = await elementToCanvas(preview, scale, { height: Math.ceil(docH / scale), windowHeight: Math.ceil(docH / scale) });
      } finally { temp.restore(); }
      layers.push({ name: '배경', canvas: bgCanvas, left: 0, top: 0 });

      // 2) 이미지 레이어 (슬롯별 개별, 크롬 숨김 상태라 오버레이/핸들 없이 깨끗)
      for (var i = 0; i < images.length; i++) {
        try {
          var im = images[i];
          var host = im.closest('.iz') || im;
          var r = host.getBoundingClientRect();
          var c = await elementToCanvas(host, scale);
          layers.push({
            name: '이미지 ' + (i + 1),
            canvas: c,
            left: Math.round((r.left - baseRect.left) * scale),
            top: Math.round((r.top - baseRect.top) * scale)
          });
        } catch (e) { /* 이미지 1건 실패해도 계속 */ }
      }
    } finally { chrome.restore(); }

    // 3) 텍스트 레이어 (편집 가능)
    for (var j = 0; j < textLeaves.length; j++) {
      try {
        var el = textLeaves[j];
        var rr = el.getBoundingClientRect();
        var cs = getComputedStyle(el);
        var fontPx = (parseFloat(cs.fontSize) || 14) * scale;
        var left = Math.round((rr.left - baseRect.left) * scale);
        var top = Math.round((rr.top - baseRect.top) * scale);
        var content = (el.innerText || '').replace(/ /g, ' ').replace(/\n/g, '\r').trim();
        if (!content) continue;
        var famRaw = (cs.fontFamily || 'sans-serif').split(',')[0].replace(/["']/g, '').trim();
        var fontName = famRaw.replace(/\s+/g, '');
        layers.push({
          name: '텍스트: ' + content.slice(0, 16),
          text: {
            text: content,
            transform: [1, 0, 0, 1, left, top + fontPx],
            style: {
              font: { name: fontName || 'NotoSansKR' },
              fontSize: fontPx,
              fillColor: rgbToObj(cs.color),
              fauxiliary: false
            },
            paragraphStyle: {
              justification: cs.textAlign === 'right' ? 'right' : (cs.textAlign === 'center' ? 'center' : 'left')
            }
          }
        });
      } catch (e) { /* 텍스트 1건 실패해도 계속 */ }
    }

    var psd = { width: docW, height: docH, children: layers };
    var buffer = window.agPsd.writePsd(psd, { generateThumbnail: true, invalidateTextLayers: true, psb: psb });
    if (opts.returnBuffer) { return { buffer: Array.from(new Uint8Array(buffer)), layers: layers.length, width: docW, height: docH, psb: psb, scale: scale }; }
    var ext = psb ? '.psb' : '.psd';
    var blob = new Blob([buffer], { type: 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'detail-page-' + (new Date().toISOString().slice(0, 10)) + ext;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);

    if (opts.onProgress) opts.onProgress('done');
    return { layers: layers.length, width: docW, height: docH, psb: psb, scale: scale };
  }

  window.savePSD = function () {
    var btn = document.getElementById('psd-btn');
    var prev = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '⚙ PSD 생성 중...'; }
    savePSD({ scale: 2 }).then(function (res) {
      if (btn) { btn.disabled = false; btn.innerHTML = prev; }
      if (res) console.log('PSD 생성:', res);
    }).catch(function (e) {
      if (btn) { btn.disabled = false; btn.innerHTML = prev; }
      alert('PSD 생성 실패: ' + (e && e.message ? e.message : e));
      console.error(e);
    });
  };

  // 헤드리스 검증용 노출
  window.__savePSD_core = savePSD;
})();
