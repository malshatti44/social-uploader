import { useState } from "react";

export default function App() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  // Cloudinary upload
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned"); // ⚠️ استبدلها من Cloudinary
    formData.append("cloud_name", "dovqci8ka");       // ⚠️ استبدلها من Cloudinary

    const res = await fetch("https://api.cloudinary.com/v1_1/dovqci8ka/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // الرابط النهائي للصورة
  };

  // Send to n8n Webhook
  const handleSubmit = async () => {
    if (!file || !caption) return alert("الرجاء رفع صورة وكتابة تعليق");

    setStatus("جاري الرفع...");

    try {
      const imageUrl = await uploadToCloudinary(file);

      await fetch("https://malshatti.app.n8n.cloud/webhook/social-media-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instagram_post_image: imageUrl,
          instagram_story_image: imageUrl,
          tiktok_image: imageUrl,
          snapchat_image: imageUrl,
          instagram_caption: caption,
          instagram_story_caption: caption,
          tiktok_caption: caption,
          snapchat_caption: caption,
        }),
      });

      setStatus("✅ تم إرسال البيانات بنجاح!");
      setCaption("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("❌ حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h2>نشر صورة وتعليق</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <br /><br />

      <textarea
        rows={4}
        placeholder="اكتب الكابشن هنا..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ width: "100%" }}
      />
      <br /><br />

      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        إرسال
      </button>

      <p>{status}</p>
    </div>
  );
}
