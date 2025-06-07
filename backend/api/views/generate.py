from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from openai import OpenAI

# Cấu hình DeepSeek API
client = OpenAI(
    api_key="sk-448fabfc586b442daee4d626f7bdf81b",  # ⚠️ Thay bằng API Key thật
    base_url="https://api.deepseek.com"
)

@csrf_exempt
def generate_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        input_text = data.get("input_text", "").strip()

        if not input_text:
            return JsonResponse({"error": "Missing input_text"}, status=400)

        # Gửi yêu cầu đến DeepSeek API để sinh ra 10 câu hỏi + lời giải
        prompt = (
            f"Đề bài gốc: '{input_text}'\n"
            "Hãy tạo 5 câu hỏi toán học khác nhau dành cho học sinh cấp 2, mỗi câu hỏi nên liên quan đến đề bài gốc nhưng sử dụng các khái niệm hoặc phương pháp giải khác.\n"
            "Sau mỗi câu hỏi, hãy viết lời giải hoặc đáp án ở dòng kế tiếp.\n"
            "Định dạng:\n"
            "Câu 1: ...\nĐáp án: ...\nCâu 2: ...\nĐáp án: ...\n...(cho đến Câu 10)"
        )

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Bạn là một trợ lý toán học chuyên tạo câu hỏi sáng tạo cho học sinh cấp 2. "
                        "Mỗi câu hỏi cần rõ ràng, đa dạng và có lời giải hoặc đáp án ngay sau đó."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1024,
        )

        choices = response.choices
        if choices and choices[0].message and choices[0].message.content:
            result = choices[0].message.content.strip()
        else:
            result = "⚠️ Không nhận được phản hồi từ mô hình."

        return JsonResponse({"result": result})

    except Exception as e:
        print("❌ Error:", str(e))
        return JsonResponse({"error": str(e)}, status=500)