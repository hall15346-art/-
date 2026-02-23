// ============================================
// 주식회사 팔로우엔 - 영업부서 파이프라인
// 메인 JavaScript 파일
// ============================================

// 초기 15개 단계 데이터
const initialStages = [
    { id: 1, name: "1차콜 (통화량)", role: "신입사원", daily: true, count: 0 },
    { id: 2, name: "1차자료 발송", role: "신입사원", daily: true, count: 0 },
    { id: 3, name: "1.5차자료 발송 (통계자료)", role: "신입사원", daily: true, count: 0 },
    { id: 4, name: "작일콜 (1.5차자료 발송 후)", role: "사원", daily: false, count: 0 },
    { id: 5, name: "1.5차자료 발송 (후기특자료)", role: "신입사원", daily: true, count: 0 },
    { id: 6, name: "감성특", role: "신입사원", daily: false, count: 0 },
    { id: 7, name: "프로모션특/콜", role: "신입사원", daily: false, count: 0 },
    { id: 8, name: "재통픽스 & 팀장 토스구간", role: "신입사원", daily: false, count: 0 },
    { id: 9, name: "팀장 재통시트 작성", role: "사원", daily: false, count: 0 },
    { id: 10, name: "팀장 재통 및 토스", role: "팀장", daily: false, count: 0 },
    { id: 11, name: "미팅", role: "팀장", daily: true, count: 0 },
    { id: 12, name: "팀장가망관리", role: "팀장", daily: true, count: 0 },
    { id: 13, name: "계약 완료", role: "계약완료", daily: true, count: 0 },
    { id: 14, name: "2차 자료", role: "사원", daily: true, count: 0 },
    { id: 15, name: "팀원 당일시트 이동", role: "사원", daily: true, count: 0 }
];

// 전역 상태
let stages = [];
let dailyDb = 0;
let editingStageId = null;
let sortable = null;
let chart = null;

// DOM 요소
const splash = document.getElementById('splash');
const mainApp = document.getElementById('mainApp');
const currentDateEl = document.getElementById('currentDate');
const dailyDbInput = document.getElementById('dailyDb');
const btnReset = document.getElementById('btnReset');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const pipelineContainer = document.getElementById('pipelineContainer');
const dailyContainer = document.getElementById('dailyContainer');
const btnAdd = document.getElementById('btnAdd');
const stageModal = document.getElementById('stageModal');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const btnModalCancel = document.getElementById('btnModalCancel');
const btnModalSave = document.getElementById('btnModalSave');
const stageNameInput = document.getElementById('stageName');
const stageRoleSelect = document.getElementById('stageRole');
const stageDailyCheckbox = document.getElementById('stageDaily');

// ============================================
// 초기화
// ============================================

function init() {
    // 스플래시 화면 처리
    setTimeout(() => {
        splash.classList.add('hidden');
        mainApp.classList.remove('hidden');
    }, 3000);

    // 데이터 로드
    loadData();

    // 현재 날짜 표시
    updateCurrentDate();

    // 이벤트 리스너
    setupEventListeners();

    // 화면 렌더링
    renderPipeline();
    renderDaily();

    // Sortable 초기화
    initSortable();
}

// ============================================
// 데이터 관리
// ============================================

function loadData() {
    const savedStages = localStorage.getItem('followen_stages');
    const savedDb = localStorage.getItem('followen_dailyDb');

    if (savedStages) {
        stages = JSON.parse(savedStages);
    } else {
        stages = [...initialStages];
        saveData();
    }

    if (savedDb) {
        dailyDb = parseInt(savedDb);
        dailyDbInput.value = dailyDb;
    }
}

function saveData() {
    localStorage.setItem('followen_stages', JSON.stringify(stages));
    localStorage.setItem('followen_dailyDb', dailyDb);
}

function resetData() {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
        stages = [...initialStages];
        dailyDb = 0;
        dailyDbInput.value = 0;
        saveData();
        renderPipeline();
        renderDaily();
        renderChart();
        alert('데이터가 초기화되었습니다.');
    }
}

// ============================================
// 날짜 업데이트
// ============================================

function updateCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[today.getDay()];

    currentDateEl.textContent = `${year}.${month}.${date} (${day})`;
}

// ============================================
// 이벤트 리스너 설정
// ============================================

