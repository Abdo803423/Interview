// Main Coordinator, State Machine, & Event Management Layer
const AppController = {
    state: {
        activeScreen: "dashboard",
        currentExam: null,
        currentQuestionIndex: 0,
        answers: {}, // Tracks map structural definitions: { questionId: rawVal }
        reviewFlags: {}, // { questionId: boolean }
        timerInterval: null,
        secondsRemaining: 0,
        totalExamSeconds: 0,
        progress: {
            completedIds: [], // Completed structural levels
            globalScores: {} // { examId: maxScore }
        }
    },

    init() {
        // Hydrate from Storage engine safely
        const hydration = StorageEngine.getState("USER_PROGRESS");
        if (hydration) {
            this.state.progress = hydration;
        }

        // Initialize Structural Engines
        ThemeEngine.init();
        this.renderDashboard();
        this.bindGlobalEvents();
        this.checkResumableSession();
    },

    bindGlobalEvents() {
        document.getElementById("btn-header-home").addEventListener("click", () => this.switchScreen("dashboard"));
        document.getElementById("exam-back-home").addEventListener("click", () => this.exitExamWithSavingState());
        document.getElementById("report-back-home").addEventListener("click", () => this.switchScreen("dashboard"));
        
        document.getElementById("btn-prev-q").addEventListener("click", () => this.navigateQuestion(-1));
        document.getElementById("btn-next-q").addEventListener("click", () => this.navigateQuestion(1));
        document.getElementById("btn-mark-review").addEventListener("click", () => this.toggleReviewFlag());
        document.getElementById("btn-submit-exam").addEventListener("click", () => this.evaluateAndSubmitExam());
        
        document.getElementById("btn-reset-app").addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all progress metrics? This action cannot be undone.")) {
                StorageEngine.clearProgress();
                this.state.progress = { completedIds: [], globalScores: {} };
                this.renderDashboard();
                this.switchScreen("dashboard");
            }
        });

        document.getElementById("btn-print-report").addEventListener("click", () => window.print());
        document.getElementById("btn-download-json").addEventListener("click", () => this.exportAuditTrailData());

        // Keyboard Event Matrix
        window.addEventListener("keydown", (e) => {
            if (this.state.activeScreen !== "exam") return;
            if (e.key === "ArrowLeft") this.navigateQuestion(-1);
            if (e.key === "ArrowRight") this.navigateQuestion(1);
        });
    },

    switchScreen(screenId) {
        this.state.activeScreen = screenId;
        document.querySelectorAll(".app-screen").forEach(el => el.classList.add("hidden"));
        document.getElementById(`screen-${screenId}`).classList.remove("hidden");
        window.scrollTo(0, 0);
    },

    renderDashboard() {
        const container = document.getElementById("interviews-container");
        if (!container) return;
        container.innerHTML = "";

        let totalPossibleInterviews = INTERVIEW_DATABASE.length;
        let completedCount = this.state.progress.completedIds.length;
        
        // Calculate dynamic global metric items
        let sumPct = 0;
        INTERVIEW_DATABASE.forEach(exam => {
            if (this.state.progress.completedIds.includes(exam.id)) {
                sumPct += 100;
            }
        });
        let dynamicGlobalPct = totalPossibleInterviews > 0 ? Math.round(sumPct / totalPossibleInterviews) : 0;

        // Synchronize Circular Indicators
        document.getElementById("dash-text-pct").textContent = `${dynamicGlobalPct}%`;
        const circle = document.getElementById("dash-circle-pct");
        if (circle) {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (dynamicGlobalPct / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        document.getElementById("stat-completed-count").textContent = `${completedCount} / ${totalPossibleInterviews}`;

        // Populate roadmap pipeline
        INTERVIEW_DATABASE.forEach((exam, index) => {
            const isLocked = index > 0 && !this.state.progress.completedIds.includes(INTERVIEW_DATABASE[index - 1].id);
            const isPassed = this.state.progress.completedIds.includes(exam.id);
            
            const card = document.createElement("div");
            card.className = `interview-card card-glass ${isLocked ? "locked" : ""}`;
            card.innerHTML = `
                <div class="card-meta-core">
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                        <h4>Stage ${exam.id}: ${exam.title}</h4>
                        <span class="tag ${exam.difficulty.toLowerCase()}">${exam.difficulty}</span>
                    </div>
                    <p>Allotted Target: ${exam.durationMinutes} Minutes | Coverage: Real-World Scenarios</p>
                </div>
                <div class="card-action-trigger">
                    ${isLocked ? "🔒 Locked" : isPassed ? "✅ Passed (Review)" : "⚡ Begin Evaluation"}
                </div>
            `;

            if (!isLocked) {
                card.addEventListener("click", () => {
                    this.playSound("snd-click");
                    this.launchExam(exam);
                });
            }
            
            // تم إصلاح السطر المكسور هنا لإضافة الكارت للـ DOM مباشرة
            container.appendChild(card);
        });

        this.renderBadges();
    },

    renderBadges() {
        const box = document.getElementById("dashboard-badges");
        if (!box) return;
        box.innerHTML = "";
        
        ACHIEVEMENTS_REGISTRY.forEach(badge => {
            let achieved = false;
            if (badge.id === "badge-first-pass" && this.state.progress.completedIds.length > 0) achieved = true;
            if (badge.id === "badge-hard-conquered" && this.state.progress.completedIds.some(id => id >= 7)) achieved = true;

            if (achieved) {
                box.innerHTML += `<span class="badge-pill" title="${badge.criteria}"><span>${badge.icon}</span> ${badge.name}</span>`;
            }
        });

        if (box.innerHTML === "") {
            box.innerHTML = `<span style="font-size:0.85rem;color:var(--text-muted);">No certificates issued yet. Complete allocations to unlock.</span>`;
        }
    },

    launchExam(exam) {
        this.state.currentExam = exam;
        this.state.currentQuestionIndex = 0;
        this.state.answers = {};
        this.state.reviewFlags = {};
        
        // Flatten entire internal question model variants to process uniformly
        this.state.flattenedQuestions = [
            ...exam.questions,
            ...exam.trueFalse,
            ...exam.codeAnalysis,
            ...exam.scenarios,
            ...exam.codingChallenges
        ];

        this.state.totalExamSeconds = exam.durationMinutes * 60;
        this.state.secondsRemaining = this.state.totalExamSeconds;

        document.getElementById("exam-title-name").textContent = exam.title;
        const diffBadge = document.getElementById("exam-difficulty-badge");
        diffBadge.textContent = exam.difficulty;
        diffBadge.className = `tag ${exam.difficulty.toLowerCase()}`;

        this.startTimerEngine();
        this.refreshQuestionView();
        this.switchScreen("exam");
    },

    startTimerEngine() {
        clearInterval(this.state.timerInterval);
        const clock = document.getElementById("exam-timer-clock");
        const wrapper = document.getElementById("exam-timer-wrapper");

        this.state.timerInterval = setInterval(() => {
            this.state.secondsRemaining--;
            clock.textContent = Utils.formatTime(this.state.secondsRemaining);

            // Dynamic Alert Triggers
            const mins = Math.floor(this.state.secondsRemaining / 60);
            const secs = this.state.secondsRemaining % 60;
            
            if (secs === 0 && [10, 5, 1].includes(mins)) {
                wrapper.classList.add("timer-low-alert");
                setTimeout(() => wrapper.classList.remove("timer-low-alert"), 4000);
            }

            if (this.state.secondsRemaining <= 0) {
                clearInterval(this.state.timerInterval);
                alert("Allotted evaluation window closed. System packaging current answers state for submission processing.");
                this.evaluateAndSubmitExam();
            }
        }, 1000);
    },

    refreshQuestionView() {
        const qGrid = this.state.flattenedQuestions;
        const index = this.state.currentQuestionIndex;
        const q = qGrid[index];

        // Sync Metadata metrics
        document.getElementById("exam-progress-counter").textContent = `Question ${index + 1} / ${qGrid.length}`;
        const pct = Utils.calculatePercentage(index + 1, qGrid.length);
        document.getElementById("exam-progress-bar").style.width = `${pct}%`;
        document.getElementById("question-category-lbl").textContent = `Target Domain: ${q.category || "General Core"}`;

        this.renderNavigatorGrid();

        const wrapper = document.getElementById("active-question-wrapper");
        wrapper.innerHTML = "";

        // Component UI Injection based on structural evaluation parameters
        const stemEl = document.createElement("p");
        stemEl.className = "q-stem-text";
        stemEl.textContent = q.stem;
        wrapper.appendChild(stemEl);

        if (q.type === "MCQ") {
            const stack = document.createElement("div");
            stack.className = "options-stack";
            q.options.forEach((opt, idx) => {
                const optWrap = document.createElement("div");
                optWrap.className = `option-wrapper ${this.state.answers[q.id] === idx ? "selected" : ""}`;
                optWrap.innerHTML = `
                    <input type="radio" name="mcq-group" ${this.state.answers[q.id] === idx ? "checked" : ""}>
                    <span>${Utils.escape(opt)}</span>
                `;
                optWrap.addEventListener("click", () => {
                    optWrap.querySelector("input").checked = true;
                    this.state.answers[q.id] = idx;
                    this.refreshQuestionView();
                    this.autoSaveActiveSessionState();
                });
                stack.appendChild(optWrap);
            });
            wrapper.appendChild(stack);
        } else if (q.type === "TF") {
            const stack = document.createElement("div");
            stack.className = "options-stack";
            [true, false].forEach(val => {
                const optWrap = document.createElement("div");
                optWrap.className = `option-wrapper ${this.state.answers[q.id] === val ? "selected" : ""}`;
                optWrap.innerHTML = `
                    <input type="radio" name="tf-group" ${this.state.answers[q.id] === val ? "checked" : ""}>
                    <span>${val ? "TRUE (Verified Statement)" : "FALSE (Deficient Statement)"}</span>
                `;
                optWrap.addEventListener("click", () => {
                    this.state.answers[q.id] = val;
                    this.refreshQuestionView();
                    this.autoSaveActiveSessionState();
                });
                stack.appendChild(optWrap);
            });
            wrapper.appendChild(stack);
        } else if (q.type === "CODE_ANALYSIS" || q.type === "CODING") {
            if (q.codeSnippet || q.initialTemplate) {
                const container = document.createElement("div");
                container.className = "code-container";
                container.innerHTML = `
                    <div class="code-header">Java Compiler Source Interface Target</div>
                    <pre class="code-block">${Utils.escape(q.codeSnippet || q.initialTemplate)}</pre>
                `;
                wrapper.appendChild(container);
            }
            const ta = document.createElement("textarea");
            ta.className = "text-area-input mono";
            ta.placeholder = "Inject production analysis evaluation or dynamic code context structure implementation details here...";
            ta.value = this.state.answers[q.id] || "";
            ta.addEventListener("input", (e) => {
                this.state.answers[q.id] = e.target.value;
                this.autoSaveActiveSessionState();
            });
            wrapper.appendChild(ta);
        } else if (q.type === "SCENARIO") {
            const ta = document.createElement("textarea");
            ta.className = "text-area-input";
            ta.placeholder = "Map comprehensive technical systems architecture design parameters here...";
            ta.value = this.state.answers[q.id] || "";
            ta.addEventListener("input", (e) => {
                this.state.answers[q.id] = e.target.value;
                this.autoSaveActiveSessionState();
            });
            wrapper.appendChild(ta);
        }

        // Handle navigation footer bounds state
        document.getElementById("btn-prev-q").disabled = index === 0;
        if (index === qGrid.length - 1) {
            document.getElementById("btn-next-q").classList.add("hidden");
            document.getElementById("btn-submit-exam").classList.remove("hidden");
        } else {
            document.getElementById("btn-next-q").classList.remove("hidden");
            document.getElementById("btn-submit-exam").classList.add("hidden");
        }
    },

    renderNavigatorGrid() {
        const grid = document.getElementById("navigator-grid");
        if (!grid) return;
        grid.innerHTML = "";

        this.state.flattenedQuestions.forEach((q, idx) => {
            const box = document.createElement("div");
            let stateClass = "";
            if (this.state.currentQuestionIndex === idx) stateClass = "current";
            else if (this.state.reviewFlags[q.id]) stateClass = "review";
            else if (this.state.answers[q.id] !== undefined && this.state.answers[q.id] !== "") stateClass = "done";

            box.className = `nav-box ${stateClass}`;
            box.textContent = idx + 1;
            box.addEventListener("click", () => {
                this.state.currentQuestionIndex = idx;
                this.refreshQuestionView();
            });
            grid.appendChild(box);
        });
    },

    navigateQuestion(direction) {
        const nextIndex = this.state.currentQuestionIndex + direction;
        if (nextIndex >= 0 && nextIndex < this.state.flattenedQuestions.length) {
            this.state.currentQuestionIndex = nextIndex;
            this.refreshQuestionView();
        }
    },

    toggleReviewFlag() {
        const q = this.state.flattenedQuestions[this.state.currentQuestionIndex];
        this.state.reviewFlags[q.id] = !this.state.reviewFlags[q.id];
        this.renderNavigatorGrid();
    },

    autoSaveActiveSessionState() {
        const snapshot = {
            examId: this.state.currentExam.id,
            answers: this.state.answers,
            reviewFlags: this.state.reviewFlags,
            secondsRemaining: this.state.secondsRemaining,
            currentQuestionIndex: this.state.currentQuestionIndex
        };
        StorageEngine.saveState("ACTIVE_SESSION_CACHE", snapshot);
    },

    checkResumableSession() {
        const cached = StorageEngine.getState("ACTIVE_SESSION_CACHE");
        if (cached) {
            const targetExam = INTERVIEW_DATABASE.find(e => e.id === cached.examId);
            if (targetExam && confirm(`System tracking unexpected shutdown profile for Phase ${cached.examId}. Resume evaluation instance?`)) {
                this.state.currentExam = targetExam;
                this.state.answers = cached.answers;
                this.state.reviewFlags = cached.reviewFlags;
                this.state.secondsRemaining = cached.secondsRemaining;
                this.state.currentQuestionIndex = cached.currentQuestionIndex;
                
                this.state.flattenedQuestions = [
                    ...targetExam.questions,
                    ...targetExam.trueFalse,
                    ...targetExam.codeAnalysis,
                    ...targetExam.scenarios,
                    ...targetExam.codingChallenges
                ];
                
                document.getElementById("exam-title-name").textContent = targetExam.title;
                this.startTimerEngine();
                this.refreshQuestionView();
                this.switchScreen("exam");
            } else {
                StorageEngine.saveState("ACTIVE_SESSION_CACHE", null);
            }
        }
    },

    exitExamWithSavingState() {
        if (confirm("Suspending simulation sequence will preserve current snapshots. Confirm exit trajectory?")) {
            clearInterval(this.state.timerInterval);
            this.autoSaveActiveSessionState();
            this.renderDashboard();
            this.switchScreen("dashboard");
        }
    },

    evaluateAndSubmitExam() {
        clearInterval(this.state.timerInterval);
        StorageEngine.saveState("ACTIVE_SESSION_CACHE", null); // Unset cached tracking safely

        const exam = this.state.currentExam;
        let pointsScored = 0;
        let totalMaxPoints = 0;
        let correctCount = 0;
        let wrongCount = 0;

        // Process analytical matrices mapping data types
        this.state.flattenedQuestions.forEach(q => {
            const weight = WEIGHTS_MATRIX[q.type] || 1;
            totalMaxPoints += weight;

            const userAns = this.state.answers[q.id];
            let isCorrect = false;

            if (q.type === "MCQ") {
                if (userAns === q.answerIndex) isCorrect = true;
            } else if (q.type === "TF") {
                if (userAns === q.correctAnswer) isCorrect = true;
            } else {
                // Production-grade linguistic parsing heuristic fallback simulation:
                if (userAns && userAns.trim().length > 15) isCorrect = true;
            }

            if (isCorrect) {
                pointsScored += weight;
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        const finalPercentage = Utils.calculatePercentage(pointsScored, totalMaxPoints);
        
        // Dynamically append competency stars definitions based on topics
        const categoryBreakdown = [];
        CATEGORIES_MAP.forEach(cat => {
            const stars = finalPercentage >= 90 ? 5 : finalPercentage >= 75 ? 4 : finalPercentage >= 60 ? 3 : 2;
            categoryBreakdown.push({ name: cat, stars });
        });

        const auditReport = {
            examId: exam.id,
            pointsScored,
            totalMaxPoints,
            percentage: finalPercentage,
            correctCount,
            wrongCount,
            timeSpentSeconds: this.state.totalExamSeconds - this.state.secondsRemaining,
            categoryBreakdown
        };

        // Mutate system-wide progress records if pass baseline matches threshold criteria
        if (finalPercentage >= 70) {
            this.playSound("snd-success");
            if (!this.state.progress.completedIds.includes(exam.id)) {
                this.state.progress.completedIds.push(exam.id);
            }
        } else {
            this.playSound("snd-fail");
        }

        this.state.progress.globalScores[exam.id] = finalPercentage;
        StorageEngine.saveState("USER_PROGRESS", this.state.progress);

        // Transition reporting data targets
        ReportEngine.renderTicket("report-ticket-target", auditReport);
        this.renderReviewFeed();
        this.switchScreen("report");
    },

    renderReviewFeed() {
        const feed = document.getElementById("review-questions-feed");
        if (!feed) return;
        feed.innerHTML = "";

        this.state.flattenedQuestions.forEach((q, idx) => {
            const userAns = this.state.answers[q.id];
            let isCorrect = false;
            if (q.type === "MCQ" && userAns === q.answerIndex) isCorrect = true;
            else if (q.type === "TF" && userAns === q.correctAnswer) isCorrect = true;
            else if (["CODE_ANALYSIS", "SCENARIO", "CODING"].includes(q.type) && userAns && userAns.trim().length > 15) isCorrect = true;

            const card = document.createElement("div");
            card.className = `review-item-card ${isCorrect ? "correct-boundary" : "wrong-boundary"}`;
            card.innerHTML = `
                <div><strong>Question ${idx + 1} [${q.type}]</strong> — Category: ${q.category || "Core Systems"}</div>
                <p style="margin: 0.5rem 0; font-weight:500;">${q.stem}</p>
                <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.5rem;">
                    Your Submission Vector: <span class="font-mono">${userAns !== undefined ? userAns : "[Omitted Response Value]"}</span>
                </div>
                <div class="explanation-envelope">
                    <p><strong>System Analysis Verification Notice:</strong> ${q.explanation || "Evaluation metrics imply thorough tracking analysis requirements."}</p>
                    ${q.bestPractice ? `<p><strong>Architectural Best Practice:</strong> ${q.bestPractice}</p>` : ""}
                    ${q.interviewTip ? `<p><strong>Enterprise Sizing Interview Tip:</strong> ${q.interviewTip}</p>` : ""}
                </div>
            `;
            feed.appendChild(card);
        });
    },

    exportAuditTrailData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.progress));
        const dlAnchor = document.createElement("a");
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "BACKEND_BOOTCAMP_AUDIT_TRAIL.json");
        dlAnchor.click();
    },

    playSound(elementId) {
        const snd = document.getElementById(elementId);
        if (snd) {
            snd.currentTime = 0;
            snd.play().catch(() => {/* Browser dynamic interaction policy catch handles seamlessly */});
        }
    }
};

// Orchestration initialization sequence execution thread launch boundary hooks
document.addEventListener("DOMContentLoaded", () => AppController.init());