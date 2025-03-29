/**
 * UI Controller Class
 * Handles all UI interactions and updates
 */
class UIController {
    constructor() {
        // DOM Elements
        this.jobTitleInput = document.getElementById('job-title');
        this.locationInput = document.getElementById('location');
        this.experienceSelect = document.getElementById('experience');
        this.searchBtn = document.getElementById('search-btn');
        
        this.filtersSection = document.getElementById('filters-section');
        this.sortBySelect = document.getElementById('sort-by');
        this.employmentTypeSelect = document.getElementById('employment-type');
        this.applyFiltersBtn = document.getElementById('apply-filters');
        
        this.loadingElement = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        this.noResults = document.getElementById('no-results');
        this.resultsInfo = document.getElementById('results-info');
        this.resultsCount = document.getElementById('results-count');
        this.jobListings = document.getElementById('job-listings');
        
        this.pagination = document.getElementById('pagination');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.currentPageSpan = document.getElementById('current-page');
        this.totalPagesSpan = document.getElementById('total-pages');
        
        this.jobModal = document.getElementById('job-modal');
        this.jobDetailContent = document.getElementById('job-detail-content');
        this.closeModal = document.querySelector('.close-modal');
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.loadingElement.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
        this.noResults.classList.add('hidden');
        this.resultsInfo.classList.add('hidden');
        this.jobListings.innerHTML = '';
        this.pagination.classList.add('hidden');
    }
    
    /**
     * Hide loading state
     */
    hideLoading() {
        this.loadingElement.classList.add('hidden');
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.errorMessage.querySelector('p').textContent = message || 'An error occurred while fetching jobs.';
        this.errorMessage.classList.remove('hidden');
        this.loadingElement.classList.add('hidden');
        this.noResults.classList.add('hidden');
        this.resultsInfo.classList.add('hidden');
        this.pagination.classList.add('hidden');
    }
    
    /**
     * Show no results message
     */
    showNoResults() {
        this.noResults.classList.remove('hidden');
        this.loadingElement.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.resultsInfo.classList.add('hidden');
        this.pagination.classList.add('hidden');
    }
    
    /**
     * Show filters section
     */
    showFilters() {
        this.filtersSection.classList.remove('hidden');
    }
    
    /**
     * Format date from API to readable format
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }
    
    /**
     * Format salary to readable format
     */
    formatSalary(job) {
        if (
            job.salary_min && 
            job.salary_max && 
            job.salary_currency_code
        ) {
            const min = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: job.salary_currency_code,
                maximumFractionDigits: 0
            }).format(job.salary_min);
            