function setupEventListeners() {
    // 탭 전환
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // DB 투입량 입력
    dailyDbInput.addEventListener('input', (e) => {
        dailyDb = parseInt(e.target.value) || 0;
        saveData();
    });

    // 리셋 버튼
    btnReset.addEventListener('click', resetData);

    // 추가 버튼
    btnAdd.addEventListener('click', openAddModal);

    // 모달 닫기
    modalClose.addEventListener('click', closeModal);
    btnModalCancel.addEventListener('click', closeModal);

    // 모달 저장
    btnModalSave.addEventListener('click', saveStage);

    // 모달 외부 클릭 시 닫기
    stageModal.addEventListener('click', (e) => {
        if (e.target === stageModal) {
            closeModal();
        }
    });
}

// ============================================
// 탭 전환
// ============================================

function switchTab(tabName) {
    // 모든 탭 비활성화
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // 선택된 탭 활성화
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // 차트 탭이면 렌더링
    if (tabName === 'chart') {
        renderChart();
    }
}

// ============================================
// 파이프라인 렌더링
// ============================================

function renderPipeline() {
    pipelineContainer.innerHTML = '';

    stages.forEach(stage => {
        const card = createStageCard(stage);
        pipelineContainer.appendChild(card);
    });
}

function createStageCard(stage) {
    const card = document.createElement('div');
    card.className = `stage-card role-${stage.role}`;
    card.dataset.id = stage.id;

    const conversionRate = calculateConversionRate(stage.id);

    card.innerHTML = `
        <div class="stage-header">
            <div>
                <div class="stage-number">${stage.id}</div>
                <div class="stage-title">${stage.name}</div>
                <div class="stage-badges">
                    <span class="badge badge-role">
                        <i class="fas fa-user"></i>
                        ${stage.role}
                    </span>
                    <span class="badge ${stage.daily ? 'badge-daily' : 'badge-not-daily'}">
                        <i class="fas fa-${stage.daily ? 'check-circle' : 'times-circle'}"></i>
                        ${stage.daily ? '일별확인' : '별도확인'}
                    </span>
                </div>
            </div>
            <div class="stage-actions">
                <button class="btn-icon edit" onclick="openEditModal(${stage.id})" title="수정">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteStage(${stage.id})" title="삭제">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="stage-body">
            <div class="input-group">
                <label>
                    <i class="fas fa-chart-line"></i>
                    진행수
                </label>
                <input type="number" 
                       value="${stage.count}" 
                       min="0" 
                       onchange="updateStageCount(${stage.id}, this.value)"
                       placeholder="0">
            </div>
            <div class="stage-stats">
                <div class="stat-item">
                    <div class="stat-label">전환율</div>
                    <div class="stat-value">${conversionRate}%</div>
                </div>
            </div>
        </div>
    `;

    return card;
}

// ============================================
// 일별 추적 렌더링
// ============================================

function renderDaily() {
    dailyContainer.innerHTML = '';

    const dailyStages = stages.filter(stage => stage.daily);

    dailyStages.forEach(stage => {
        const card = createDailyCard(stage);
        dailyContainer.appendChild(card);
    });
}

function createDailyCard(stage) {
    const card = document.createElement('div');
    card.className = 'daily-card';

    card.innerHTML = `
        <div class="daily-header">
            <div class="daily-number">${stage.id}</div>
            <div class="daily-title">${stage.name}</div>
        </div>
        <div class="stage-badges">
            <span class="badge badge-role">
                <i class="fas fa-user"></i>
                ${stage.role}
            </span>
        </div>
        <div class="daily-input">
            <input type="number" 
                   value="${stage.count}" 
                   min="0" 
                   onchange="updateStageCount(${stage.id}, this.value)"
                   placeholder="0">
        </div>
    `;

    return card;
}

// ============================================
// 퍼널 차트 렌더링
// ============================================

