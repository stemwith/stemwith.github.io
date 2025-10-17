// static/js/analytics-chart.js

// --- 설정 (본인 환경에 맞게 수정) ---
const apiKey = 'AIzaSyDGTPUPjkDvjOtxKJOxbwZxXIBBGdZDB2c'; // 본인의 API 키로 수정
const propertyId = '287689070'; // 본인의 GA4 속성 ID로 수정
const startDate = '2020-03-15'; // GA4 속성을 생성한 날짜 또는 그 이전
// ------------------------------------

// API 요청 데이터 구성
const requestBody = {
  property: `properties/${propertyId}`,
  dateRanges: [
    { startDate: '14daysAgo', endDate: 'today', name: 'recent' }, // 1. 최근 14일 데이터
    { startDate: 'today', endDate: 'today', name: 'today' }, // 2. 오늘 하루 데이터
    { startDate: startDate, endDate: 'today', name: 'allTime' }, // 3. 전체 기간 누적 데이터
  ],
  dimensions: [{ name: 'date' }], // 날짜별로 데이터를 보기 위해 추가
  metrics: [
    { name: 'activeUsers' },
    { name: 'screenPageViews' }
  ],
};

// 숫자 포맷팅 함수 (예: 15432 -> 15,432)
function formatNumber(num) {
  // num이 유효하지 않은 값이면 0을 반환
  if (!num || isNaN(parseInt(num))) {
    return '0';
  }
  return parseInt(num).toLocaleString();
}

async function getAnalyticsData() {
  try {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();

    // 1. 데이터 파싱 (올바른 API 응답 구조 사용)
    // reportTasks는 dateRanges 순서대로 결과를 담고 있음
    const recentData = data.reportTasks[0].report.rows || [];
    const todayData = data.reportTasks[1].report.rows || [];
    const allTimeData = data.reportTasks[2].report.rows || [];

    // 2. 핵심 지표 업데이트
    const todayVisitors = todayData.length > 0 ? todayData[0].metricValues[0].value : '0';
    document.getElementById('ga-today-visitors').textContent = `👤 ${formatNumber(todayVisitors)} visitors`;

    // 전체 기간 데이터로 총 방문자/페이지뷰 업데이트
    const totalVisitors = allTimeData.length > 0 ? allTimeData[0].metricValues[0].value : '0';
    const totalPageviews = allTimeData.length > 0 ? allTimeData[0].metricValues[1].value : '0';
    document.getElementById('ga-total-visitors').textContent = `- Visitors: ${formatNumber(totalVisitors)}`;
    document.getElementById('ga-total-pageviews').textContent = `- Pageviews: ${formatNumber(totalPageviews)}`;

    // 3. 차트 데이터 준비
    const chartLabels = recentData.map(row => {
        const dateStr = row.dimensionValues[0].value; // "20251012"
        return `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`; // "10/12"
    });
    const chartSeries = recentData.map(row => parseInt(row.metricValues[0].value));

    // 4. 차트 렌더링
    renderChart(chartLabels, chartSeries);

  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    // 에러 발생 시 사용자에게 ... 대신 에러 상태임을 알려줄 수 있습니다.
    document.getElementById('ga-today-visitors').textContent = `👤 Error`;
  }
}

function renderChart(labels, series) {
  const options = {
    series: [{ name: 'Visitors', data: series }],
    chart: {
      type: 'bar',
      height: 80,
      sparkline: { enabled: true }, // Y축, 그리드 등을 숨겨 심플하게 만듦
    },
    tooltip: {
      x: { show: false },
      y: { title: { formatter: () => '' } }, // 툴팁 제목 숨김
      marker: { show: false },
    },
    colors: ['#5c95e9'], // Hugo-Book 테마와 어울리는 색상
  };

  const chart = new ApexCharts(document.querySelector("#ga-daily-chart"), options);
  chart.render();
}

// 페이지가 로드된 후 자동 실행
document.addEventListener('DOMContentLoaded', () => {
  getAnalyticsData();
});