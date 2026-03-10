(function () {
  'use strict';

  // 【共通設定】定数・DOM参照

  // 企画カードの設定（画像パスと表示ラベル）
  const PLAN_DATA = [
    {
      id:    'plan01',
      label: '企画 01',
      src:   '/assets/img/zen-mktg-pgm_vote/plan_01.jpg',
      alt:   '企画01 フライヤー',
    },
    {
      id:    'plan02',
      label: '企画 02',
      src:   '/assets/img/zen-mktg-pgm_vote/plan_02.jpg',
      alt:   '企画02 フライヤー',
    },
    {
      id:    'plan03',
      label: '企画 03',
      src:   '/assets/img/zen-mktg-pgm_vote/plan_03.jpg',
      alt:   '企画03 フライヤー',
    },
  ];

  /* ----------------------------------------------------------
     【Google Form 設定】
     ※ entry.XXXXXXXXX のIDはGoogleフォームのプリフィルURLから取得。
     　 取得手順:
     　 1. Googleフォームを編集画面で開く
     　 2. 右上「︙」→「事前入力したURLを取得」をクリック
     　 3. 各質問に仮の値を入力して「リンクを取得」
     　 4. 生成されたURLの entry.XXXXXXXXX= の部分がフィールドID
     ---------------------------------------------------------- */
  const GF_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdF1tMeN2ZFF9qbrs-abknSIu94F1SkjnjJ4kFfRkbEoOD_ng/formResponse';

  // プリフィルURLから取得したフィールドID（確定済み）
  const GF_FIELDS = {
    q1: 'entry.655742653',  // 最も興味を引かれた企画
    q2: 'entry.904571166',  // 興味をひかれた理由
    q3: 'entry.294969970',  // 年代
    q4: 'entry.55658265',   // 性別
    q5: 'entry.1154503395', // お住まい
  };

  // Googleフォームの選択肢テキストと完全一致させるマッピング
  const GF_VALUES = {
    q1: { '1': '企画01',   '2': '企画02',   '3': '企画03' },
    q3: { 'u10': '10代以下', '20s': '20代', '30s': '30代', '40s': '40代', '50p': '50代以上' },
    q4: { 'male': '男性',  'female': '女性', 'other': 'その他' },
    q5: { 'tochigi': '栃木県内', 'ibaraki': '関東', 'tokyo': '東北', 'other': 'それ以外' },
  };

  // 拡大関連
  const overlay    = document.getElementById('zvp-modal-overlay');
  const modalImg   = document.getElementById('zvp-modal-img');
  const modalLabel = document.getElementById('zvp-modal-label');
  const modalClose = document.getElementById('zvp-modal-close');
  const modalBack  = document.getElementById('zvp-modal-back-btn');

  // ポップアップ
  const toast = document.getElementById('zvp-toast');


  // 【画像拡大】開く・閉じる処理

  /**
   * モーダルを開く
   * @param {string} src   画像パス
   * @param {string} alt   altテキスト
   * @param {string} label 表示ラベル（「企画 01」など）
   */
  function openModal(src, alt, label) {
    modalImg.src            = src;
    modalImg.alt            = alt;
    modalLabel.textContent  = label;
    overlay.style.display   = 'flex';

    // フェードイン（rAFで1フレーム後に適用）
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('zvp-modal--open');
      });
    });

    // スクロール防止
    document.body.style.overflow = 'hidden';

    // 閉じるボタンにフォーカス（アクセシビリティ）
    modalClose.focus();
  }

  /**
   * モーダルを閉じる
   */
  function closeModal() {
    overlay.classList.remove('zvp-modal--open');
    document.body.style.overflow = '';

    // トランジション終了後に display:none
    overlay.addEventListener('transitionend', function handler() {
      overlay.style.display = 'none';
      overlay.removeEventListener('transitionend', handler);
    });
  }

  // 閉じるボタン
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // 「戻る」ボタン
  if (modalBack) modalBack.addEventListener('click', closeModal);

  // オーバーレイ背景クリックで閉じる
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  // Escキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('zvp-modal--open')) {
      closeModal();
    }
  });


  // 【企画カード】イベント設定

  function initPlanCards() {
    PLAN_DATA.forEach(function (plan) {
      const card = document.getElementById(plan.id);
      if (!card) return;

      // クリック: 拡大モーダル表示
      card.addEventListener('click', function () {
        openModal(plan.src, plan.alt, plan.label);
      });

      // Enterキー / Spaceキーでも開く（キーボード操作対応）
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(plan.src, plan.alt, plan.label);
        }
      });
    });
  }


  // 【投票フォーム】バリデーション & Google Form 送信

  /**
   * トースト通知を表示する
   * @param {string} message - 表示するメッセージ
   * @param {boolean} isError - true のときエラー色にする
   */
  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.background = isError ? '#e53935' : '';
    toast.classList.add('zvp-toast--show');
    setTimeout(function () {
      toast.classList.remove('zvp-toast--show');
      toast.style.background = '';
    }, 3500);
  }

  /**
   * フィールドエラーをインラインで表示する
   * @param {HTMLElement} field   - エラー対象のフィールド要素
   * @param {string}      message - エラーメッセージ
   */
  function showFieldError(field, message) {
    if (!field) return;

    // 既存エラーを削除
    const existing = field.parentElement.querySelector('.zvp-field-error');
    if (existing) existing.remove();

    const err = document.createElement('p');
    err.className  = 'zvp-field-error';
    err.style.cssText = 'color:#e53935;font-size:1.2rem;margin-top:4px;';
    err.textContent = message;
    field.parentElement.appendChild(err);

    // 変更されたらエラーを消す
    field.addEventListener('change', function () {
      err.remove();
    }, { once: true });
  }

  /**
   * フォームのバリデーションを実行する
   * @returns {boolean} 全項目OKならtrue
   */
  function validateForm() {
    let valid = true;
    const required = [
      { id: 'zvp-q1', msg: '最も興味を引かれた企画を選択してください。' },
      { id: 'zvp-q3', msg: '年代を選択してください。' },
      { id: 'zvp-q4', msg: '性別を選択してください。' },
      { id: 'zvp-q5', msg: 'お住まいを選択してください。' },
    ];

    required.forEach(function (item) {
      const el = document.getElementById(item.id);
      if (!el || !el.value) {
        showFieldError(el, item.msg);
        if (valid) el && el.focus(); // 最初のエラーにフォーカス
        valid = false;
      }
    });

    return valid;
  }

  /**
   * Google Form にデータを fetch で送信する（no-cors）
   * ※ Google Form は CORS 非対応のため no-cors モードを使用。
   * 　 レスポンスの内容は読み取れないが、データはフォームに記録される。
   */
  function submitToGoogleForm(data) {
    // Google Form は application/x-www-form-urlencoded を期待するため
    // FormData ではなく URLSearchParams を使用する
    const params = new URLSearchParams();

    params.append(GF_FIELDS.q1, GF_VALUES.q1[data.q1] || data.q1);
    params.append(GF_FIELDS.q2, data.q2 || '');
    params.append(GF_FIELDS.q3, GF_VALUES.q3[data.q3] || data.q3 || '');
    params.append(GF_FIELDS.q4, GF_VALUES.q4[data.q4] || data.q4 || '');
    params.append(GF_FIELDS.q5, GF_VALUES.q5[data.q5] || data.q5 || '');

    return fetch(GF_ACTION, {
      method:  'POST',
      mode:    'no-cors', // Google Form は CORS 非対応のため必須
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
    });
  }

  /**
   * 送信後のUI処理（フォームをリセット・サンクスメッセージ表示）
   */
  function showThanksState() {
    const formBox = document.querySelector('.zvp-form-box');
    if (!formBox) return;

    // フォームをサンクスメッセージに差し替え
    formBox.innerHTML = `
      <div class="zvp-thanks">
        <p class="zvp-thanks__icon">✅</p>
        <p class="zvp-thanks__title">ご投票ありがとうございました！</p>
      </div>
    `;
  }

  /**
   * フォームの初期化・送信イベント設定
   */
  function initForm() {
    const submitBtn = document.getElementById('zvp-submit-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', async function () {
      // バリデーション
      if (!validateForm()) return;

      // 送信中の状態にする
      submitBtn.disabled    = true;
      submitBtn.textContent = '送信中…';

      const data = {
        q1: document.getElementById('zvp-q1').value,
        q2: document.getElementById('zvp-q2').value,
        q3: document.getElementById('zvp-q3').value,
        q4: document.getElementById('zvp-q4').value,
        q5: document.getElementById('zvp-q5').value,
      };

      try {
        await submitToGoogleForm(data);
        // no-cors のためレスポンスの成否は判定できないが、
        // fetch が resolve した時点で送信は完了とみなす
        showThanksState();

      } catch (err) {
        console.error('[zvp] 送信エラー:', err);
        submitBtn.disabled    = false;
        submitBtn.textContent = '投票する';
        showToast('送信に失敗しました。もう一度お試しください。', true);
      }
    });
  }


  // 【初期化】DOMContentLoaded 後に実行
  document.addEventListener('DOMContentLoaded', function () {
    initPlanCards();
    initForm();
  });

})();