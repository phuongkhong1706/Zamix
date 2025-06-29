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

        prompt = (
            f"Đề bài gốc: '{input_text}'\n"
            "Hãy tạo 5 câu hỏi trắc nghiệm Toán học dành cho học sinh cấp 2 dựa trên đề bài trên.\n"
            "Yêu cầu:\n"
            "- Mỗi câu hỏi bắt đầu bằng 'Câu 1:', 'Câu 2:', v.v.\n"
            "- Sau đó là 4 lựa chọn trả lời, viết theo định dạng:\n"
            "  A. ...\n"
            "  B. ...\n"
            "  C. ...\n"
            "  D. ...\n"
            "- Một dòng 'Đáp án: ' để chỉ lựa chọn đúng, ví dụ: 'Đáp án: B'\n"
            "- Một dòng 'Mức độ: ' là số nguyên từ 1 đến 3, trong đó:\n"
            "  + 1: dễ\n"
            "  + 2: trung bình\n"
            "  + 3: khó\n"
            "- Một dòng 'Chủ đề: <số>' chỉ ra mã chủ đề của câu hỏi, ví dụ: 'Chủ đề: 1'\n"
            "- Nếu có công thức Toán học, hãy viết bằng định dạng LaTeX, ví dụ căn x thì viết là: '$\\sqrt{x}$'\n"
            "\n"
            "⚠️ Chỉ sinh ra các câu hỏi theo đúng định dạng sau (không thêm văn bản, lời giải hoặc giải thích nào):\n"
            "Câu 1: Nội dung câu hỏi\n"
            "A. ...\n"
            "B. ...\n"
            "C. ...\n"
            "D. ...\n"
            "Đáp án: A\n"
            "Mức độ: 1\n"
            "Chủ đề: 1\n"
            "(Lặp lại đến Câu 5)\n"
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