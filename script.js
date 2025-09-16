document.addEventListener('DOMContentLoaded', () => {
    // 1. 주간 강의 체크 기능
    const totalLecturesSpan = document.getElementById('total-lectures');
    const dayGroups = document.querySelectorAll('.checkbox-group');
    const checkboxesPerDay = 10;

    // 페이지 로드 시 로컬 스토리지에서 저장된 체크박스 상태를 불러와 적용
    const savedDailyChecks = JSON.parse(localStorage.getItem('dailyChecks')) || {};

    dayGroups.forEach(group => {
        const day = group.dataset.day;
        const savedChecks = savedDailyChecks[day] || [];

        for (let i = 0; i < checkboxesPerDay; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${day}-lecture-${i + 1}`;
            checkbox.name = `${day}-lecture`;
            checkbox.checked = savedChecks[i] || false; // 저장된 상태 적용
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            
            group.appendChild(checkbox);
            group.appendChild(label);
        }
    });

    const allCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    
    // 체크박스 상태 변경 감지
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').length;
            totalLecturesSpan.textContent = checkedCount;
            
            // 변경된 체크박스 상태를 로컬 스토리지에 저장
            const dailyChecks = {};
            dayGroups.forEach(group => {
                const day = group.dataset.day;
                const checkboxes = group.querySelectorAll('input[type="checkbox"]');
                dailyChecks[day] = Array.from(checkboxes).map(cb => cb.checked);
            });
            localStorage.setItem('dailyChecks', JSON.stringify(dailyChecks));
        });
    });

    // 초기 총 강의 수 업데이트
    const initialCheckedCount = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').length;
    totalLecturesSpan.textContent = initialCheckedCount;

    // 2. 진도율 계산기 기능
    const courseNameInput = document.getElementById('course-name');
    const totalLecturesInput = document.getElementById('total-lectures-count');
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseList = document.getElementById('course-list');
    const courseKey = 'savedCourses';

    // 페이지 로드 시 로컬 스토리지에서 저장된 과목 목록을 불러와 표시
    const savedCourses = JSON.parse(localStorage.getItem(courseKey)) || [];
    savedCourses.forEach(course => addCourseCard(course.name, course.total, course.completed));

    // '과목 추가하기' 버튼 클릭 이벤트
    addCourseBtn.addEventListener('click', () => {
        const courseName = courseNameInput.value.trim();
        const totalLectures = parseInt(totalLecturesInput.value);

        if (courseName && !isNaN(totalLectures) && totalLectures > 0) {
            addCourseCard(courseName, totalLectures, 0);
            
            // 새로운 과목 정보를 로컬 스토리지에 저장
            const updatedCourses = JSON.parse(localStorage.getItem(courseKey)) || [];
            updatedCourses.push({ name: courseName, total: totalLectures, completed: 0 });
            localStorage.setItem(courseKey, JSON.stringify(updatedCourses));

            courseNameInput.value = '';
            totalLecturesInput.value = '';
        } else {
            alert('과목명과 총 강의 수를 올바르게 입력해주세요.');
        }
    });

    // 새로운 과목 카드(칸)를 생성하고 로컬 스토리지에 연동하는 함수
    function addCourseCard(courseName, totalLectures, initialCompleted) {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';

        courseCard.innerHTML = `
            <p class="course-info">${courseName} (${totalLectures}강)</p>
            <div class="progress-input-group">
                <label>수강한 강의 수:</label>
                <input type="number" min="0" class="completed-lectures-input" value="${initialCompleted}">
            </div>
            <div class="result-info">
                <span>남은 강의: <span class="remaining-lectures"></span>강</span>
                <span class="progress-percentage"></span>
            </div>
        `;

        courseList.appendChild(courseCard);

        const completedInput = courseCard.querySelector('.completed-lectures-input');
        const remainingSpan = courseCard.querySelector('.remaining-lectures');
        const percentageSpan = courseCard.querySelector('.progress-percentage');

        // 입력 시 실시간 계산 및 로컬 스토리지 저장 이벤트 리스너 추가
        completedInput.addEventListener('input', () => {
            const completedLectures = parseInt(completedInput.value);

            if (isNaN(completedLectures) || completedLectures < 0 || completedLectures > totalLectures) {
                remainingSpan.textContent = '오류';
                percentageSpan.textContent = '오류';
                return;
            }

            const remainingLectures = totalLectures - completedLectures;
            const progressPercentage = ((completedLectures / totalLectures) * 100).toFixed(1);

            remainingSpan.textContent = remainingLectures;
            percentageSpan.textContent = `${progressPercentage}%`;

            // 로컬 스토리지 데이터 업데이트
            const updatedCourses = JSON.parse(localStorage.getItem(courseKey)) || [];
            const courseToUpdate = updatedCourses.find(c => c.name === courseName);
            if (courseToUpdate) {
                courseToUpdate.completed = completedLectures;
                localStorage.setItem(courseKey, JSON.stringify(updatedCourses));
            }
        });

        // 초기 계산 실행
        const initialRemaining = totalLectures - initialCompleted;
        const initialPercentage = ((initialCompleted / totalLectures) * 100).toFixed(1);
        remainingSpan.textContent = initialRemaining;
        percentageSpan.textContent = `${initialPercentage}%`;
    }
});