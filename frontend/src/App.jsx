import React, { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/characters/";

const initialForm = {
  name: "",
  character_class: "Воин",
  level: "5",
  weapon: "Меч",
  description: "",
};

function getValidationErrors(form) {
  const errors = {};
  if (form.name.trim().length < 3) {
    errors.name = "Введите не менее 3 символов.";
  }
  const level = Number(form.level);
  if (!Number.isInteger(level) || level < 1 || level > 100) {
    errors.level = "Уровень должен быть от 1 до 100.";
  }
  if (!form.description.trim()) {
    errors.description = "Добавьте описание персонажа.";
  }
  return errors;
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [character, setCharacter] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errors = getValidationErrors(form);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setRequestError("");
    setCharacter(null);
  }

  async function createCharacter(event) {
    event.preventDefault();
    if (Object.keys(errors).length || isSubmitting) return;

    setIsSubmitting(true);
    setRequestError("");
    setCharacter(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), level: Number(form.level), description: form.description.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        const detail = Object.values(data)
          .flat()
          .map((value) => (typeof value === "string" ? value : ""))
          .filter(Boolean)
          .join(" ");
        throw new Error(detail || "Не удалось создать персонажа.");
      }
      setCharacter(data);
    } catch (error) {
      setRequestError(
        error instanceof TypeError
          ? "Не удалось подключиться к Django API. Убедитесь, что сервер запущен."
          : error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="creator">
        <header className="page-header">
          <span className="eyebrow"><span className="eyebrow-line" /> CHARACTER FORGE</span>
          <h1>Создай своего<br /><span>персонажа</span></h1>
          <p>Собери героя, достойного легенд.</p>
        </header>

        <div className="content-grid">
          <form className="character-form" onSubmit={createCharacter} noValidate>
            <label className="field field-wide">
              <span className="field-label">Имя персонажа</span>
              <input
                autoComplete="off"
                maxLength={50}
                name="name"
                onChange={updateField}
                placeholder="Например, Артас"
                value={form.name}
              />
              {form.name.length > 0 && errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label className="field">
              <span className="field-label">Класс</span>
              <span className="select-wrap">
                <select name="character_class" onChange={updateField} value={form.character_class}>
                  <option>Воин</option>
                  <option>Маг</option>
                  <option>Лучник</option>
                  <option>Разбойник</option>
                </select>
              </span>
            </label>

            <label className="field">
              <span className="field-label">Уровень</span>
              <input
                max="100"
                min="1"
                name="level"
                onChange={updateField}
                type="number"
                value={form.level}
              />
              {form.level && errors.level && <span className="field-error">{errors.level}</span>}
            </label>

            <label className="field field-wide">
              <span className="field-label">Оружие</span>
              <span className="select-wrap">
                <select name="weapon" onChange={updateField} value={form.weapon}>
                  <option>Меч</option>
                  <option>Посох</option>
                  <option>Лук</option>
                  <option>Кинжалы</option>
                </select>
              </span>
            </label>

            <label className="field field-wide">
              <span className="field-label">Описание</span>
              <textarea
                maxLength={1000}
                name="description"
                onChange={updateField}
                placeholder="Расскажи немного о своём герое..."
                rows="3"
                value={form.description}
              />
              {form.description.length > 0 && errors.description && (
                <span className="field-error">{errors.description}</span>
              )}
            </label>

            {requestError && <p className="request-error" role="alert">{requestError}</p>}

            <button
              className="create-button field-wide"
              disabled={Object.keys(errors).length > 0 || isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? "СОЗДАЁМ..." : "СОЗДАТЬ ПЕРСОНАЖА"}</span>
              <span aria-hidden="true" className="button-arrow">↗</span>
            </button>
          </form>

          <aside aria-live="polite" className={`preview ${character ? "preview-created" : ""}`}>
            <div className="preview-topline">
              <span>{character ? "ГЕРОЙ СОЗДАН" : "ТВОЙ ГЕРОЙ"}</span>
              <span className="preview-status"><i /> {character ? "ГОТОВ" : "НАЧАЛО ПУТИ"}</span>
            </div>
            <div className="emblem" aria-hidden="true">
              <span>{character?.character_class === "Маг" ? "✧" : character?.character_class === "Лучник" ? "➶" : "⚔"}</span>
            </div>
            {character ? (
              <>
                <h2 className="character-name">{character.name}</h2>
                <dl className="character-stats">
                  <div><dt>Класс</dt><dd>{character.character_class}</dd></div>
                  <div><dt>Уровень</dt><dd>{character.level}</dd></div>
                  <div><dt>Оружие</dt><dd>{character.weapon}</dd></div>
                </dl>
                <p className="character-description">{character.description}</p>
                <p className="success-message"><span>✓</span> Персонаж создан</p>
              </>
            ) : (
              <div className="empty-preview">
                <h2>Здесь появится<br />твой герой</h2>
                <p>Заполни анкету, и мы отправим его в мир приключений.</p>
              </div>
            )}
            <div className="preview-rune rune-one">✳</div>
            <div className="preview-rune rune-two">✳</div>
          </aside>
        </div>
        <footer><span>✦</span> ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</footer>
      </section>
    </main>
  );
}
