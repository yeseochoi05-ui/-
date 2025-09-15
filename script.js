document.addEventListener('DOMContentLoaded', () => {
    // 1. 주간 강의 체크 기능
    const totalLecturesSpan = document.getElementById('total-lectures');
    const dayGroups = document.querySelectorAll('.checkbox-group');
    const checkboxesPerDay = 10;

    dayGroups.forEach(group => {
        for (let i = 0; i < checkboxesPerDay; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${group.dataset.day}-lecture-${i + 1}`;
            checkbox.name = `${group.dataset.day}-lecture`;
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            
            group.appendChild(checkbox);
            group.appendChild(label);
        }
    });

    const allCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').length;
            totalLecturesSpan.textContent = checkedCount;
        });
    });

    // 2. 진도율 계산기 기능
    const courseNameInput = document.getElementById('course-name');
    const totalLecturesInput = document.getElementById('total-lectures-count');
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseList = document.getElementById('course-list');

    // '과목 추가하기' 버튼 클릭 이벤트
    addCourseBtn.addEventListener('click', () => {
        const courseName = courseNameInput.value.trim();
        const totalLectures = parseInt(totalLecturesInput.value);

        if (courseName && !isNaN(totalLectures) && totalLectures > 0) {
            addCourseCard(courseName, totalLectures);
            courseNameInput.value = '';
            totalLecturesInput.value = '';
        } else {
            alert('과목명과 총 강의 수를 올바르게 입력해주세요.');
        }
    });

    // 새로운 과목 카드(칸)를 생성하는 함수
    function addCourseCard(courseName, totalLectures) {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';

        courseCard.innerHTML = `
            <p class="course-info">${courseName} (${totalLectures}강)</p>
            <div class="progress-input-group">
                <label>수강한 강의 수:</label>
                <input type="number" min="0" class="completed-lectures-input">
            </div>
            <div class="result-info">
                <span>남은 강의: <span class="remaining-lectures">0</span>강</span>
                <span class="progress-percentage">0.0%</span>
            </div>
        `;

        courseList.appendChild(courseCard);

        const completedInput = courseCard.querySelector('.completed-lectures-input');
        const remainingSpan = courseCard.querySelector('.remaining-lectures');
        const percentageSpan = courseCard.querySelector('.progress-percentage');

        // 입력 시 실시간 계산 이벤트 리스너 추가
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
        });
    }
});