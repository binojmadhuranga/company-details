async function getCompanies() {
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
        throw error; 
    }
}