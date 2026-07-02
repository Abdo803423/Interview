// Technical Auditing Report Generator
const ReportEngine = {
    renderTicket(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const isPass = data.percentage >= 70;
        const statusClass = isPass ? "PASS" : "FAIL";

        let starsHtml = "";
        data.categoryBreakdown.forEach(cat => {
            starsHtml += `
                <div class="stars-row">
                    <span>${cat.name}</span>
                    <span class="stars-display">${"★".repeat(cat.stars)}${"☆".repeat(5 - cat.stars)}</span>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="ticket-wrapper">
                <h2 style="text-align:center;margin-bottom:1rem;">=== TECHNICAL INTERVIEW REPORT ===</h2>
                <div class="ticket-grid">
                    <div class="ticket-metric"><span>Candidate Audit ID</span><strong>CAND-${Math.floor(Math.random() * 90000) + 10000}</strong></div>
                    <div class="ticket-metric"><span>Interview Target</span><strong>Interview Unit #${data.examId}</strong></div>
                    <div class="ticket-metric"><span>Processing Date</span><strong>${new Date().toLocaleDateString()}</strong></div>
                    <div class="ticket-metric"><span>Time Transpired</span><strong>${Utils.formatTime(data.timeSpentSeconds)}</strong></div>
                </div>
                
                <div class="ticket-grid">
                    <div class="ticket-metric"><span>Raw Points</span><strong>${data.pointsScored} / ${data.totalMaxPoints}</strong></div>
                    <div class="ticket-metric"><span>Percentage Efficiency</span><strong>${data.percentage}%</strong></div>
                    <div class="ticket-metric"><span>Metric Evaluation</span><strong>${data.correctCount} Correct / ${data.wrongCount} Failed</strong></div>
                </div>

                <div class="ticket-decision-banner ${statusClass}">
                    DECISION: ${isPass ? "PROCEED TO NEXT STRUCTURAL PHASE" : "RE-EVALUATION ENFORCED"}
                </div>

                <div style="margin-top:1.5rem;">
                    <h4 style="margin-bottom:0.75rem;border-bottom:1px dashed rgba(56,189,248,0.5);padding-bottom:0.25rem;">Topic Competency Matrix</h4>
                    ${starsHtml}
                </div>

                <div style="margin-top:1.5rem;font-size:0.85rem;color:var(--text-secondary);">
                    <strong>Interviewer Engineering Notes:</strong><br/>
                    Candidate demonstrated analytical baseline patterns matching production-level engineering expectations. Recommended focus on transaction isolation bounds if accuracy drops below threshold parameters.
                </div>
            </div>
        `;
    }
};