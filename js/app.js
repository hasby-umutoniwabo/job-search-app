/**
 * Main Application
 * Controls the overall application flow and connects UI with API
 */
class JobSearchApp {
    constructor() {
        this.ui = new UIController();
        this.api = apiService;
        
        // Current state
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentSearchParams = {};
        
        // Initialize app
        this.init();
    }
    
    // Initialize application

    init() {
        // Initialize UI event listeners
        this.ui.initEventListeners();
        
        // Add event listeners for search and pagination
        this.addEventListeners();
    }
    
    // Add application event listeners

    addEventListeners() {
        // Search button click
        this.ui.searchBtn.addEventListener('click', () => {
            this.currentPage = 1;
            this.performSearch();
        });
        
        // Enter key in search inputs
        [this.ui.jobTitleInput, this.ui.locationInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.currentPage = 1;
                    this.performSearch();
                }
            });
        });
        
        // Apply filters button
        this.ui.applyFiltersBtn.addEventListener('click', () => {
            this.currentPage = 1;
            this.performSearch();
        });
        
        // Pagination
        this.ui.prevPageBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.performSearch();
            }
        });
        
        this.ui.nextPageBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.performSearch();
            }
        });
    }
    
    // Perform job search based on current parameters

    async performSearch() {
        // Get search parameters from UI
        const params = this.ui.getSearchParams();
        
        // Validate basic search parameters
        if (!params.query && !params.location) {
            this.ui.showError('Please enter a job title or location to search');
            return;
        }
        
        // Show loading state
        this.ui.showLoading();
        
        try {
            // Prepare API search parameters
            const searchParams = {
                query: params.query,
                location: params.location,
                page: this.currentPage.toString(),
                num_pages: "1",
                employment_types: params.employmentType
            };
            
            // Add experience level if specified
            if (params.experience !== 'ALL') {
                searchParams.job_requirements = params.experience;
            }
            
            // Execute search
            const response = await this.api.searchJobs(searchParams);
            
            // Process search results
            if (response && response.data) {
                this.totalPages = Math.ceil(response.total / response.data.length) || 1;
                
                // Display jobs
                this.ui.displayJobs(response.data, response.total);
                
                // Setup pagination
                this.ui.setupPagination(this.currentPage, this.totalPages);
                
                // Save current search parameters
                this.currentSearchParams = searchParams;
                
                // Scroll to results
                document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
            } else {
                this.ui.showNoResults();
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.ui.showError('Failed to search jobs. Please try again later.');
        }
    }
}

// Wait for DOM to load then initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Create the app instance
    const app = new JobSearchApp();
});