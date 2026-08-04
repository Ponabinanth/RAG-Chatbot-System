import { useState } from 'react';
import { motion } from 'framer-motion';

interface Course { name: string; grade: string; credits: string; }

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

function calcGPA(courses: Course[]): number | null {
  let totalPoints = 0, totalCredits = 0;
  for (const c of courses) {
    const pts = GRADE_POINTS[c.grade];
    const cred = parseFloat(c.credits);
    if (pts === undefined || isNaN(cred) || cred <= 0) continue;
    totalPoints += pts * cred;
    totalCredits += cred;
  }
  if (totalCredits === 0) return null;
  return totalPoints / totalCredits;
}

function getGPAColor(gpa: number) {
  if (gpa >= 3.7) return '#34d399';
  if (gpa >= 3.0) return '#6c63ff';
  if (gpa >= 2.0) return '#f59e0b';
  return '#f87171';
}

function getGPALabel(gpa: number) {
  if (gpa >= 3.7) return 'Excellent! 🏆';
  if (gpa >= 3.0) return 'Good Standing 👍';
  if (gpa >= 2.0) return 'Satisfactory 📚';
  return 'Needs Improvement 💪';
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: 'Calculus I', grade: 'A', credits: '3' },
    { name: 'Physics', grade: 'B+', credits: '4' },
    { name: 'English', grade: 'A-', credits: '3' },
  ]);

  const updateCourse = (i: number, field: keyof Course, value: string) => {
    setCourses(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  };

  const addCourse = () => setCourses(prev => [...prev, { name: '', grade: 'A', credits: '3' }]);
  const removeCourse = (i: number) => setCourses(prev => prev.filter((_, idx) => idx !== i));

  const gpa = calcGPA(courses);

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(16,185,129,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📊</div>
        <div>
          <div className="tool-page-title">GPA Calculator</div>
          <div className="tool-page-desc">Calculate your weighted GPA instantly</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Table */}
        <div className="card">
          <div className="section-title mb-4">📝 Your Courses</div>
          <table className="gpa-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Credits</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={i}>
                  <td>
                    <input
                      className="form-input"
                      value={c.name}
                      onChange={e => updateCourse(i, 'name', e.target.value)}
                      placeholder="Course name"
                      style={{ padding: '6px 10px', fontSize: 13 }}
                    />
                  </td>
                  <td>
                    <select className="form-select" value={c.grade} onChange={e => updateCourse(i, 'grade', e.target.value)}
                      style={{ padding: '6px 10px', fontSize: 13 }}>
                      {Object.keys(GRADE_POINTS).map(g => <option key={g}>{g}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-input"
                      type="number"
                      value={c.credits}
                      onChange={e => updateCourse(i, 'credits', e.target.value)}
                      min="1" max="6"
                      style={{ padding: '6px 10px', fontSize: 13, width: 70 }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeCourse(i)} style={{ color: 'var(--text-muted)' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-secondary btn-sm" onClick={addCourse} style={{ marginTop: 12 }}>
            + Add Course
          </button>
        </div>

        {/* Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your GPA</div>
            {gpa !== null ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={gpa.toFixed(2)}>
                <div className="gpa-result" style={{ background: `linear-gradient(135deg, ${getGPAColor(gpa)}, var(--brand-primary))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {gpa.toFixed(2)}
                </div>
                <div style={{ fontSize: 16, color: getGPAColor(gpa), fontWeight: 700, marginTop: 8 }}>
                  {getGPALabel(gpa)}
                </div>
                <div className="progress-bar" style={{ marginTop: 16 }}>
                  <div className="progress-fill" style={{ width: `${(gpa / 4.0) * 100}%`, background: `linear-gradient(90deg, ${getGPAColor(gpa)}, var(--brand-primary))` }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{gpa.toFixed(2)} / 4.00</div>
              </motion.div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Add courses to calculate</div>
            )}
          </div>

          {/* Grade Chart */}
          <div className="card">
            <div className="section-title mb-4">📈 Grade Scale</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[['A / A+', '4.0', '#34d399'], ['A-', '3.7', '#34d399'], ['B+', '3.3', '#6c63ff'], ['B', '3.0', '#6c63ff'], ['B-', '2.7', '#8b5cf6'], ['C+ / C / C-', '1.7–2.3', '#f59e0b'], ['D', '1.0', '#f97316'], ['F', '0.0', '#f87171']].map(([g, pts, color]) => (
                <div key={g} className="flex items-center gap-3" style={{ fontSize: 13 }}>
                  <span style={{ width: 90, color: 'var(--text-secondary)' }}>{g}</span>
                  <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${(parseFloat(pts) / 4) * 100}%`, height: '100%', background: color, borderRadius: 4 }} />
                  </div>
                  <span style={{ color, fontWeight: 700 }}>{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

