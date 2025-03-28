// API Service for JSearch

class JSearchAPI {
    constructor() {
        // Validate config is properly set
        if (!CONFIG || !CONFIG.API_KEY) {
            console.error('API key not configured. Please update the config.js file with your RapidAPI key.');
            this.showConfigError();
        }
        
        this.baseUrl = CONFIG.BASE_URL;
        this.headers = {
            'X-RapidAPI-Key': CONFIG.API_KEY,
            'X-RapidAPI-Host': CONFIG.API_HOST
        };
    }
    
    // Show configuration error on the page

    showConfigError() {
        const errorSection = document.getElementById('error-message');
        errorSection.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>API configuration error. Please make sure you've added your RapidAPI key to the config.js file.</p>
        `;
        errorSection.classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
    }
    
    // Search for jobs based on specified parameters

    async searchJobs(params) {
        try {
            // Construct search parameters
            const queryParams = new URLSearchParams();
            
            if (params.query) {
                queryParams.append('query', params.query);
            }
            
            if (params.location) {
                queryParams.append('location', params.location);
            }
            
            if (params.page) {
                queryParams.append('page', params.page);
            }
            
            if (params.num_pages) {
                queryParams.append('num_pages', params.num_pages);
            }
            
            if (params.employment_types && params.employment_types !== 'ALL') {
                queryParams.append('employment_types', params.employment_types);
            }
            
            if (params.job_requirements && params.job_requirements !== 'ALL') {
                queryParams.append('job_requirements', params.job_requirements);
            }
            
            if (params.date_posted && params.date_posted !== 'ALL') {
                queryParams.append('date_posted', params.date_posted);
            }
            
            if (params.remote_jobs_only) {
                queryParams.append('remote_jobs_only', params.remote_jobs_only);
            }
            
            // Construct URL
            const url = `${this.baseUrl}/search?${queryParams.toString()}`;
            
            // Make API request
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
            
            // Handle non-200 responses
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            // Parse and return response
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }
    
    // Get job details by job ID

    async getJobDetails(jobId) {
        try {
            const url = `${this.baseUrl}/job-details?job_id=${encodeURIComponent(jobId)}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Search failed:', error);
            // Log more details about the error
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    }
    
    // Get estimated salary information

    async getEstimatedSalary(params) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.job_title) {
                queryParams.append('job_title', params.job_title);
            }
            
            if (params.location) {
                queryParams.append('location', params.location);
            }
            
            if (params.radius) {
                queryParams.append('radius', params.radius);
            }
            
            const url = `${this.baseUrl}/estimated-salary?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching salary estimation:', error);
            throw error;
        }
    }
}

// Create a single instance of the API service
const apiService = new JSearchAPI();