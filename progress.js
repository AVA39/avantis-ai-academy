import { db } from './firebase-config.js';
import {
  doc, setDoc, getDoc, getDocs,
  collection, serverTimestamp, query
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ---------- レッスン進捗 ----------

export async function markLessonComplete(uid, lessonId) {
  const ref = doc(db, 'progress', uid, 'lessons', lessonId);
  await setDoc(ref, { completed: true, completedAt: serverTimestamp() }, { merge: true });
}

export async function getLessonProgress(uid) {
  const snap = await getDocs(collection(db, 'progress', uid, 'lessons'));
  const map = {};
  snap.forEach(d => { map[d.id] = d.data(); });
  return map;
}

export async function isLessonComplete(uid, lessonId) {
  const snap = await getDoc(doc(db, 'progress', uid, 'lessons', lessonId));
  return snap.exists() && snap.data().completed === true;
}

// ---------- クイズ結果 ----------

export async function saveQuizResult(uid, quizId, score, total) {
  const ref = doc(db, 'progress', uid, 'quizzes', quizId);
  await setDoc(ref, { score, total, completedAt: serverTimestamp() }, { merge: true });
}

export async function getQuizResults(uid) {
  const snap = await getDocs(collection(db, 'progress', uid, 'quizzes'));
  const map = {};
  snap.forEach(d => { map[d.id] = d.data(); });
  return map;
}

// ---------- Claude API キー ----------

export async function getApiKey() {
  const snap = await getDoc(doc(db, 'config', 'claude'));
  if (!snap.exists()) return null;
  return snap.data().apiKey || null;
}

export async function saveApiKey(uid, apiKey) {
  // 管理者のみ呼び出す想定
  await setDoc(doc(db, 'config', 'claude'), { apiKey, updatedBy: uid, updatedAt: serverTimestamp() }, { merge: true });
}

// ---------- 全体集計 ----------

export function calcStats(lessonProgress, quizResults, curriculum) {
  const total = curriculum.lessons.length;
  const completedLessons = Object.values(lessonProgress).filter(l => l.completed).length;
  const totalLevels = 5;
  let completedLevels = 0;

  for (let lv = 1; lv <= totalLevels; lv++) {
    const qResult = quizResults[`quiz-${lv}`];
    if (qResult && qResult.score / qResult.total >= 0.8) completedLevels++;
  }

  return { total, completedLessons, completedLevels };
}
