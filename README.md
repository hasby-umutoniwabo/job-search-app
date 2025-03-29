# Job Search Application

A professional web application that fetches and displays job listings from the JSearch API. This application helps users find their dream jobs by searching, filtering, and applying to opportunities across multiple job platforms.

[Job Search App Screenshot](https://github.com/user-attachments/assets/bad8e90d-f1b3-4f14-977e-de710a98aa15)

## 📋 Features

- **Search Jobs**: Find jobs by title, location, and experience level
- **Advanced Filtering**: Filter results by employment type, date posted, and more
- **Sorting Options**: Sort jobs by relevance, date, or salary
- **Detailed Job Information**: View comprehensive job details including salary, company info, and requirements
- **Mobile Responsive**: Optimized for all devices - desktop, tablet, and mobile
- **Error Handling**: Robust error handling for API issues with user-friendly messages
- **Load Balanced**: Deployed across multiple servers for high availability

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: JSearch API via RapidAPI
- **Deployment**: Nginx web servers with load balancing
- **Styling**: Custom CSS with responsive design

## 🔍 API Credits

This application uses the [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) provided through RapidAPI. JSearch aggregates job listings from various sources including LinkedIn, Indeed, Glassdoor, and company career pages.

Per the project requirements, proper attribution is given to the API providers, and all API usage complies with their terms of service.

## 🚀 Local Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A RapidAPI account with subscription to the JSearch API
- Basic understanding of HTML, CSS, and JavaScript (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hasby-umutoniwabo/job-search-app.git
   cd job-search-app
   ```

2. Create your configuration file:
   ```bash
   cp js/config.js.example js/config.js
   ```

3. Open `js/config.js` in your editor and add your RapidAPI key:
   ```javascript
   const CONFIG = {
       API_KEY: '88459c5889msh287ead8ebce95acp1e62fcjsn81bc45bd224e',
       API_HOST: 'jsearch.p.rapidapi.com',
       BASE_URL: 'https://jsearch.p.rapidapi.com'
   };
   ```

4. Open the application:
   - Use a local web server (recommended):
     ```bash
     # Using Python 3's built-in server
     python -m http.server
     
     # Or using Node.js with http-server
     npx http-server
     ```
   - Or simply open `index.html` in your browser

## 🌐 Deployment

This application is designed for deployment across multiple servers with load balancing to ensure high availability and optimal performance.

### Architecture

```
                  ┌─────────────┐
                  │             │
 User Requests ───►  Load       │
                  │  Balancer   │
                  │  (Lb01)     │
                  │             │
                  └──────┬──────┘
                         │
                         ▼
          ┌──────────────────────────┐
          │                          │
┌─────────▼──────────┐    ┌──────────▼─────────┐
│                    │    │                     │
│  Web Server 01     │    │  Web Server 02      │
│  (Web01)           │    │  (Web02)            │
│                    │    │                     │
└────────────────────┘    └─────────────────────┘
```

### Deployment Guide

Detailed deployment instructions are available in [deployment/setup-instructions.md](deployment/setup-instructions.md), covering:

- Server provisioning and configuration
- Nginx setup for web servers and load balancer
- Security best practices
- Performance optimization
- Monitoring recommendations

## 📱 Demo

A short video demonstration showcasing the application's functionality:
[Watch Demo Video](https://youtu.be/your-demo-video)

## 🔒 Security Considerations

- API keys are stored securely and not exposed to clients
- Proper error handling prevents revealing sensitive information
- Input validation is implemented to prevent injection attacks
- CORS policies are configured for production environments

## 🧩 Code Structure

```
job-search-app/
├── index.html          # Main HTML file
├── css/
│   ├── style.css       # Main styles
│   └── responsive.css  # Responsive design styles
├── js/
│   ├── config.js.example  # API configuration template
│   ├── api.js          # API service handling
│   ├── ui.js           # UI controller
│   └── app.js          # Main application logic
└── deployment/         # Deployment configurations and instructions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚧 Challenges and Solutions

During development, we faced several challenges:

1. **API Rate Limiting**: Implemented caching and optimized API calls to stay within limits
2. **Mobile Responsiveness**: Created a fully adaptive design that works across all devices
3. **Error Handling**: Developed robust error handling for various API failure scenarios
4. **Load Balancing**: Configured round-robin load balancing with health checks for reliability

## 📊 Future Improvements

Potential enhancements for future versions:

- User authentication for saving favorite jobs
- Job application tracking
- Email notifications for new job matches
- Advanced filters for salary range and company size
- Data visualization for salary trends by location and position
