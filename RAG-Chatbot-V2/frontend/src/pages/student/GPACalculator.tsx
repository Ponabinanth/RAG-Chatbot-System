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
