// バックエンドのAPIのURLを指定します
const API_URL = 'http://127.0.0.1:5000/api/chat';

// メッセージを送信する関数です
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const message = inputField.value;
    const historyDiv = document.getElementById('chat-history');

    if (!message) return;

    // ユーザーのメッセージを表示
    historyDiv.innerHTML += `<div class="user-msg"><strong>あなた:</strong> ${message}</div>`;
    inputField.value = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.error) {
            alert('エラー: ' + data.error);
            historyDiv.innerHTML += `<div class="ai-msg" style="color:red;">エラー: ${data.error}</div>`;
        } else {
            // AIのメッセージを表示
            historyDiv.innerHTML += `<div class="ai-msg"><strong>Gemini:</strong> ${data.reply}</div>`;
        }
    } catch (error) {
        console.error('通信エラー:', error);
        historyDiv.innerHTML += `<div class="ai-msg" style="color:red;">システムエラーが発生しました</div>`;
    }
    
    // 自動スクロール
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

// Enterキーでの送信機能
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
