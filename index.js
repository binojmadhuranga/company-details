async function getAllCompanies() {
    try {
        const response = await fetch('https://student-api.acpt.lk/api/companies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const companies = await response.json();
        return companies;
    } catch (error) {
        console.error('Error fetching companies:', error.message);
        document.getElementById('errorMessage').classList.remove('hidden');
        return [];
    }
}

function renderCompanyList(companies) {
    const content = document.getElementById('companyContent');
    content.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-building mr-2 text-blue-500"></i> All Companies
        </h3>
        <ul class="space-y-2">
            ${companies.map(company => `
                <li class="company-item p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition duration-200 cursor-pointer" data-id="${company.company}">
                    ${company.company || 'Unknown Company'}
                </li>
            `).join('')}
        </ul>
    `;
}

function renderDepartmentList(company) {
    const content = document.getElementById('companyContent');
    content.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-users mr-2 text-blue-500"></i> Departments in ${company.company || 'N/A'}
        </h3>
        <ul class="space-y-2">
            ${company.departments.map(dept => `
                <li class="department-item p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition duration-200 cursor-pointer" data-dept="${dept.name}">
                    ${dept.name || 'Unknown Department'}
                </li>
            `).join('')}
        </ul>
        <button id="backToCompanies" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i> Back to Companies
        </button>
    `;
}

function renderDepartmentDetails(dept, companyName) {
    const content = document.getElementById('companyContent');
    content.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-info-circle mr-2 text-blue-500"></i> ${dept.name || 'N/A'} Details
        </h3>
        <p class="text-gray-800 mb-4 flex items-center">
            <i class="fas fa-building mr-2 text-blue-500"></i>
            <span class="font-semibold">Company:</span> <span class="ml-2">${companyName || 'N/A'}</span>
        </p>
        <p class="text-gray-800 mb-4 flex items-center">
            <i class="fas fa-users mr-2 text-blue-500"></i>
            <span class="font-semibold">Department:</span> <span class="ml-2">${dept.name || 'N/A'}</span>
        </p>
        <div class="mb-4">
            <h4 class="text-md font-semibold text-gray-800 flex items-center">
                <i class="fas fa-user-tie mr-2 text-blue-500"></i> Employees
            </h4>
            <ul class="list-disc ml-6">
                ${dept.employees.map(emp => `
                    <li class="text-gray-700">
                        ${emp.name || 'N/A'} (${emp.position || 'N/A'})
                        <ul class="list-circle ml-6">
                            ${emp.skills.map(skill => `<li>${skill || 'N/A'}</li>`).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        </div>
        <button id="backToDepartments" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i> Back to Departments
        </button>
        <button id="backToCompanies" class="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i> Back to Companies
        </button>
    `;
}


async function init() {
    const companies = await getAllCompanies();
    const card = document.getElementById('companyCard');
    const content = document.getElementById('companyContent');
    const errorMessage = document.getElementById('errorMessage');
    let isExpanded = false;
    let selectedCompany = null;
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('company-item') || 
            e.target.classList.contains('department-item') || 
            e.target.id === 'backToCompanies' || 
            e.target.id === 'backToDepartments' || 
            e.target.closest('#backToCompanies') || 
            e.target.closest('#backToDepartments')) return;

        if (companies.length === 0) return;

        isExpanded = !isExpanded;
        if (isExpanded) {
            renderCompanyList(companies);
            content.classList.remove('hidden');
            document.getElementById('companyName').textContent = 'All Companies';
        } else {
            content.classList.add('hidden');
            document.getElementById('companyName').textContent = 'Click to View Companies';
            selectedCompany = null;
        }
    });

    
    content.addEventListener('click', (e) => {
        const companyItem = e.target.closest('.company-item');
        if (companyItem) {
            const selectedId = companyItem.dataset.id;
            selectedCompany = companies.find(company => company.company === selectedId);
            if (selectedCompany) {
                renderDepartmentList(selectedCompany);
                document.getElementById('companyName').textContent = selectedCompany.company || 'N/A';
                errorMessage.classList.add('hidden');
            }
        }
    });

    content.addEventListener('click', (e) => {
        const departmentItem = e.target.closest('.department-item');
        if (departmentItem && selectedCompany) {
            const selectedDeptName = departmentItem.dataset.dept;
            const selectedDept = selectedCompany.departments.find(dept => dept.name === selectedDeptName);
            if (selectedDept) {
                renderDepartmentDetails(selectedDept, selectedCompany.company);
                document.getElementById('companyName').textContent = selectedCompany.company || 'N/A';
                errorMessage.classList.add('hidden');
            }
        }
    });

    content.addEventListener('click', (e) => {
        if (e.target.id === 'backToCompanies' || e.target.closest('#backToCompanies')) {
            renderCompanyList(companies);
            document.getElementById('companyName').textContent = 'All Companies';
            selectedCompany = null;
        } else if (e.target.id === 'backToDepartments' || e.target.closest('#backToDepartments')) {
            if (selectedCompany) {
                renderDepartmentList(selectedCompany);
                document.getElementById('companyName').textContent = selectedCompany.company || 'N/A';
            }
        }
    });
}

init();