            const max = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: job.salary_currency_code,
                maximumFractionDigits: 0
            }).format(job.salary_max);
            
            return `${min} - ${max}`;
        }
        
        return 'Salary not specified';
    }
    
    /**
     * Create job card element
     */
    createJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.dataset.jobId = job.job_id;
        
        // Create placeholder text from employer name for fallback image
        const employerInitial = job.employer_name ? job.employer_name.charAt(0) : 'C';
        
        // Company logo with local fallback instead of placeholder.com
        const companyLogo = job.employer_logo || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Crect width='30' height='30' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3E${employerInitial}%3C/text%3E%3C/svg%3E`;
        
        // Format job location
        let location = 'Remote';
        if (job.job_city && job.job_country) {
            location = `${job.job_city}, ${job.job_country}`;
        } else if (job.job_country) {
            location = job.job_country;
        }
        
        // Format job type
        let jobType = 'Not specified';
        if (job.job_employment_type) {
            switch(job.job_employment_type) {
                case 'FULLTIME':
                    jobType = 'Full Time';
                    break;
                case 'PARTTIME':
                    jobType = 'Part Time';
                    break;
                case 'CONTRACTOR':
                    jobType = 'Contractor';
                    break;
                case 'INTERN':
                    jobType = 'Internship';
                    break;
                default:
                    jobType = job.job_employment_type;
            }
        }
        
        // Format salary
        const salary = this.formatSalary(job);
        
        // Create job card HTML
        jobCard.innerHTML = `
            <h3>${job.job_title}</h3>
            <div class="job-company">
                <img src="${companyLogo}" alt="${job.employer_name}" onerror="this.style.backgroundColor='#3498db'; this.style.color='white'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.width='30px'; this.style.height='30px'; this.style.borderRadius='50%'; this.textContent='${employerInitial}';">
                <span>${job.employer_name}</span>
            </div>
            <div class="job-details">
                <div class="job-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-briefcase"></i>
                    <span>${jobType}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${salary}</span>
                </div>
            </div>
            <div class="job-description">
                ${job.job_description || 'No description available'}
            </div>
            <div class="job-action">
                <a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply Now</a>
                <span class="job-date">${this.formatDate(job.job_posted_at_datetime_utc)}</span>
            </div>
        `;
        
        // Add event listener to show job details
        jobCard.addEventListener('click', (e) => {
            // Don't trigger if clicking on Apply button
            if (e.target.classList.contains('apply-btn')) {
                return;
            }
            
            this.showJobDetails(job.job_id);
        });
        
        return jobCard;
    }
    
    /**
     * Display job listings
     */
    displayJobs(jobs, count) {
        this.hideLoading();
        
        if (!jobs || jobs.length === 0) {
            this.showNoResults();
            return;
        }
        
        // Show results count
        this.resultsInfo.classList.remove('hidden');
        this.resultsCount.textContent = count || jobs.length;
        
        // Clear previous results
        this.jobListings.innerHTML = '';
        
        // Add job cards
        jobs.forEach(job => {
            const jobCard = this.createJobCard(job);
            this.jobListings.appendChild(jobCard);
        });
        
        // Show filters
        this.showFilters();
    }
    
    /**
     * Setup pagination
     */
    setupPagination(currentPage, totalPages) {
        if (totalPages <= 1) {
            this.pagination.classList.add('hidden');
            return;
        }
        
        this.pagination.classList.remove('hidden');
        this.currentPageSpan.textContent = currentPage;
        this.totalPagesSpan.textContent = totalPages;
        
        // Enable/disable pagination buttons
        this.prevPageBtn.disabled = currentPage <= 1;
        this.nextPageBtn.disabled = currentPage >= totalPages;
    }
    
    /**
     * Show job details in modal
     */
    displayJobDetails(job) {
        if (!job) {
            this.showError('Failed to load job details');
            return;
        }
        
        // Create placeholder text from employer name for fallback image
        const employerInitial = job.employer_name ? job.employer_name.charAt(0) : 'C';
        
        // Company logo with SVG fallback
        const companyLogo = job.employer_logo || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${employerInitial}%3C/text%3E%3C/svg%3E`;
        
        // Format job location
        let location = 'Remote';
        if (job.job_city && job.job_country) {
            location = `${job.job_city}, ${job.job_country}`;
        } else if (job.job_country) {
            location = job.job_country;
        }
        
        // Format job type
        let jobType = 'Not specified';
        if (job.job_employment_type) {
            switch(job.job_employment_type) {
                case 'FULLTIME':
                    jobType = 'Full Time';
                    break;
                case 'PARTTIME':
                    jobType = 'Part Time';
                    break;
                case 'CONTRACTOR':
                    jobType = 'Contractor';
                    break;
                case 'INTERN':
                    jobType = 'Internship';
                    break;
                default:
                    jobType = job.job_employment_type;
            }
        }
        
        // Format salary
        const salary = this.formatSalary(job);
        
        // Create job detail HTML
        this.jobDetailContent.innerHTML = `
            <div class="job-detail-header">
                <h2>${job.job_title}</h2>
                <div class="job-company">
                    <img src="${companyLogo}" alt="${job.employer_name}" onerror="this.style.backgroundColor='#3498db'; this.style.color='white'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.width='50px'; this.style.height='50px'; this.style.borderRadius='50%'; this.textContent='${employerInitial}';">
                    <h3>${job.employer_name}</h3>
                </div>
            </div>
            
            <div class="job-detail-info">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-briefcase"></i>
                    <span>${jobType}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${salary}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Posted: ${this.formatDate(job.job_posted_at_datetime_utc)}</span>
                </div>
            </div>
            
            <div class="job-description-full">
                <h4>Job Description</h4>
                <div>
                    ${job.job_description || 'No description available'}
                </div>
            </div>
            
            <div class="job-detail-footer">
                <a href="${job.job_apply_link}" target="_blank" class="apply-btn">Apply on ${job.job_publisher}</a>
            </div>
        `;
        
        // Show modal
        this.jobModal.classList.remove('hidden');
    }
    
    /**
     * Show job details by ID
     */
    async showJobDetails(jobId) {
        try {
            // Show loading in modal
            this.jobDetailContent.innerHTML = `
                <div class="loading-modal">
                    <div class="spinner"></div>
                    <p>Loading job details...</p>
                </div>
            `;
            
            this.jobModal.classList.remove('hidden');
            
            // Fetch job details from API
            const response = await apiService.getJobDetails(jobId);
            
            if (response && response.data && response.data.length > 0) {
                this.displayJobDetails(response.data[0]);
            } else {
                throw new Error('Job details not found');
            }
        } catch (error) {
            console.error('Error showing job details:', error);
            this.jobDetailContent.innerHTML = `
                <div class="error-modal">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load job details. Please try again.</p>
                </div>
            `;
        }
    }
    
    /**
     * Get current search parameters from UI
     */
    getSearchParams() {
        return {
            query: this.jobTitleInput.value.trim(),
            location: this.locationInput.value.trim(),
            experience: this.experienceSelect.value,
            employmentType: this.employmentTypeSelect.value,
            sortBy: this.sortBySelect.value
        };
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Close modal when clicking X or outside
        this.closeModal.addEventListener('click', () => {
            this.jobModal.classList.add('hidden');
        });
        
        this.jobModal.addEventListener('click', (e) => {
            if (e.target === this.jobModal) {
                this.jobModal.classList.add('hidden');
            }
        });
        
        // Prevent default form submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => e.preventDefault());
        });
    }
}