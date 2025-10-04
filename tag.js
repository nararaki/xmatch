const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const maxChecked = 3; // 選択できるチェックボックスの最大数

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    if (checkedCount >= maxChecked) {
      checkboxes.forEach((cb) => {
        if (!cb.checked) {
          cb.disabled = true; // 3つ以上の選択を防ぐために、他のチェックボックスを無効化
        }
      });
    } else {
      checkboxes.forEach((cb) => cb.disabled = false); // 3つ未満の場合はすべて選択可能にする
    }
  });
});
document.getElementById('interestForm').addEventListener('submit', function(event) {
  event.preventDefault();  // フォームのデフォルト動作を防止

  // スポーツにチェックされているか確認
  const isSportsChecked = document.getElementById('sports').checked;

  if (isSportsChecked) {
    // スポーツが選択されていたらsports.htmlへリダイレクト
    window.location.href = 'sports.html';
  } else {
    alert('スポーツ以外が選択されました');
    // 他のページに飛ばすか、何もしない
  }
});

