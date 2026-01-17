import { useState } from 'react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned'); // اسم الـ preset اللي أنشأناه
    formData.append('folder', 'social-posts');

    const res = await fetch('https://api.cloudinary.com/v1_1/dovqci8ka/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.secure_url);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h2>📤 ارفع صورة مع كابشن</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

      {preview && <img src={preview} alt="preview" style={{ width: '100%', marginTop: 10 }} />}

      <textarea
        placeholder="اكتب الكابشن هنا"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ width: '100%', marginTop: 10 }}
        rows={3}
      />

      <button onClick={handleUpload} style={{ marginTop: 10 }}>
        رفع الصورة
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: 20 }}>
          <p>✅ تم رفع الصورة بنجاح:</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;
