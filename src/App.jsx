import React, { useState } from "react";

// Основные цвета темы
const colors = {
  primary: "#27ae60", // Здоровый зеленый
  secondary: "#3498db", // Технологичный голубой
  error: "#e74c3c",
  bg: "#f8f9fa",
  text: "#2c3e50",
  card: "#ffffff"
};

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Твой ключ (Обязательно используй НОВЫЙ из AI Studio!)
  const GEMINI_API_KEY = "AIzaSyA3yM44bEfUrHxakIgkfb3PqV9VU6T3nh0"; 
  const MODEL_NAME = "gemini-flash-latest";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResult("");
    setError("");
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Full = reader.result;
      setImage(base64Full);

      try {
        const base64Data = base64Full.split(",")[1];

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: "Проанализируй фото еды. Составь список продуктов, укажи их примерный вес и калорийность. В конце напиши итоговую сумму калорий. Ответь кратко и понятно на русском языке." },
                  { inline_data: { mime_type: file.type, data: base64Data } }
                ]
              }]
            })
          }
        );

        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          setResult(aiText);
        } else {
          setError("AI не смог распознать еду. Попробуйте другой ракурс.");
        }
      } catch (err) {
        setError(`Ошибка: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>🍏 NutriScan <span style={{fontWeight: 300}}>AI</span></h1>
          <p style={styles.subtitle}>Твой персональный диетолог в кармане</p>
        </header>

        <label style={styles.uploadArea}>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          <div style={styles.uploadContent}>
            <span style={styles.icon}>📸</span>
            <span style={styles.uploadText}>
              {loading ? "Анализируем..." : "Нажмите, чтобы загрузить фото еды"}
            </span>
          </div>
        </label>

        {image && (
          <div style={styles.previewContainer}>
            <img src={image} alt="Preview" style={styles.preview} />
          </div>
        )}

        {(result || loading || error) && (
          <div style={styles.resultBox}>
            {loading ? (
              <div style={styles.loader}>
                <div style={styles.spinner}></div>
                <p>Сканируем нутриенты...</p>
              </div>
            ) : error ? (
              <p style={{ color: colors.error }}>{error}</p>
            ) : (
              <div style={styles.aiContent}>
                <h3 style={styles.resultTitle}>Результат анализа:</h3>
                <div style={styles.textContent}>{result}</div>
              </div>
            )}
          </div>
        )}
      </div>
      <footer style={styles.footer}>Powered by Gemini AI • NutriScan v2.0</footer>
    </div>
  );
};

// CSS-in-JS стили
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    color: colors.text
  },
  card: {
    backgroundColor: colors.card,
    width: "100%",
    maxWidth: "500px",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
    textAlign: "center"
  },
  header: {
    marginBottom: "30px"
  },
  title: {
    fontSize: "28px",
    margin: "0 0 10px 0",
    color: colors.primary
  },
  subtitle: {
    fontSize: "14px",
    color: "#7f8c8d",
    margin: 0
  },
  uploadArea: {
    display: "block",
    border: `2px dashed ${colors.primary}44`,
    borderRadius: "16px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: `${colors.primary}05`,
    marginBottom: "25px",
    ":hover": {
      backgroundColor: `${colors.primary}11`
    }
  },
  uploadContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  icon: {
    fontSize: "32px"
  },
  uploadText: {
    fontSize: "14px",
    fontWeight: "500",
    color: colors.primary
  },
  previewContainer: {
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "25px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
  },
  preview: {
    width: "100%",
    display: "block"
  },
  resultBox: {
    textAlign: "left",
    backgroundColor: "#fcfcfc",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #edf2f7",
    animation: "fadeIn 0.5s ease"
  },
  resultTitle: {
    fontSize: "16px",
    marginBottom: "10px",
    color: colors.text,
    borderBottom: `2px solid ${colors.primary}22`,
    paddingBottom: "5px"
  },
  textContent: {
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap"
  },
  loader: {
    textAlign: "center",
    padding: "20px",
    color: colors.secondary
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: `3px solid ${colors.secondary}22`,
    borderTop: `3px solid ${colors.secondary}`,
    borderRadius: "50%",
    margin: "0 auto 10px",
    animation: "spin 1s linear infinite"
  },
  footer: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#bdc3c7"
  }
};

// Добавляем анимацию через тег style
const globalStyles = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

export default App;
