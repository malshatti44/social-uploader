import { useState } from 'react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !caption) {
      setStatus('❌ يرجى اختيار صورة وكتابة تعليق');
      return;
    }

    setStatus('📤 جاري رفع الصورة...');

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'your_upload_preset'); // 🔁 غيّرها
    formData.append('folder', 'social-posts');

    const uploadRes = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', { // 🔁 غيّرها
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.secure_url) {
      setStatus('❌ فشل في رفع الصورة إلى Cloudinary');
      return;
    }

    setStatus('🚀 يتم إرسال البيانات إلى n8n...');

    await fetch('https://malshatti.app.n8n.cloud/webhook/social-media-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instagram_post_image: uploadData.secure_url,
        instagram_caption: caption,
        instagram_story_image: uploadData.secure_url,
        snapchat_image: uploadData.secure_url,
        snapchat_caption: caption,
        tiktok_image: uploadData.secure_url,
        tiktok_caption: caption,
      }),
    });

    setStatus('✅ تم الإرسال بنجاح!');
    setCaption('');
    setImageFile(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📸 أرسل صورة وكابشن إلى وسائل التواصل</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <br />
        <textarea
          placeholder="اكتب الكابشن هنا..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          style={{ width: '100%', marginTop: '1rem' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>🚀 إرسال</button>
      </form>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}

export default App;
