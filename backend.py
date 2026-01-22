# Flaskというウェブアプリケーションフレームワークを読み込みます
from flask import Flask, request, jsonify
# 異なるオリジン（ドメインやポート）からのアクセスを許可するためのライブラリを読み込みます
from flask_cors import CORS
# Googleの生成AIライブラリを読み込みます
import google.generativeai as genai
# OSの機能を使うためのライブラリを読み込みます
import os

# Flaskアプリを作成します
app = Flask(__name__)
# フロントエンドからのアクセスを許可するようにCORSを設定します（開発用）
CORS(app)

# Google GeminiのAPIキーを設定します
# 直接書き込む代わりに、環境変数から読み込みます（安全で管理しやすい）
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("環境変数 GOOGLE_API_KEY が設定されていません")
# ライブラリにAPIキーを設定します
genai.configure(api_key=GOOGLE_API_KEY)

# Geminiのモデルを準備します。ここでは 'gemini-pro' (テキスト用モデル) を使用します
model = genai.GenerativeModel('gemini-pro')

# '/api/chat' というURLに対するPOSTリクエストを受け付ける設定をします
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # フロントエンドから送られてきたデータ（JSON形式）を取得します
        data = request.json
        # データの中から 'message' というキーの値（ユーザーのメッセージ）を取り出します
        user_message = data.get('message')

        # メッセージが空だった場合のエラー処理です
        if not user_message:
            # 400エラー（不正なリクエスト）としてエラーメッセージを返します
            return jsonify({"error": "メッセージがありません"}), 400

        # Geminiモデルにユーザーのメッセージを送信して、コンテンツ（返信）を生成させます
        response = model.generate_content(user_message)

        # 生成されたテキスト部分を取得します
        reply_text = response.text

        # フロントエンドに返すための結果をJSON形式で作成して返します
        return jsonify({"reply": reply_text})

    except Exception as e:
        # 何かサーバー側でエラーが起きた場合、エラー内容をログに出力します
        print(f"Error: {e}")
        # 500エラー（サーバー内部エラー）としてエラーメッセージを返します
        return jsonify({"error": str(e)}), 500

# このスクリプトが直接実行された場合に、サーバーを起動します
if __name__ == '__main__':
    # デバッグモードでサーバーをポート5000で起動します
    app.run(debug=True, port=5000)