function renderChart() {
    const canvas = document.getElementById('funnelChart');
    const ctx = canvas.getContext('2d');

    // 기존 차트 제거
    if (chart) {
        chart.destroy();
    }

    // 데이터 준비
    const labels = stages.map(s => s.name);
    const data = stages.map(s => s.count);
    const colors = stages.map(s => {
        switch(s.role) {
            case '신입사원': return '#F4C842';
            case '사원': return '#E85555';
            case '팀장': return '#4BBFBF';
            case '계약완료': return '#4CAF50';
            default: return '#95A5A6';
        }
    });

    // 차트 생성
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '진행수',
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(27, 138, 74, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#2ECC71',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.x;
                            const rate = calculateConversionRate(context.dataIndex + 1);
                            return `진행수: ${value} | 전환율: ${rate}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                            size: 12,
                            weight: 500
                        }
                    }
                }
            }
        }
    });

    // 통계 렌더링
    renderChartStats();
}

function renderChartStats() {
    const statsEl = document.getElementById('chartStats');
    
    const totalStart = stages[0]?.count || 0;
    const totalEnd = stages[stages.length - 1]?.count || 0;
    const overallRate = totalStart > 0 ? ((totalEnd / totalStart) * 100).toFixed(1) : 0;

    statsEl.innerHTML = `
        <div class="chart-stat-card">
            <div class="chart-stat-label">시작 DB</div>
            <div class="chart-stat-value">${totalStart}</div>
        </div>
        <div class="chart-stat-card">
            <div class="chart-stat-label">최종 계약</div>
            <div class="chart-stat-value">${totalEnd}</div>
        </div>
        <div class="chart-stat-card">
            <div class="chart-stat-label">전체 전환율</div>
            <div class="chart-stat-value">${overallRate}%</div>
        </div>
    `;
}

// ============================================
// 전환율 계산
// ============================================

function calculateConversionRate(stageId) {
    const currentStage = stages.find(s => s.id === stageId);
    const prevStage = stages.find(s => s.id === stageId - 1);

    if (!currentStage || !prevStage || prevStage.count === 0) {
        return 0;
    }

    return ((currentStage.count / prevStage.count) * 100).toFixed(1);
}

// ============================================
// 단계 수치 업데이트
// ============================================

function updateStageCount(stageId, value) {
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
        stage.count = parseInt(value) || 0;
        saveData();
        renderPipeline();
        renderDaily();
    }
}

// ============================================
// 모달 열기/닫기
// ============================================

function openAddModal() {
    editingStageId = null;
    modalTitle.textContent = '단계 추가';
    stageNameInput.value = '';
    stageRoleSelect.value = '신입사원';
    stageDailyCheckbox.checked = false;
    stageModal.classList.add('show');
}

function openEditModal(stageId) {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;

    editingStageId = stageId;
    modalTitle.textContent = '단계 수정';
    stageNameInput.value = stage.name;
    stageRoleSelect.value = stage.role;
    stageDailyCheckbox.checked = stage.daily;
    stageModal.classList.add('show');
}

function closeModal() {
    stageModal.classList.remove('show');
    editingStageId = null;
}

// ============================================
// 단계 저장
// ============================================

function saveStage() {
    const name = stageNameInput.value.trim();
    const role = stageRoleSelect.value;
    const daily = stageDailyCheckbox.checked;

    if (!name) {
        alert('단계명을 입력해주세요.');
        return;
    }

    if (editingStageId) {
        // 수정
        const stage = stages.find(s => s.id === editingStageId);
        if (stage) {
            stage.name = name;
            stage.role = role;
            stage.daily = daily;
        }
    } else {
        // 추가
        const newId = Math.max(...stages.map(s => s.id), 0) + 1;
        stages.push({
            id: newId,
            name: name,
            role: role,
            daily: daily,
            count: 0
        });
    }

    saveData();
    renderPipeline();
    renderDaily();
    closeModal();
}

// ============================================
// 단계 삭제
// ============================================

function deleteStage(stageId) {
    if (confirm('이 단계를 삭제하시겠습니까?')) {
        stages = stages.filter(s => s.id !== stageId);
        saveData();
        renderPipeline();
        renderDaily();
    }
}

// ============================================
// Sortable 초기화 (드래그앤드롭)
// ============================================

function initSortable() {
    sortable = new Sortable(pipelineContainer, {
        animation: 200,
        ghostClass: 'sortable-ghost',
        onEnd: function(evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;

            // 배열 순서 변경
            const [movedItem] = stages.splice(oldIndex, 1);
            stages.splice(newIndex, 0, movedItem);

            // ID 재정렬
            stages.forEach((stage, index) => {
                stage.id = index + 1;
            });

            saveData();
            renderPipeline();
            renderDaily();
        }
    });
}

// ============================================
// 앱 시작
// ============================================

document.addEventListener('DOMContentLoaded', init);

// 전역 함수로 노출 (HTML onclick에서 사용)
window.updateStageCount = updateStageCount;
window.openEditModal = openEditModal;
window.deleteStage = deleteStage;
