export default function AboutPage() {
  return (
    <>
      <div className="about-hero">
        <p className="section-label">About the Project</p>
        <h2 className="section-title text-cream">Life in Rhythm</h2>
        <p className="text-[rgba(247,243,236,0.65)] max-w-[560px] mx-auto mt-3 leading-[1.7]">
          A capstone-level caregiving training simulation built to prepare students for the TESDA NC II Caregiving qualification assessment.
        </p>
      </div>

      <div className="about-content">
        <div className="about-grid">
          <div className="about-card fade-in">
            <h3>🎯 Project Overview</h3>
            <p>
              Life in Rhythm is an Android mobile game developed in Unity that simulates the day-to-day responsibilities of a professional caregiver. Players interact with virtual patients, make care decisions, and are assessed against TESDA's competency benchmarks.
            </p>
          </div>
          <div className="about-card fade-in">
            <h3>📋 TESDA NC II Alignment</h3>
            <ul>
              <li>Personal Care &amp; Hygiene Assistance</li>
              <li>Mobility &amp; Transfer Techniques</li>
              <li>Medication Administration Basics</li>
              <li>Nutrition &amp; Feeding Support</li>
              <li>Safety &amp; Emergency Procedures</li>
              <li>Communication with Patients &amp; Families</li>
            </ul>
          </div>
          <div className="about-card fade-in">
            <h3>📐 Scoring Methodology</h3>
            <ul>
              <li>Decisions are evaluated in real time</li>
              <li>Scores aggregate across all care modules</li>
              <li>Penalties for unsafe caregiving actions</li>
              <li>Bonus points for empathy &amp; best practices</li>
              <li>Final score submitted via REST API to MongoDB</li>
            </ul>
          </div>
          <div className="about-card fade-in">
            <h3>🛠 Tech Stack</h3>
            <p>Built using a modern cross-platform stack.</p>
            <div className="tech-badges">
              <span className="tech-badge">Unity 2022+</span>
              <span className="tech-badge">Android / APK</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">Express.js</span>
              <span className="tech-badge">MongoDB</span>
              <span className="tech-badge">Mongoose</span>
              <span className="tech-badge">REST API</span>
              <span className="tech-badge">C#</span>
            </div>
          </div>
        </div>

        <div className="about-full fade-in">
          <h3>🔌 API Endpoints</h3>
          <p className="text-[var(--text-mid)] text-[0.9rem] mb-4">
            The Unity game communicates with the backend using these REST endpoints. Configure your <code className="bg-[var(--cream)] p-[2px_6px] rounded-[4px] text-[0.85em]">BASE_URL</code> in your Unity project settings.
          </p>
          <div className="api-box">
            <h4>REST API Reference</h4>
            <div className="api-endpoint">
              <span className="method-badge method-get">GET</span>
              <span className="api-path">/api/scores</span>
              <span className="api-desc">Get all scores (sorted by score desc)</span>
            </div>
            <div className="api-endpoint">
              <span className="method-badge method-get">GET</span>
              <span className="api-path">/api/scores/top/:n</span>
              <span className="api-desc">Get top N scores</span>
            </div>
            <div className="api-endpoint">
              <span className="method-badge method-post">POST</span>
              <span className="api-path">/api/scores</span>
              <span className="api-desc">Submit new score</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
