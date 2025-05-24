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
                <li class="company-item p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition duration-200 cursor-pointer" data-id="${company.id || company.name}">
                    ${company.name || 'Unknown Company'}
                </li>
            `).join('')}
        </ul>
    `;
}

function renderCompanyDetails(company) {
    const content = document.getElementById('companyContent');
    content.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-info-circle mr-2 text-blue-500"></i> Company Details
        </h3>
        <p class="text-gray-800 mb-4 flex items-center">
            <i class="fas fa-id-badge mr-2 text-blue-500"></i>
            <span class="font-semibold">ID:</span> <span class="ml-2">${company.id || 'N/A'}</span>
        </p>
        <p class="text-gray-800 mb-4 flex items-center">
            <i class="fas fa-industry mr-2 text-blue-500"></i>
            <span class="font-semibold">Industry:</span> <span class="ml-2">${company.industry || 'N/A'}</span>
        </p>
        <p class="text-gray-800 flex items-center">
            <i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>
            <span class="font-semibold">Location:</span> <span class="ml-2">${company.location || 'N/A'}</span>
        </p>
        <button id="backButton" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
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

    // Card click to toggle company list
    card.addEventListener('click', (e) => {
        // Ignore clicks on company items or back button
        if (e.target.classList.contains('company-item') || e.target.id === 'backButton') return;

        if (companies.length === 0) return; // Do nothing if no data

        isExpanded = !isExpanded;
        if (isExpanded) {
            renderCompanyList(companies);
            content.classList.remove('hidden');
            document.getElementById('companyName').textContent = 'All Companies';
        } else {
            content.classList.add('hidden');
            document.getElementById('companyName').textContent = 'Click to View Companies';
        }
    });

    // Delegate click events for company items
    content.addEventListener('click', (e) => {
        const companyItem = e.target.closest('.company-item');
        if (companyItem) {
            const selectedId = companyItem.dataset.id;
            const selectedCompany = companies.find(company => (company.id || company.name) === selected-Id);
            if (selectedCompany) {
                renderCompanyDetails(selectedCompany);
                document.getElementById('companyName').textContent = selectedCompany.name || 'N/A';
                errorMessage.classList.add('hidden');
            }
        }
    });

    // Delegate click event for back button
    content.addEventListener('click', (e) => {
        if (e.target.id === 'backButton' || e.target.closest('#backButton')) {
            renderCompanyList(companies);
            document.getElementById('companyName').textContent = 'All Companies';
        }
    });
}

// Call on page load
init();